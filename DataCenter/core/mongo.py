from pymongo import MongoClient
import datetime

client = MongoClient(
    'mongodb+srv://dumalk:dumalk@cluster0-yx3nh.mongodb.net/shuttle_core?retryWrites=true&w=majority')

post = {"author": "Mike",
        "text": "My first blog post!",
        "tags": ["mongodb", "python", "pymongo"],
        "date": datetime.datetime.utcnow()}

db = client['shuttle_core']
posts = db.posts

post_id = posts.insert_one(post).inserted_id
