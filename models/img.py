from db import db

# class for images from existing db
class Img(db.Model):
    __tablename__ = 'img_fossil_project'
    seq_num  = db.Column(db.Integer, primary_key = True)
    ref      = db.relationship('Ref', primaryjoin='Img.seq_num==foreign(Ref.seq_num)')
    imgnum   = db.Column(db.Integer)
    genre    = db.Column(db.String(9))
    collectn = db.Column(db.String(16))
    kwid     = db.Column(db.String(19))

    def href(self):
        split = self.kwid.split(' ')
        href = 'http://calphotos.berkeley.edu/imgs/ucmp_zoom/%s_%s/%s/%s.jpeg' % (split[0], split[1], split[2], split[3])
        return href
