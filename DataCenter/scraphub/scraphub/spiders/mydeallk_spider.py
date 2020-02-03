import scrapy
from ..items import ScraphubItem
import logging

class MydeallkSpider(scrapy.Spider):
    name = 'Mydeallk'

    start_urls = [
        'https://www.mydeal.lk/deals/?page=1'#%d' % page for page in range(1,5) #daily deals with 5 page pagination proper solution required
    ]

    def parse(self, response):
        items = ScraphubItem()
        for deal_ in response.css('div.panel-body'):
            items['description'] = deal_.css('a::text').get()
            items['discount'] = deal_.css('div.deal-discount::text').get()
            items['imgurl'] = deal_.css('div.deal-image::text').get()
            items['acprice'] = deal_.css('small.selectorgadget_selected::text').get()
            items['href'] = deal_.css('a::attr(href)')
            yield items