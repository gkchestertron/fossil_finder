# TODO add auth and block access based on auth level
from flask import Flask, g, session, request, abort
from models import Ref, Img, User, db
from sqlalchemy import and_

def refs_get_many_preprocessor(search_params=None, **kw):
    if request.args.get('all'):
        return
    ref = Ref.query.filter(and_(Ref.last_accessed_date_time == None, Ref.failed_to_load == None)).first()
    if not ref: # creates a new ref based on first image that doesn't have a corresponding ref
        img = Img.query.filter(Img.ref == None).first()
        ref = Ref(seq_num = img.seq_num)
    db.session.add(ref)
    db.session.commit()
    search_params['filters'] = [{ 'name': 'id', 'op': 'eq', 'val': ref.id }]
    db.session.close_all()

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
        del request.json['complete']
    request.json['last_accessed_user_id'] = g.current_user.id
