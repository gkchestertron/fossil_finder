# TODO add auth and block access based on auth level
import flask
from flask import g
import flask.ext.sqlalchemy
import flask.ext.restless
import MySQLdb
import models
import static
from sqlalchemy import and_

# Grab reference to the Flask application and the Flask-SQLAlchemy object.
app = flask.Flask(__name__)
app.config.from_object('config')

# preprocessors
def refs_get_many_preprocessor(search_params=None, **kw):
    ref = models.Ref.query.filter(and_(models.Ref.last_accessed_date_time == None, models.Ref.failed_to_load == None)).first()
    if not ref: # creates a new ref based on first image that doesn't have a corresponding ref
        img = models.Img.query.filter(models.Img.ref == None).first()
        ref = models.Ref(seq_num = img.seq_num)
    models.db.session.add(ref)
    models.db.session.commit()
    search_params['filters'] = [{ 'name': 'id', 'op': 'eq', 'val': ref.id }]
    models.db.session.close_all()
    if hasattr(g, 'test'):
        print g.test
    else:
        print 'no test yet'
        g.test = 'this is a test'
    
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
        'GET_MANY': [refs_get_many_preprocessor] }, 
    include_methods=['img.href', 'tags.category'],
    results_per_page=None)

tags = api_manager.create_api_blueprint(
    models.Tag,
    methods=['GET', 'POST', 'PUT', 'DELETE'],
    collection_name='tags',
    results_per_page=None)

imgs = api_manager.create_api_blueprint(
    models.Img,
    methods=['GET'],
    collection_name='imgs',
    include_methods=['href'])
