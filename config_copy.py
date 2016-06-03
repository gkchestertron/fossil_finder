import os
# change MAIL_USERNAME and MAIL_PASSWORD below to your credentials (for gmail - if you don't have gmail, you are on your own)
# newer gmail accounts may need to be set to allow less secure apps to access them for development - it's buried under your gmail settings somewhere

DEBUG = True                                                                       
# development db
# SQLALCHEMY_DATABASE_URI = 'mysql://fossil_finder:development@localhost:3306/fossil_finder'
SQLALCHEMY_DATABASE_URI = ''
SERIALIZER_KEY = 'dinosaurs are really awesome!'
SECRET_KEY = 'dinosaurs are really really awesome!'
MAIL_SERVER = 'smtp.gmail.com'
MAIL_PORT = 587
MAIL_USE_TLS = True
MAIL_USE_SSL = False
MAIL_USERNAME = ''
MAIL_PASSWORD = ''
APP_URL = 'http://localhost:5000/'
AUTH_LEVEL_NORMAL = 1
AUTH_LEVEL_EXPERT = 2
AUTH_LEVEL_ADMIN  = 3
APP_ROOT = os.path.dirname(os.path.abspath(__file__))   # refers to application_top
APP_IMAGE_FOLDER = os.path.join(APP_ROOT, 'static/images')
# development table name
# IMG_TABLE_NAME = 'img_fossil_project'
IMG_TABLE_NAME = ''
