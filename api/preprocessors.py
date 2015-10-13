# TODO add auth and block access based on auth level
from flask import Flask, g, session, request, abort, send_from_directory
from models import Ref, Img, User, db
from sqlalchemy import and_
from werkzeug import secure_filename
import os

app = Flask(__name__)
app.config.from_object('config')

def refs_get_many_preprocessor(search_params=None, **kw):
    if request.args.get('all'):
        return

    token = session.get('token')
    if token:
        user = User.from_token(token)
    else:
        user = None

    if user and user.active and user.auth_level > 1:
        ref = Ref.query.filter(and_( Ref.completed_by_user_id.is_(None),
                                     Ref.failed_to_load.is_(None), 
                                     Ref.last_accessed_user_id != user.id)).first()
    else:
        ref = Ref.query.filter(and_( Ref.last_accessed_date_time.is_(None), Ref.failed_to_load.is_(None))).first()

    while not ref:
        try:
            img = Img.query.filter(~Img.seq_num.in_(Ref.query.with_entities(Ref.seq_num))).first()
            ref = Ref(seq_num = img.seq_num)
            db.session.add(ref)
            db.session.commit()
        except:
            ref = None
            db.session.rollback()

    search_params['filters'] = [{ 'name': 'id', 'op': 'eq', 'val': int(ref.id) }]

def logged_in(search_params=None, **kw):
    if not session.get('token'):
        abort(401)
    user = User.from_token(session.get('token'))
    if not user or not user.active:
        abort(401)
    g.current_user = user

def is_admin(search_params=None, **kw):
    if not session.get('token'):
        abort(401)
    user = User.from_token(session.get('token'))
    if not user or user.auth_level < 3:
        abort(403)
    g.current_user = user

def set_user_ids(search_params=None, **kw):
    complete = request.json.get('complete')
    if complete:
        request.json['completed_by_user_id'] = g.current_user.id
    if complete or complete == False:
        del request.json['complete']
    request.json['last_accessed_user_id'] = g.current_user.id

def filter_filename(search_params=None, **kw):
    filename = request.json.get('filename')
    if filename:
        request.json['filename'] = secure_filename(filename)
