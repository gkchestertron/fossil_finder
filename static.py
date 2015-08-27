import os
import re
from flask import Flask, session, render_template, Blueprint, jsonify, g
from flask.ext.assets import Environment, Bundle
from models import User

# create static blueprint
static = Blueprint("static", __name__)
app = Flask(__name__)
assets = Environment()
assets.init_app(app)

# main page
@static.route('/')
def index():
    current_user = None
    if session.get('token'):
        current_user = User.from_token(session.get('token'))
    return render_template("index.html", assets=assets, current_user=current_user)

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

    return jsonify(response)
    
    
