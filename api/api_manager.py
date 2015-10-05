from flask import Flask
from models import db
import flask.ext.restless

# Grab reference to the Flask application and the Flask-SQLAlchemy object.
app = Flask(__name__)
app.config.from_object('config')

# Create the Flask-Restless API manager.
api_manager = flask.ext.restless.APIManager(app, flask_sqlalchemy_db=db)
