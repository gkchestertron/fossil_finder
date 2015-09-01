from flask import Flask, session, g
import flask.ext.sqlalchemy
import MySQLdb
from sqlalchemy.dialects.mysql import INTEGER # need this for constraints
import bcrypt
from itsdangerous import TimedJSONWebSignatureSerializer as Serializer, BadSignature, SignatureExpired

# grab reference to the Flask application and the Flask-SQLAlchemy object
app = Flask(__name__)
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

class Category(db.Model):
    __tablename__ = 'fossil_finder_img_tag_categories'
    id   = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String(255))

class User(db.Model):
    '''
        auth_level 1 - basic user
        auth_level 2 - expert user
        auth_level 3 - admin
    '''

    __tablename__ = 'fossil_finder_users'

    id            = db.Column(db.Integer, primary_key = True)
    auth_level    = db.Column(db.Integer, nullable    = False)
    group_code    = db.Column(db.String(255))
    group_name    = db.Column(db.String(255))
    email         = db.Column(db.String(255), index=True, unique=True)
    password_hash = db.Column(db.String(255), index=True)
    verified      = db.Column(db.Boolean, nullable=False, default=False)

    def generate_token(self, exp=3600):
        s = Serializer(app.config['SERIALIZER_KEY'], expires_in=exp)
        return s.dumps({'id': self.id})

    def generate_password_hash(self, password):
        password_hash = bcrypt.hashpw(password, bcrypt.gensalt())
        self.password_hash = password_hash
        db.session.commit()
        
    def verify_password(self, password):
        return bcrypt.hashpw(password, self.password_hash) == self.password_hash and self.verified

    def login(self):
        session['token'] = self.generate_token()
        g.current_user = self

    def verify(self):
        self.verifid = True
        db.session.add(self)
        db.session.commit()

    @classmethod
    def from_group_code(cls, group_code):
        return cls.query.filter(cls.group_code == group_code).first()

    @classmethod
    def from_token(cls, token):
        s = Serializer(app.config['SERIALIZER_KEY'])
        try:
            data = s.loads(token)
        except SignatureExpired:
            return None
        except BadSignature:
            return None
        user = cls.query.get(data['id'])
        return user

    @classmethod
    def from_email(cls, email):
        return cls.query.filter(cls.email == email).first()

    @classmethod
    def create(cls, email=None, password=None, auth_level=1):
        if not email or not password:
            return
        try:
            user = cls(email=email, auth_level=1)
            db.session.add(user)
            db.session.commit()
            user.generate_password_hash(password)
            return user
        except:
            db.session.rollback()
            return None

# create all the things
db.create_all()
