from flask import Flask, request, session, g, redirect, abort
import api
from blueprints import static, authentication, admin
import bcrypt
from models import User, db
from flask.ext.assets import Environment, Bundle
from werkzeug import secure_filename
import os

# Create the Flask application
app = Flask(__name__)
app.config.from_object('config')

# create any tables that don't yet exist
db.create_all()

def generate_csrf_token():
    if '_csrf_token' not in session:
        session['_csrf_token'] = bcrypt.gensalt()
    return session['_csrf_token']

app.jinja_env.globals['csrf_token'] = generate_csrf_token    

# register assets - any new js must go in here
# TODO automate finding the files in the tree
assets = Environment(app)
js = Bundle(
    'js/lib/jquery-1.11.3.js', 
    'js/lib/underscore.js',
    'js/lib/backbone.js',
    'bootstrap-3.3.4-dist/js/bootstrap.js',
    'js/monkey.js',
    'js/main.js',
    'js/data/base.js',
    'js/data/refs.js',
    'js/data/tags.js',
    'js/data/categories.js',
    'js/data/users.js',
    'js/data/templates.js',
    'js/views/base.js',
    'js/views/finder.js',
    'js/views/tag.js',
    'js/views/admin.js',
    'js/router.js',
    output='build/packed.js'
)
assets.register('js_all', js)

# Register static blueprint
app.register_blueprint(static.static, session=session, g=g)

# Register authentication blueprint
app.register_blueprint(authentication.authentication, session=session, g=g)

# Register admin blueprint
app.register_blueprint(admin.admin, session=session, g=g)

# Register api blueprints
app.register_blueprint(api.refs, session=session, g=g)
app.register_blueprint(api.categories, session=session, g=g)
app.register_blueprint(api.tags, session=session, g=g)
app.register_blueprint(api.imgs, session=session, g=g)
app.register_blueprint(api.users, session=session, g=g)

# upload route
@app.route('/upload', methods=['POST'])
def file_upload(search_params=None, **kw):
    user = User.from_token(session.get('token'))

    if user and user.auth_level < 3:
        abort(400)

    file = request.files.get('file')
    filename = secure_filename(file.filename)
    file.save(os.path.join(app.config['APP_IMAGE_FOLDER'], filename))
    return '', 200

# start the flask loop
if __name__ == '__main__':
    app.run(debug=True)
