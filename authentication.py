from flask import Flask, session, render_template, Blueprint, g, request, redirect, url_for, flash
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
        flash(u'Login Failed - Bad Email or Password', 'danger')
        return redirect('/')
    else:
        flash(u'Login Successful - Welcome!', 'success')
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
    confirm = request.form.get('confirm_password') 

    if request.method == 'GET' or not email or not password or password != confirm:
        return render_template('signup.html')

    user = User.create(auth_level=1, email=email, password=password)

    if not user:
        flash(u'Signup Failed - Bad Email or Password', 'danger')
        return redirect('/')

    verify_link = app.config.get('APP_URL') + 'verify_email?token=' + user.generate_token()
    msg = Message("Hello,  welcome to UCMP Fossil Finder",
                  sender="john.fellman@gmail.com",
                  recipients=[email],
                  body="Please verify your email: " + verify_link)
    mail.send(msg)
    flash(u'Signup Successful - Please Check Your Email for Verification Link', 'success')
    return redirect('/')

# verify email
@authentication.route('/verify_email')
def verify_email():
    token = request.args.get('token')
    user = User.from_token(token)
    if user and not user.verified:
        user.verify()
        user.login()
        flash(u'Email Verified - Welcome!', 'success')
    else:
        flash(u'Something went Wrong - Please Try Signing up Again', 'danger')
    return redirect('/')
