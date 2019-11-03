from scrapy.crawler import CrawlerProcess
import importlib
from promolk_spider import PromolkSpider

process = CrawlerProcess(settings={
    'FEED_FORMAT': 'json',
    'FEED_URI': 'items.json'
})

process.crawl(PromolkSpider)
process.start() # the script will block here until the crawling is finished