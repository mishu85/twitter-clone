from datetime import datetime
from flask_restful import Api, Resource
from flask import request
from pymongo import MongoClient
from pymongo.collection import Collection
from bson.json_util import ObjectId
from utils import get_current_identity, auth

users : Collection = None
tweets : Collection = None

def tweets_add_resources(api:Api, db_client:MongoClient, path:str):
    db = db_client["twitter-clone"]
    global users
    global tweets
    users = db.users
    tweets = db.tweets
    api.add_resource(TweetsApi, path, endpoint='tweets')
    
class TweetsApi(Resource):
    def get(self):
        all_tweets = list(tweets.find({}))
        for tweet in all_tweets:
            creator_of_tweet = users.find_one({'_id': ObjectId(tweet['userId'])}, {'password': False})
            tweet['user'] = {
                'firstName': creator_of_tweet['firstName'], 
                'lastName': creator_of_tweet['lastName'], 
                'avatar': creator_of_tweet['avatar'], 
                'id': creator_of_tweet['_id'], 
            }
            del tweet['userId'] #?

        def getTimestamp(tweet):
            return tweet["timestamp"]

        all_tweets.sort(reverse=True, key=getTimestamp)

        print(all_tweets)
        return {'data': all_tweets}
        
    @auth.login_required
    def post(self):
        my_user = get_current_identity(request, users)
        print('Posting tweet from: ' + my_user['email'])
        tweet_text = request.form['text']
        x = tweets.insert_one({'userId': str(my_user['_id']), 'text': tweet_text, 'timestamp': datetime.utcnow()})
        new_tweet = tweets.find_one({'_id': ObjectId(x.inserted_id)})
        print(new_tweet)
        return {'data': new_tweet} 
