## For Development:
These are the steps I followed to get my mac setup to run this project:

1. clone repo
1. cd into repo
1. setup virtualenv and install python packages (http://flask.pocoo.org/docs/0.10/installation/)
1. install and setup mysql I used the latest dmg from the official site (https://dev.mysql.com/downloads/mysql/)
1. also install MySQL-python, Flask-Restless, Flask-SQLAlchemy, and Flask-Assets (I used pip)
1. link the mysql library 
 - $ sudo ln -s /usr/local/mysql/lib/libmysqlclient.18.dylib /usr/lib/libmysqlclient.18.dylib
1. create user fossil_finder with password 'development' (do as root)
 - mysql> CREATE USER 'fossil_finder'@'localhost' IDENTIFIED BY 'development';
1. create database
 - mysql> create DATABASE fossil_finder;
1. import db file as fossil_finder db
 - $ mysql -u root -p fossil_finder < img_fossil_project_20150507.sql
1. grant privileges to user on fossil_finder db
 - mysql> GRANT ALL PRIVILEGES ON fossil_finder.* TO 'fossil_finder'@'localhost';
1. to run app in dev, call 'python app.py' from the command line
