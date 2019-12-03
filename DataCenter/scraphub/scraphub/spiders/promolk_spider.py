import scrapy
from ..items import ScraphubItem

class PromolkSpider(scrapy.Spider):
    name = 'Promo.lk'

    start_urls = [
        'https://www.promo.lk/promotions'
    ]

    def parse(self, response):
        items = ScraphubItem()
        for promo_ in response.css('div.mBtm-10'):
            items['title'] = promo_.css('div.title::text').get()
            yield items