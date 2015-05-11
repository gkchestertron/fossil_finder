import flask
import flask.ext.sqlalchemy
import MySQLdb

# Create the Flask application and the Flask-SQLAlchemy object.
app = flask.Flask(__name__)
app.config.from_object('config')
db = flask.ext.sqlalchemy.SQLAlchemy(app)

class Img_fossil_project(db.Model):
    imgnum = db.Column(db.Integer, primary_key = True)
    genre  = db.Column(db.String(9))

# Create the database tables.
db.create_all()
