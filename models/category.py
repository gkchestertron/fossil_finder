from db import db

class Category(db.Model):
    __tablename__ = 'fossil_finder_img_tag_categories'
    id       = db.Column(db.Integer, primary_key = True)
    name     = db.Column(db.String(255))
    filename = db.Column(db.String(255))


