from datetime import datetime
from flask import Flask, request, abort
from flask_cors import CORS
from flask_httpauth import HTTPTokenAuth
import jwt #pyjwt
from pymongo import MongoClient
from bson.json_util import ObjectId
import json
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
import os
from pathlib import Path
import uuid
from flask_restful import Api
from resources.users import users_add_resources

jwt_secret_key = "secret" #"blabla"

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

UPLOAD_FOLDER = os.path.join(os.path.abspath(os.path.dirname(__file__)), 'static', 'images') #static/images ?

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

app = Flask(__name__, static_url_path='/static')
app.json_encoder = MyEncoder
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
auth = HTTPTokenAuth(scheme='Bearer')
CORS(app)

api = Api(app)
app.config['RESTFUL_JSON'] = {'cls':MyEncoder}
users_add_resources(api, db_client, "/api/users")

@auth.verify_token #!
def verify_token(token):
    try: 
        jwt.decode(token, jwt_secret_key, algorithms=["HS256"])
        return True
    except Exception as e:
        print(e)
        print("JWT error during verify_token: " + token)

def get_current_identity(request):
    token = request.headers['Authorization'].split(' ')[1]
    user_id = jwt.decode(token, jwt_secret_key, algorithms=["HS256"])["user_id"]
    return users.find_one({'_id': ObjectId(user_id)}, {'password': False})

@app.route('/api/signup', methods = ['POST'])
def signup():
    first_name = request.form['firstName']
    last_name = request.form['lastName']
    email = request.form['email']
    password = request.form['password']
    repeated_password = request.form['repeatedPassword']
    if first_name and last_name and email and password:
        if password == repeated_password:
            potential_existing_user = users.find_one({'email': email})
            if potential_existing_user is None:
                x = users.insert_one(
                    {
                        'firstName': first_name,
                        'lastName': last_name,
                        'email': email,
                        'password': generate_password_hash(password),
                        'avatar': '', #! 
                    }
                )
                new_user = users.find_one({'_id': ObjectId(x.inserted_id)}, {'password': False})
                token = jwt.encode({"user_id": str(new_user['_id'])}, jwt_secret_key, algorithm="HS256")
                return {'data': {
                    'user': new_user,
                    'token': token,
                }}

@app.route('/api/tweets', methods=['GET'])
def get_tweets():
    userId = request.args.get('userId')
    if userId is None:
        all_tweets = list(tweets.find({}))
    else:
        all_tweets = list(tweets.find({'userId': userId}))
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
    my_user = get_current_identity(request)
    print('Posting tweet from: ' + my_user['email'])
    tweet_text = request.form['text']
    x = tweets.insert_one({'userId': str(my_user['_id']), 'text': tweet_text, 'timestamp': datetime.utcnow()})
    new_tweet = tweets.find_one({'_id': ObjectId(x.inserted_id)})
    print(new_tweet)
    return {'data': new_tweet}

@app.route('/api/me', methods=['GET'])
@auth.login_required
def get_me():
    user = get_current_identity(request)
    return {'data': user}

@app.route('/api/me', methods=['PUT'])
@auth.login_required
def put_me():
    my_user = get_current_identity(request)
    first_name = request.form['firstName']
    last_name = request.form['lastName']
    email = request.form['email']
    password = request.form['password']
    new_password = request.form['newPassword'] #must double check the new pass
    if email != my_user['email'] and users.find_one({'email': email}) is not None: #! the 2nd part of conditional
        abort(400)
    if first_name and last_name and email and password:
        existing_user = users.find_one({'email': my_user['email']})
        if check_password_hash(existing_user['password'], password):
            users.update_one({'email': my_user['email']},
                {
                    '$set': { #?
                        'firstName': first_name,
                        'lastName': last_name,
                        'email': email, #?
                        'password': generate_password_hash(new_password) if new_password != '' else existing_user['password'],
                    }
                }
            )
            updated_user = users.find_one({'email': my_user['email']}, {'password': False})
            return {'data': {
                'user': updated_user,
            }}
        abort(401)
    abort(400)

@app.route('/api/avatar', methods=['PUT'])
@auth.login_required
def put_avatar():
    my_user = get_current_identity(request)

    def allowed_file(filename):
        return '.' in filename and \
            filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

    def get_file_extension(filename):
        return filename.rsplit('.', 1)[1].lower()

    # check if the put request has the file part
    if 'avatar' not in request.files:
        abort(400)
    avatar = request.files['avatar']
    # If the user does not select a file, the browser submits an
    # empty file without a filename.
    if avatar.filename == '':
        abort(400)
    if avatar and allowed_file(avatar.filename):
        # delete old avatar
        if(my_user['avatar']):
            os.remove(os.path.abspath(os.path.dirname(__file__)) + my_user['avatar'].replace("/", os.sep))
        # save new avatar
        filename = secure_filename(str(uuid.uuid1()) + "." + get_file_extension(avatar.filename))
        Path(app.config['UPLOAD_FOLDER']).mkdir(parents=True, exist_ok=True)
        avatar.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        path_to_serve = "/static/images"
        users.update_one({'email': my_user['email']},
                {
                    '$set': {
                        'avatar': path_to_serve + "/" + filename,
                    }
                }
            )
        return {'data': {
            'avatar': path_to_serve + "/" + filename,
        }}
    abort(400)

@app.route('/api/user', methods=['GET'])
@auth.login_required
def get_user_data():
    userId = request.args.get('userId')
    user =  users.find_one({'_id': ObjectId(userId)}, {'password': False})
    if user == None:
        abort(404)
    return {'data': user}

if __name__ == "__main__":
    app.run(debug=True)
