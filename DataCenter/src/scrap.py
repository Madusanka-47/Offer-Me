from selenium import webdriver
from bs4 import BeautifulSoup
import pandas as pd
import urllib.request
import random
import os

# def downloader(image_url):
#     file_name = random.randrange(1, 10000)
#     full_file_name = 'assets/' + str(file_name) + '.jpg'
#     urllib.request.urlretrieve(image_url, full_file_name)

driver = webdriver.Chrome( './lib/chromedriver/chromedriver.exe')

products = []  # List to store name of the product
prices = []  # List to store price of the product
ratings = []  # List to store rating of the product
driver.get('https://www.flipkart.com/search?p%5B%5D=facets.brand%255B%255D%3DSamsung&sid=tyy%2F4io&sort=recency_desc&wid=1.productCard.PMU_V2_1')

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
    print(src + '\n')
    # downloader(src)
