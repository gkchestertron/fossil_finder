from db import db

class Tag(db.Model):
    __tablename__ = 'fossil_finder_img_tags'
    id                  = db.Column(db.Integer, primary_key = True)
    img_ref_id          = db.Column(db.Integer, nullable = False, index = True)
    img_ref             = db.relationship('Ref', primaryjoin='foreign(Tag.img_ref_id)==Ref.id', lazy='subquery')
    top                 = db.Column(db.Float)
    left                = db.Column(db.Float)
    width               = db.Column(db.Float)
    height              = db.Column(db.Float)
    rotation            = db.Column(db.Float)
    img_tag_category_id = db.Column(db.Integer)
    category            = db.relationship('Category', primaryjoin='Tag.img_tag_category_id==foreign(Category.id)', uselist=False, passive_deletes=True)


