import flask

static = flask.Blueprint("static", __name__)

# main page
@static.route('/')
def index():
    return flask.render_template("index.html")
