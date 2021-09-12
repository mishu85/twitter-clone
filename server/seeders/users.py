from pymongo import MongoClient
from werkzeug.security import generate_password_hash
from bson.json_util import ObjectId

client = MongoClient(host="localhost", port=27017)

db = client["twitter-clone"]
users = db.users

users.insert_many([
    {
        '_id': ObjectId('54f113fffba522406c9cc21e'),
        'firstName': 'Ion',
        'lastName': 'Martin',
        'email': 'ion_martin@email.com',
        'password': generate_password_hash("ion_martin"),
        'avatar': '/static/images/1.png',
    }, 
    {
        '_id': ObjectId('54f113fffba522406c9cc22e'),
        'firstName': 'Eva',
        'lastName': 'Stefan',
        'email': 'eva_stefan@email.com',
        'password': generate_password_hash("eva_stefan"),
        'avatar': '/static/images/2.png',
    },     
    ])

# TODO: copy userAvatars to /static/images
