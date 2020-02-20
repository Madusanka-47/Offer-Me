from twisted.internet import reactor
import scrapy
from scrapy.crawler import CrawlerRunner
from scrapy.utils.log import configure_logging
from  scraphub.spiders.mydeallk_spider import MydeallkSpider # change here
from  scraphub.spiders.promolk_spider import PromolkSpider #change here 
from scrapy.utils.project import get_project_settings
from scrapy.settings import Settings
import os


class PubReactor:

    def __init__(self):
        settings = Settings()
        os.environ['SCRAPY_SETTINGS_MODULE'] = 'scraphub.settings'
        settings_module_path = os.environ['SCRAPY_SETTINGS_MODULE']
        settings.setmodule(settings_module_path, priority='project')
        configure_logging({'LOG_FORMAT': '%(levelname)s: %(message)s'})
        runner = CrawlerRunner(settings)

        # runner.crawl(MydeallkSpider) #here
        runner.crawl(PromolkSpider)
        d = runner.join()
        d.addBoth(lambda _: reactor.stop())
        reactor.run()


PubReactor()