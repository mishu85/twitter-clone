from datetime import datetime
from flask import Flask, request
from flask_cors import CORS
from pymongo import MongoClient
from bson.json_util import ObjectId
import json
from flask_restful import Api
from resources.users import users_add_resources
from utils import get_current_identity, auth, UPLOAD_FOLDER

db_client = MongoClient(host="localhost", port=27017)

db = db_client["twitter-clone"]
tweets = db.tweets
users = db.users

class MyEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, ObjectId):
            return str(obj)
        if isinstance(obj, datetime):
            return str(obj)
        
        return super(MyEncoder, self).default(obj)


app = Flask(__name__, static_url_path='/static')
app.json_encoder = MyEncoder
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
CORS(app)

api = Api(app)
app.config['RESTFUL_JSON'] = {'cls':MyEncoder}
users_add_resources(api, db_client, "/api/users")

@app.route('/api/tweets', methods=['GET'])
def get_tweets():
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

@app.route('/api/tweets', methods=['POST'])
@auth.login_required
def post_tweet():
    my_user = get_current_identity(request, users)
    print('Posting tweet from: ' + my_user['email'])
    tweet_text = request.form['text']
    x = tweets.insert_one({'userId': str(my_user['_id']), 'text': tweet_text, 'timestamp': datetime.utcnow()})
    new_tweet = tweets.find_one({'_id': ObjectId(x.inserted_id)})
    print(new_tweet)
    return {'data': new_tweet}

if __name__ == "__main__":
    app.run(debug=True)
