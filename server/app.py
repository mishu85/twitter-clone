from flask import Flask
from flask_cors import CORS
from pymongo import MongoClient
from flask_restful import Api
from resources.users import users_add_resources
from resources.tweets import tweets_add_resources
from utils import MyEncoder, UPLOAD_FOLDER

db_client = MongoClient(host="localhost", port=27017)

app = Flask(__name__, static_url_path='/static')
app.json_encoder = MyEncoder
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
CORS(app)

api = Api(app)
app.config['RESTFUL_JSON'] = {'cls':MyEncoder}
users_add_resources(api, db_client, "/api/users")
tweets_add_resources(api, db_client, "/api/tweets")

if __name__ == "__main__":
    app.run(debug=True)
