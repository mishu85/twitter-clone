from bson.json_util import ObjectId
import jwt #pyjwt
from pymongo.collection import Collection
from flask_httpauth import HTTPTokenAuth
import os

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}
UPLOAD_FOLDER = os.path.join(os.path.abspath(os.path.dirname(__file__)), 'static', 'images') #static/images ?

jwt_secret_key = "secret" #"blabla"

auth = HTTPTokenAuth(scheme='Bearer')

@auth.verify_token #!
def verify_token(token):
    try: 
        jwt.decode(token, jwt_secret_key, algorithms=["HS256"])
        return True
    except Exception as e:
        print(e)
        print("JWT error during verify_token: " + token)

def get_current_identity(request, users:Collection):
    token = request.headers['Authorization'].split(' ')[1]
    user_id = jwt.decode(token, jwt_secret_key, algorithms=["HS256"])["user_id"]
    return users.find_one({'_id': ObjectId(user_id)}, {'password': False})
