from flask_restful import Api, Resource
from flask import request
from pymongo import MongoClient
from pymongo.collection import Collection
import jwt #pyjwt
from werkzeug.security import check_password_hash

jwt_secret_key = "secret" #"blabla"

users : Collection = None

def users_add_resources(api:Api, db_client:MongoClient, path:str):
    db = db_client["twitter-clone"]
    global users
    users = db.users
    api.add_resource(UsersLoginAPI, path + "/login", endpoint='users_login')

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
