import scrapy
from ..items import ScraphubItem
import logging
from ..global_variable import GlobalVariable
from ..bucket_uploader import BucketUploader
import os
import urllib.request
from urllib.parse import urlparse
import tempfile
import datetime
import json
import uuid


class PromolkSpider(scrapy.Spider):
    name = 'Promolk'

    start_urls = [
        'https://www.promo.lk/promotions'
    ]
    service_config = GlobalVariable.config()['service_configurations']

    def parse(self, response):
        items = ScraphubItem()
        image_name = None
        url = None
        tempfolder = tempfile.TemporaryDirectory(dir  =  self.service_config['temp_dir'])
        for promo_ in response.css('div.mBtm-10'):
            metadata = {}
            metadata['source'] = self.start_urls
            url = None
            image_name = None
            pr = promo_.css('div.image').get()

            if pr is not None:
                url =(GlobalVariable.urlRegx(pr)).replace('/thumb','')
                image_name = os.path.basename(urlparse(url).path)
                opener = urllib.request.URLopener()
                opener.addheader('User-Agent', 'Mozilla/5.0')
                filename, headers = opener.retrieve(url, '%s/'%(tempfolder.name) + image_name) 
                BucketUploader.upload_blob('%s/'%(tempfolder.name) + image_name, self.service_config['bucket_PATH'] + str(image_name))

                items['description'] = promo_.css('div.title::text').get()
                items['discount'] = 'undefined'
                items['imgurl'] = self.service_config['bucket_baseURL'] + str(image_name)
                items['base_amount'] = 'undefined'
                items['source_href'] = 'undefined' # This need to handel properly
                items['fetched_date'] = datetime.datetime.today()
                metadata['expire'] = promo_.css('span.expirydate::text').get()
                items['meta'] = json.dumps(metadata)
                items['is_automated'] = True
                items['postid'] = str(uuid.uuid1()) 
                yield items
        tempfolder.cleanup()