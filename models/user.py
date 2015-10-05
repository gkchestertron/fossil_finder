from flask import Flask, session, g
import bcrypt
from itsdangerous import TimedJSONWebSignatureSerializer as Serializer, BadSignature, SignatureExpired
from db import db, app
   
class User(db.Model):
    '''
        auth_level 1 - basic user
        auth_level 2 - expert user
        auth_level 3 - admin
    '''

    __tablename__ = 'fossil_finder_users'

    id            = db.Column(db.Integer, primary_key = True)
    auth_level    = db.Column(db.Integer, nullable    = False)
    group_code    = db.Column(db.String(255), index=True, unique=True)
    group_name    = db.Column(db.String(255))
    email         = db.Column(db.String(255), index=True, unique=True)
    password_hash = db.Column(db.String(255), index=True)
    verified      = db.Column(db.Boolean, nullable=False, default=False)
    active        = db.Column(db.Boolean, nullable=False, default=True)

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
        self.verified = True
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


