import scrapy

class PromolkSpider(scrapy.Spider):
    name = 'Promo.lk'

    start_urls = [
        'https://www.promo.lk/promotions'
    ]

    def parse(self, response):
        for promo_ in response.css('div.mBtm-10'):
            yield {
                'title': promo_.css('div.title::text').get()
            }