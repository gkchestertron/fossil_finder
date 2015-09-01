from flask import Flask, session, render_template, Blueprint, g, abort
from functools import wraps
from models import User

# create static blueprint
admin = Blueprint("admin", __name__)
app = Flask(__name__)
app.config.from_object('config')

def is_admin(func):
    @wraps(func)
    def decorated(*args, **kwargs):
        token = session.get('token')
        user = User.from_token(token)
        if not user or user.auth_level < 3:
            abort(403)
        else:
            g.current_user = user
            return func(*args, **kwargs)
    return decorated

@admin.route('/admin')
@is_admin
def get_admin():
    return render_template('admin.html', current_user=g.current_user)
