from flask import Flask, request, abort, session, g, redirect
import static
import api
from flask.ext.assets import Environment, Bundle

# Create the Flask application
app = Flask(__name__)
app.secret_key = 'dinosaurs are awesome!'

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
    'js/data/templates.js',
    'js/views/base.js',
    'js/views/finder.js',
    'js/views/tag.js',
    'js/router.js',
    output='build/packed.js'
)
assets.register('js_all', js)

# Register static blueprint
app.register_blueprint(static.static, session=session, g=g)

# Register api blueprints
app.register_blueprint(api.refs, session=session, g=g)
app.register_blueprint(api.categories, session=session, g=g)
app.register_blueprint(api.tags, session=session, g=g)
app.register_blueprint(api.imgs, session=session, g=g)

# login
@app.route('/login', methods=['POST'])
def login():
    username = request.form['username']
    password = request.form['password']
    if username is None or password is None:
        abort(400)
    user = api.models.User.query.filter(api.models.User.username == username).first()
    if not user or not user.verify_password(password):
        abort(400)
    else:
        session['token'] = user.generate_token()
        g.current_user = user
        return redirect('/')

# start the flask loop
if __name__ == '__main__':
    app.run(debug=True)
