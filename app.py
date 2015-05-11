import flask
import static
import api

# Create the Flask application and the Flask-SQLAlchemy object.
app = flask.Flask(__name__)

# Register static blueprints
app.register_blueprint(static.static)

# Register api blueprints
app.register_blueprint(api.images)

# start the flask loop
if __name__ == '__main__':
    app.run()
