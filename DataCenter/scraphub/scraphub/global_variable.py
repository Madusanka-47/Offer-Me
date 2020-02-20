import json
import re

#These fucntions shoudl change<
class GlobalVariable:
    def config():
        return  json.load(open('D:/Projects/trunk/DataCenter/scraphub/scraphub/scraphub_config.json'))

    def urlRegx(htmlstr):
        return re.findall('http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\(\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+', htmlstr)[0]