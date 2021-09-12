from datetime import datetime
from pymongo import MongoClient

client = MongoClient(host="localhost", port=27017)

db = client["twitter-clone"]
tweets = db.tweets

tweets.insert_many([
    {'userId': '54f113fffba522406c9cc21e', 'text': 'Vine, vine primavara!', 'timestamp': datetime.utcnow()}, 
    {'userId': '54f113fffba522406c9cc21e', 'text': 'Ai fi crezut asa ceva?', 'timestamp': datetime.utcnow()}, 
    {'userId': '54f113fffba522406c9cc21e', 'text': 'No comment...', 'timestamp': datetime.utcnow()}, 
    {'userId': '54f113fffba522406c9cc22e', 'text': 'Tic-tac, BOOM', 'timestamp': datetime.utcnow()},
    {'userId': '54f113fffba522406c9cc22e', 'text': 'Aleluia, let me go', 'timestamp': datetime.utcnow()}
    ])
