## For Development:
These are the steps I followed to get my mac setup to run this project:

1. clone repo
1. cd into repo
1. setup virtualenv and install python packages (http://flask.pocoo.org/docs/0.10/installation/)
1. (if you don't have mysql already) install and setup mysql I used the latest dmg from the official site (https://dev.mysql.com/downloads/mysql/)
1. install dependencies with: $ pip install -r requirements.txt
1. (if you don't have mysql already) link the mysql library 
 - $ sudo ln -s /usr/local/mysql/lib/libmysqlclient.18.dylib /usr/lib/libmysqlclient.18.dylib
1. create user fossil\_finder with password 'development' (do as root)
 - mysql> CREATE USER 'fossil\_finder'@'localhost' IDENTIFIED BY 'development';
1. create database
 - mysql> create DATABASE fossil\_finder;
1. import db file as fossil\_finder db
 - $ mysql -u root -p fossil\_finder < util/img\_fossil\_project\_20150507.sql
1. grant privileges to user on fossil\_finder db
 - mysql> GRANT ALL PRIVILEGES ON fossil\_finder.\* TO 'fossil\_finder'@'localhost';
1. email me for a copy of config.py
1. to run app in dev, call 'python app.py' from the command line
