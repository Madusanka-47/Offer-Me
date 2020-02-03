import scrapy
from ..items import ScraphubItem
import logging


class PromolkSpider(scrapy.Spider):
    name = 'Promo'

    start_urls = [
        'https://www.promo.lk/promotions'
    ]

    def parse(self, response):
        items = ScraphubItem()
        for promo_ in response.css('div.mBtm-10'):
            items['description'] = promo_.css('div.title::text').get()
            yield items