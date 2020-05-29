import scrapy
from ..items import ScraphubItem
import logging
from ..bucket_uploader import BucketUploader
from ..global_variable import GlobalVariable
from google.cloud import storage
import tempfile
from bs4 import BeautifulSoup
import cssutils
import urllib.request
from urllib.parse import urlparse
import os
import datetime
import json
import uuid

class MydeallkSpider(scrapy.Spider):
    name = 'Mydeallk'

    start_urls = [
        'https://www.mydeal.lk/deals/?page=%d' % page for page in range(1,5)
    ]
    service_config = GlobalVariable.config()['service_configurations']
    

    def parse(self, response):
        items = ScraphubItem()
        tempfolder = tempfile.TemporaryDirectory(dir  =  self.service_config['temp_dir'])
        for deal_ in response.css('div.panel-body'):
            metadata = {}
            metadata['source'] = self.start_urls
            url = None
            image_name = None
            ccssrc_ = deal_.css('div.deal-image').get()
            if ccssrc_ is not None:
                soup = BeautifulSoup(ccssrc_)
                div_style = soup.find('div')['style']
                sheet = cssutils.css.CSSStyleSheet()
                sheet.add("dummy_selector { %s }" % div_style)
                url = list(cssutils.getUrls(sheet))[0]
                image_name = os.path.basename(urlparse(url).path)
                opener = urllib.request.URLopener()
                opener.addheader('User-Agent', 'Mozilla/5.0')
                filename, headers = opener.retrieve(url, '%s/'%(tempfolder.name) + image_name) 
                BucketUploader.upload_blob('%s/'%(tempfolder.name) + image_name, self.service_config['bucket_PATH'] + str(image_name))
                items['description'] = deal_.css('a::text').get()
                items['discount'] = deal_.css('div.deal-discount::text').get()
                items['imgurl'] = self.service_config['bucket_baseURL'] + str(image_name)
                items['base_amount'] = deal_.css('small::text').get() #recorded as a string this need to fixed for intiger
                items['source_href'] = GlobalVariable.urlRegx(deal_.css('a').get()) # This need to handel properly
                items['fetched_date'] = datetime.datetime.today()
                # print(deal_.css('div.col-sm-3').get())
                # metadata['expire'] = deal_.css('span.expirydate::text').get()
                items['meta'] =  json.dumps(metadata)
                items['is_automated'] = True
                items['postid'] = str(uuid.uuid1()) 
                # items['current_amount'] = deal_.css('span::text').get()
                yield items
        tempfolder.cleanup()
