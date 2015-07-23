import flask
import static
import api
from flask.ext.assets import Environment, Bundle

# Create the Flask application
app = flask.Flask(__name__)

# register assets - any new js must go in here
# TODO automate finding the files in the tree
assets = Environment(app)
js = Bundle(
    'js/lib/jquery-1.11.3.js', 
    'js/lib/underscore.js',
    'js/lib/backbone.js',
    'bootstrap-3.3.4-dist/js/bootstrap.js',
    'js/main.js',
    'js/data/base.js',
    'js/data/refs.js',
    'js/data/tags.js',
    'js/data/categories.js',
    'js/data/templates.js',
    'js/views/base.js',
    'js/views/finder.js',
    'js/views/tag.js',
    'js/router.js',
    output='build/packed.js'
)
assets.register('js_all', js)

# Register static blueprint
app.register_blueprint(static.static)

# Register api blueprints
app.register_blueprint(api.refs)
app.register_blueprint(api.categories)
app.register_blueprint(api.tags)
app.register_blueprint(api.imgs)

# start the flask loop
if __name__ == '__main__':
    app.run(debug=True)
