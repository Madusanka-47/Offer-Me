from selenium import webdriver
from bs4 import BeautifulSoup
import pandas as pd
import urllib.request
import random

def downloader(image_url):
    file_name = random.randrange(1, 10000)
    full_file_name = 'assets/' + str(file_name) + '.jpg'
    urllib.request.urlretrieve(image_url, full_file_name)

driver = webdriver.Chrome("usr/lib/chromedriver.exe")

products = []  # List to store name of the product
prices = []  # List to store price of the product
ratings = []  # List to store rating of the product
driver.get('https://www.flipkart.com/laptops/~buyback-guarantee-on-laptops-/pr?sid=6bo%2Cb5g&uniqBStoreParam1=val1&wid=11.productCard.PMU_V2')

content = driver.page_source
soup = BeautifulSoup(content)
for a in soup.findAll('a', href=True, attrs={'class': '_31qSD5'}):
    name = a.find('div', attrs={'class': '_3wU53n'})
    price = a.find('div', attrs={'class': '_1vC4OE _2rQ-NK'})
    rating = a.find('div', attrs={'class': 'hGSR34 _2beYZw'})
    src = a.find('img', attrs={'class': '_1Nyybr'})['src']
    # products.append(name.text)
    # prices.append(price.text)
    # ratings.append(rating.text)
    downloader(src)
