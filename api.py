# TODO add auth and block access based on auth level
from flask import Flask, g, session, request, abort
import flask.ext.sqlalchemy
import flask.ext.restless
import MySQLdb
import models
import static
from sqlalchemy import and_

# Grab reference to the Flask application and the Flask-SQLAlchemy object.
app = Flask(__name__)
app.config.from_object('config')

# preprocessors
def refs_get_many_preprocessor(search_params=None, **kw):
    if request.args.get('all'):
        return
    ref = models.Ref.query.filter(and_(models.Ref.last_accessed_date_time == None, models.Ref.failed_to_load == None)).first()
    if not ref: # creates a new ref based on first image that doesn't have a corresponding ref
        img = models.Img.query.filter(models.Img.ref == None).first()
        ref = models.Ref(seq_num = img.seq_num)
    models.db.session.add(ref)
    models.db.session.commit()
    search_params['filters'] = [{ 'name': 'id', 'op': 'eq', 'val': ref.id }]
    models.db.session.close_all()

def logged_in(search_params=None, **kw):
    if not session.get('token'):
        abort(401)
    user = models.User.from_token(session.get('token'))
    if not user or not user.active:
        abort(401)
    g.current_user = user

def is_admin(search_params=None, **kw):
    if not session.get('token'):
        abort(401)
    user = models.User.from_token(session.get('token'))
    if not user or user.auth_level < 3:
        abort(403)
    g.current_user = user

def set_user_ids(search_params=None, **kw):
    complete = request.json.get('complete')
    if complete:
        request.json['completed_by_user_id'] = g.current_user.id
    request.json['last_accessed_user_id'] = g.current_user.id
    del request.json['complete']
   
# Create the Flask-Restless API manager.
api_manager = flask.ext.restless.APIManager(app, flask_sqlalchemy_db=models.db)

# Create API endpoints, which will be available at /api/<tablename> by
# don't forget to register the blueprint in app.py
categories = api_manager.create_api_blueprint(
    models.Category, 
    methods=['GET'], 
    collection_name='categories',
    results_per_page=None)

refs = api_manager.create_api_blueprint(
    models.Ref, 
    methods=['GET','PUT'], 
    collection_name='refs', 
    preprocessors = {
        'GET_MANY'     : [refs_get_many_preprocessor],
        'PATCH_SINGLE' : [logged_in, set_user_ids]},
    include_methods=['img.href', 'tags.category'],
    results_per_page=None)

tags = api_manager.create_api_blueprint(
    models.Tag,
    methods=['GET', 'POST', 'PUT', 'DELETE'],
    preprocessors = {
        'PATCH_SINGLE'  : [logged_in],
        'POST'          : [logged_in],
        'DELETE_SINGLE' : [logged_in]},
    collection_name='tags',
    results_per_page=None)

imgs = api_manager.create_api_blueprint(
    models.Img,
    methods=['GET'],
    collection_name='imgs',
    include_methods=['href'])

users = api_manager.create_api_blueprint(
    models.User,
    methods=['GET', 'PUT'],
    collection_name='users',
    preprocessors = {
        'GET_SINGLE'   : [is_admin],
        'GET_MANY'     : [is_admin],
        'PATCH_SINGLE' : [is_admin]
    },
    exclude_columns=['password_hash'],
    results_per_page=None)

