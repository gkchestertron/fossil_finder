# TODO add constraints/relationships
import flask
import flask.ext.sqlalchemy
import MySQLdb
from sqlalchemy.dialects.mysql import INTEGER # need this for constraints

# grab reference to the Flask application and the Flask-SQLAlchemy object
app = flask.Flask(__name__)
app.config.from_object('config')
db = flask.ext.sqlalchemy.SQLAlchemy(app)

# class for images from existing db
class Img(db.Model):
    __tablename__ = 'img_fossil_project'
    seq_num  = db.Column(db.Integer, primary_key = True)
    ref      = db.relationship('Ref', primaryjoin='Img.seq_num==foreign(Ref.seq_num)')
    imgnum   = db.Column(db.Integer)
    genre    = db.Column(db.String(9))
    collectn = db.Column(db.String(16))
    kwid     = db.Column(db.String(19))

    def href(self):
        split = self.kwid.split(' ')
        href = 'http://calphotos.berkeley.edu/imgs/ucmp_zoom/%s_%s/%s/%s.jpeg' % (split[0], split[1], split[2], split[3])
        return href

class Ref(db.Model):
    __tablename__ = 'fossil_finder_img_refs'
    id                      = db.Column(db.Integer, primary_key = True)
    seq_num                 = db.Column(INTEGER(unsigned=True), index = True, nullable = False, unique = True)
    img                     = db.relationship('Img', primaryjoin='Ref.seq_num==foreign(Img.seq_num)', uselist=False)
    tags                    = db.relationship('Tag', primaryjoin='Ref.id==foreign(Tag.img_ref_id)')
    last_accessed_user_id   = db.Column(db.Integer, index = True)
    last_accessed_date_time = db.Column(db.DateTime, index = True)
    completed_by_user_id    = db.Column(db.Integer, index = True)
    scale                   = db.Column(db.Float)
    failed_to_load          = db.Column(db.Boolean)
    
class Tag(db.Model):
    __tablename__ = 'fossil_finder_img_tags'
    id                  = db.Column(db.Integer, primary_key = True)
    img_ref_id          = db.Column(db.Integer, nullable = False, index = True)
    img_ref             = db.relationship('Ref', primaryjoin='foreign(Tag.img_ref_id)==Ref.id')
    top                 = db.Column(db.Float)
    left                = db.Column(db.Float)
    width               = db.Column(db.Float)
    height              = db.Column(db.Float)
    img_tag_category_id = db.Column(db.Integer)
    category            = db.relationship('Category', primaryjoin='Tag.img_tag_category_id==foreign(Category.id)', uselist=False)

class User(db.Model):
    __tablename__ = 'fossil_finder_users'
    id            = db.Column(db.Integer, primary_key = True)
    auth_level    = db.Column(db.Integer, nullable    = False)
    group_code    = db.Column(db.String(255))
    group_name    = db.Column(db.String(255))
    username      = db.Column(db.String(255))
    password_hash = db.Column(db.String(255))

class Category(db.Model):
    __tablename__ = 'fossil_finder_img_tag_categories'
    id   = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String(255))

# create all the things
db.create_all()
