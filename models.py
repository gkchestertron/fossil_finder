import flask
import flask.ext.sqlalchemy
import MySQLdb

# Grab reference to the Flask application and the Flask-SQLAlchemy object
app = flask.Flask(__name__)
app.config.from_object('config')
db = flask.ext.sqlalchemy.SQLAlchemy(app)

# class for images from existing db
class Img_fossil_project(db.Model):
    imgnum   = db.Column(db.Integer, primary_key = True)
    genre    = db.Column(db.String(9))
    collectn = db.Column(db.String(16))
    kwid     = db.Column(db.String(19))

    def href(self):
        split = self.kwid.split(' ')
        href = 'http://calphotos.berkeley.edu/imgs/zoomucmp/%s_%s/%s/%s.jpeg' % (split[0], split[1], split[2], split[3])
        return href

# class for fossil finder image references

# class for fossil finder image tags

# Create the database tables.
db.create_all()
