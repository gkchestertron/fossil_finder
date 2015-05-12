import flask
from flask.ext.assets import Environment, Bundle

# create static blueprint
static = flask.Blueprint("static", __name__)
app = flask.Flask(__name__)
assets = Environment()
assets.init_app(app)

# main page
@static.route('/')
def index():
    return flask.render_template("index.html", assets=assets)
