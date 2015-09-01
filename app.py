from flask import Flask, request, session, g, redirect
import static
import authentication
import api
import admin
from models import User
from flask.ext.assets import Environment, Bundle

# Create the Flask application
app = Flask(__name__)
app.config.from_object('config')

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

# start the flask loop
if __name__ == '__main__':
    app.run(debug=True)
