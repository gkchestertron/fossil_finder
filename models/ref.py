from db import db, INTEGER

class Ref(db.Model):
    __tablename__ = 'fossil_finder_img_refs'
    id                      = db.Column(db.Integer, primary_key = True)
    seq_num                 = db.Column(INTEGER(unsigned=True), index = True, nullable = False, unique = True)
    img                     = db.relationship('Img', primaryjoin='Ref.seq_num==foreign(Img.seq_num)', passive_deletes=True, uselist=False)
    tags                    = db.relationship('Tag', primaryjoin='Ref.id==foreign(Tag.img_ref_id)', cascade='all', lazy='subquery')
    last_accessed_user_id   = db.Column(db.Integer, index = True)
    last_accessed_date_time = db.Column(db.DateTime, index = True)
    completed_by_user_id    = db.Column(db.Integer, index = True)
    scale                   = db.Column(db.Float)
    failed_to_load          = db.Column(db.Boolean)
 
