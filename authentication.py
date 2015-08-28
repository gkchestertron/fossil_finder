from flask import Flask, session, render_template, Blueprint, g, request, redirect
from models import User
from flask.ext.mail import Mail, Message

# create blueprint
authentication = Blueprint("authentication", __name__)

app = Flask(__name__)
app.config.from_object('config')
mail = Mail(app)

# login
@authentication.route('/login', methods=['POST'])
def login():
    email = request.form['email']
    password = request.form['password']
    group_code = request.form['group_code']
    if group_code:
        user = User.from_group_code(group_code)
        if not user:
            return redirect('/')
        else:
            user.login()
            return redirect('/')

    if email is None or password is None:
        return redirect('/')

    user = User.from_email(email)
    if not user or not user.verify_password(password):
        return redirect('/')
    else:
        user.login()
        return redirect('/')

# logout
@authentication.route('/logout')
def logout():
    session['token'] = ''
    return redirect('/')

# signup
@authentication.route('/signup', methods=['GET', 'POST'])
def signup():
    email = request.form.get('email')
    password = request.form.get('password')

    if request.method == 'GET' or not email or not password:
        return render_template('signup.html')

    user = User.create(auth_level=1, email=email, password=password)

    if not user:
        return 'bad email or password', 400

    msg = Message("Hello" + user.email,
                  sender="john.fellman@gmail.com",
                  recipients=["john.fellman@gmail.com"])
    mail.send(msg)
    return redirect('/')
