from flask_restful import Api, Resource
from flask import request, abort, Response
from pymongo import MongoClient
from pymongo.collection import Collection
import jwt #pyjwt
from werkzeug.security import check_password_hash, generate_password_hash
from bson.json_util import ObjectId
from utils import get_current_identity, jwt_secret_key, auth, ALLOWED_EXTENSIONS, UPLOAD_FOLDER
import os
from pathlib import Path
import uuid
from werkzeug.utils import secure_filename

users : Collection = None
tweets : Collection = None

def users_add_resources(api:Api, db_client:MongoClient, path:str):
    db = db_client["twitter-clone"]
    global users
    global tweets
    users = db.users
    tweets = db.tweets
    api.add_resource(UsersByIdApi, path + "/<id>", endpoint='users_by_id')
    api.add_resource(UsersLoginAPI, path + "/login", endpoint='users_login')
    api.add_resource(UsersRegisterAPI, path + "/register", endpoint = "users_register")
    api.add_resource(UsersMeApi, path+ "/me", endpoint= "users_me")
    api.add_resource(UsersAvatarApi, path+ "/avatar", endpoint= "users_avatar")
    api.add_resource(TweetsForUsersByIdApi, path+ "/<id>/tweets", endpoint= "tweets_for_users_by_id")

class UsersByIdApi(Resource):
    def get(self, id):
        user =  users.find_one({'_id': ObjectId(id)}, {'password': False})
        if user == None:
            abort(404)
        return {'data': user}

class UsersLoginAPI(Resource):
  def post(self):
    email = request.form['email']
    password = request.form['password']
    user = users.find_one({'email': email})
    if user is not None and check_password_hash(user['password'], password):
        user = users.find_one({'email': email}, {'password': False})
        token = jwt.encode({"user_id": str(user['_id'])}, jwt_secret_key, algorithm="HS256") #why id?
        return {'data': {
            'user': user,
            'token': token,
        }}

class UsersRegisterAPI(Resource):
    def post(self):
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
                            'avatar': ''    , #! 
                        }
                    )
                    new_user = users.find_one({'_id': ObjectId(x.inserted_id)}, {'password': False})
                    token = jwt.encode({"user_id": str(new_user['_id'])}, jwt_secret_key, algorithm="HS256")
                    return {'data': {
                        'user': new_user,
                        'token': token,
                    }}

class UsersMeApi(Resource):
    @auth.login_required
    def get(self):
        user = get_current_identity(request, users)
        return {'data': user}

    @auth.login_required
    def put(self):
        my_user = get_current_identity(request, users)
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

class UsersAvatarApi(Resource):
    @auth.login_required
    def put(self):
        my_user = get_current_identity(request, users)

        def allowed_file(filename):
            return '.' in filename and \
                filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

        def get_file_extension(filename):
            return filename.rsplit('.', 1)[1].lower()

        # check if the put request has the file part
        if 'avatar' not in request.files:
            abort(Response("Avatar file is missing!", status=400))
        avatar = request.files['avatar']
        # If the user does not select a file, the browser submits an
        # empty file without a filename.
        if avatar.filename == '':
            abort(Response("Avatar file has no filename!", status=400))
        if avatar and allowed_file(avatar.filename):
            # delete old avatar
            if(my_user['avatar']):
                os.remove(os.path.abspath(os.path.dirname(__file__)) + my_user['avatar'].replace("/", os.sep))
            # save new avatar
            filename = secure_filename(str(uuid.uuid1()) + "." + get_file_extension(avatar.filename))
            Path(UPLOAD_FOLDER).mkdir(parents=True, exist_ok=True)
            avatar.save(os.path.join(UPLOAD_FOLDER, filename))
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
        abort(Response("Avatar does not have a supported file type!", status=400))

class TweetsForUsersByIdApi(Resource):
    def get(self, id):
        all_tweets = list(tweets.find({'userId': id}))
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
