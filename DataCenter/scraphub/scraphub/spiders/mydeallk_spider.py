import scrapy
from ..items import ScraphubItem
import logging
import cssutils
from bs4 import BeautifulSoup
import urllib.request
from urllib.parse import urlparse

import os
from google.cloud import storage
import tempfile

class MydeallkSpider(scrapy.Spider):
    name = 'Mydeallk'

    start_urls = [
        'https://www.mydeal.lk/deals/?page=1'#%d' % page for page in range(1,5) #daily deals with 5 page pagination proper solution required
    ]

    def parse(self, response):
        items = ScraphubItem()
        tempfolder = tempfile.TemporaryDirectory(dir  =  "D:/")
        for deal_ in response.css('div.panel-body'):
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
                # upload_blob('scraphub-store', '%s/'%(tempfolder.name) + image_name, 'Uploads/'+ image_name)

            items['description'] = deal_.css('a::text').get()
            items['discount'] = deal_.css('div.deal-discount::text').get()
            items['imgurl'] = 'https://storage.cloud.google.com/scraphub-store/Uploads/' + image_name
            # items['acprice'] = deal_.css('small.selectorgadget_selected::text').get()
            # items['href'] = deal_.css('a::attr(href)')
            yield items
        tempfolder.cleanup()
