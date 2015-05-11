import flask
import flask.ext.sqlalchemy
import flask.ext.restless
import MySQLdb
import models
import static

# Create the Flask application and the Flask-SQLAlchemy object.
app = flask.Flask(__name__)
app.config.from_object('config')
db = flask.ext.sqlalchemy.SQLAlchemy(app)

# Create the Flask-Restless API manager.
manager = flask.ext.restless.APIManager(app, flask_sqlalchemy_db=db)

# Create API endpoints, which will be available at /api/<tablename> by
images = manager.create_api_blueprint(models.Img_fossil_project, methods=['GET'], collection_name='images')