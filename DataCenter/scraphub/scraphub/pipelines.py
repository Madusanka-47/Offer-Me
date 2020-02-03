# -*- coding: utf-8 -*-

# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://docs.scrapy.org/en/latest/topics/item-pipeline.html


import pymongo
# from settings import settings
from scrapy.exceptions import DropItem
# from scrapy import log

class MongoDBPipeline(object):
    collection_name = 'offer_heads'

    def __init__(self):
        self.connection = pymongo.MongoClient(
            # settings['MONGODB_SERVER']
            """mongodb://dumalk:dumalk@cluster0-shard-00-00-yx3nh.mongodb.net:27017,
            cluster0-shard-00-01-yx3nh.mongodb.net:27017,
            cluster0-shard-00-02-yx3nh.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority"""
        )
        db = self.connection['scraphub_datacenter']
        self.collection = db['basic']
        # db = connection[settings['MONGODB_DB']]
        # self.collection = db[settings['MONGODB_COLLECTION']]

    def process_item(self, item, spider):
      
        self.collection.insert(dict(item))
        # log.msg("Question added to MongoDB database!",
        #         level=log.DEBUG, spider=spider)
        return item
