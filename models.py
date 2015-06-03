import flask
import flask.ext.sqlalchemy
import MySQLdb

# grab reference to the Flask application and the Flask-SQLAlchemy object
app = flask.Flask(__name__)
app.config.from_object('config')
db = flask.ext.sqlalchemy.SQLAlchemy(app)

# class for images from existing db
class Img_fossil_project(db.Model):
    seq_num  = db.Column(db.Integer, primary_key = True)
    imgnum   = db.Column(db.Integer)
    genre    = db.Column(db.String(9))
    collectn = db.Column(db.String(16))
    kwid     = db.Column(db.String(19))

    def href(self):
        split = self.kwid.split(' ')
        href = 'http://calphotos.berkeley.edu/imgs/zoomucmp/%s_%s/%s/%s.jpeg' % (split[0], split[1], split[2], split[3])
        return href

# class for fossil finder image references
# TODO create table in mysql
class Fossil_finder_img_refs(db.Model):
    id                      = db.Column(db.Integer, primary_key = True)
    seq_num                 = db.Column(db.Integer, index = True, nullable = False)
    last_accessed_user_id   = db.Column(db.Integer, index = True)
    last_accessed_date_time = db.Column(db.DateTime)
    completed_by_user_id    = db.Column(db.Integer, index = True)
    scale                   = db.Column(db.Float)

# class for fossil finder image tags
class Fossil_finder_img_tags(db.Model):
    id                  = db.Column(db.Integer, primary_key = True)
    img_ref_id          = db.Column(db.Integer, nullable    = False, index = True)
    top                 = db.Column(db.Float)
    left                = db.Column(db.Float)
    width               = db.Column(db.Float)
    height              = db.Column(db.Float)
    img_tag_category_id = db.Column(db.Integer)


# class for fossil finder users
class Fossil_finder_users(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    auth_level = db.Column(db.Integer, nullable = False)
    username = db.Column(db.String(255))
    password_hash = db.Column(db.String(255))

# for fossil finder categories
class Fossil_finder_img_tag_categories(db.Model):
    id   = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String(255))

# create all the things
db.create_all()
