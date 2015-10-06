from flask import Flask
import flask.ext.sqlalchemy
import MySQLdb
from sqlalchemy.dialects.mysql import INTEGER # need this for constraints

# grab reference to the Flask application and the Flask-SQLAlchemy object
app = Flask(__name__)
app.config.from_object('config')
db = flask.ext.sqlalchemy.SQLAlchemy(app)
