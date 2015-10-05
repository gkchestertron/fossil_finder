from flask import Flask, session, render_template, Blueprint, g, request, redirect, url_for, flash, abort
from models import User
from flask.ext.mail import Mail, Message

# create blueprint
authentication = Blueprint("authentication", __name__)

app = Flask(__name__)
app.config.from_object('config')
mail = Mail(app)

@authentication.before_request
def csrf_protect():
    if request.method == "POST":
        token = session.pop('_csrf_token', None)
        if not token or token != request.form.get('_csrf_token'):
            abort(403)

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
            if user.active:
                user.login()
            return redirect('/')

    if email is None or password is None:
        return redirect('/')

    user = User.from_email(email)

    if not user.active and not user.auth_level == 3:
        flash(u'Inactive User', 'danger')
        return redirect('/')

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

@authentication.route('/reset_password', methods=['POST', 'GET'])
def reset_password():
    if request.method == 'GET':
        token = request.args.get('token')
        if not token:
            return render_template('reset_password.html', step=1)
        else:
            user = User.from_token(token)
            if user:
                return render_template('reset_password.html', step=2, token=token)
            else:
                flash(u'Password Reset Failed', 'danger')
                return redirect('/')

    elif request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')
        confirm_password = request.form.get('confirm_password')
        token = request.form.get('token')

        if email:
            user = User.from_email(email)

            if not user:
                flash(u'Failed to Find User', 'danger')
                return redirect('/')

            reset_link = app.config.get('APP_URL') + 'reset_password?token=' + user.generate_token()
            msg = Message("Password Reset",
                          sender="john.fellman@gmail.com",
                          recipients=[email],
                          body="Please Click to Reset Your Password: " + reset_link)
            mail.send(msg)
            flash(u'Password Email Link has been Sent to Your Email', 'success')
            return redirect('/')

        elif password and confirm_password and password == confirm_password and token:
            user = User.from_token(token)

            if user:
                user.generate_password_hash(password)
                flash(u'Password Updated Successfully - Please Login', 'success')
            else:
                flash(u'Password Update Failed', 'danger')

            return redirect('/')

        else:
            flash(u'Password Reset Failed', 'danger')
            return redirect('/')
