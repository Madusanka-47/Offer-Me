# -*- coding: utf-8 -*-

# Define here the models for your scraped items
#
# See documentation in:
# https://docs.scrapy.org/en/latest/topics/items.html

import scrapy


class ScraphubItem(scrapy.Item):
    # define the fields for your item here like:
    postid = scrapy.Field()
    refid = scrapy.Field()
    description = scrapy.Field()
    discount = scrapy.Field()
    imgurl = scrapy.Field()
    base_amount = scrapy.Field()
    amount = scrapy.Field()
    source_href = scrapy.Field()
    fetched_date = scrapy.Field()
    meta = scrapy.Field()
    is_automated = scrapy.Field()
    pass
