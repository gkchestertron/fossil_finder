import os
import re
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

# templates for backbone
@static.route('/templates')
def templates():
    """
    templates need to have a .html extension
    """
    predicate = re.compile('.*html$')
    files     = [f for f in os.listdir('./static/js/templates/') if predicate.match(f)]
    response  = {}
    
    for f in files:
        file        = open('./static/js/templates/' + f)
        response[f[:-5:]] = file.read().rstrip('\n')
        file.close()

    return flask.jsonify(response)
    
    
