from twisted.internet import reactor
import scrapy
from scrapy.crawler import CrawlerRunner
from scrapy.utils.log import configure_logging
from scraphub.spiders.mydeallk_spider import MydeallkSpider
from scraphub.spiders.promolk_spider import PromolkSpider
from scrapy.utils.project import get_project_settings
from scraphub.global_variable import GlobalVariable
from scrapy.settings import Settings
import os
import schedule
import time
import datetime

import smtplib
import ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

service_config = GlobalVariable.config()['service_configurations']

class PubReactor:

    def __init__(self):
        settings = Settings()
        os.environ['SCRAPY_SETTINGS_MODULE'] = 'scraphub.settings'
        settings_module_path = os.environ['SCRAPY_SETTINGS_MODULE']
        settings.setmodule(settings_module_path, priority='project')
        configure_logging({'LOG_FORMAT': '%(levelname)s: %(message)s'})
        runner = CrawlerRunner(settings)

        runner.crawl(MydeallkSpider)
        runner.crawl(PromolkSpider)
        d = runner.join()
        d.addBoth(lambda _: reactor.stop())
        reactor.run()


def scheduler__():
    PubReactor()
    execution_date = datetime.datetime.today()
    sender_email = service_config['mail_smtpconfig']['domain']
    receiver_email = service_config['mail_smtpconfig']['admin']

    message = MIMEMultipart("alternative")
    message["Subject"] = "Scrap status of %s"%(execution_date.strftime('%d %B %Y'))
    message["From"] = 'scraphub shell'
    message["To"] = receiver_email

    html = """\
<html>
  <body>
       <h3>Execution completed at : %s </h3></br>
         <p>This is an automated notifcation email generated by scraphub.<p>
    </p>
  </body>
</html>
"""
    message.attach(MIMEText(html % (str(execution_date)), "html"))
    context = ssl.create_default_context()
    with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context) as server:
        server.login(sender_email, service_config['mail_smtpconfig']['service_key'])
        server.sendmail(
            sender_email, receiver_email, message.as_string()
        )

scheduler__()
# schedule.every().day.at(service_config['scheduletime']).do(scheduler__)

# while True:

#     # Checks whether a scheduled task
#     # is pending to run or not
#     schedule.run_pending()
#     time.sleep(1)
    
#Configurations needs to be handel properly
