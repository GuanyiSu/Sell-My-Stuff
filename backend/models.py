from database import db

class Product(db.Model):
    __tablename__ = "products"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    image_path = db.Column(db.String(255), nullable=True)  # <--- updated field
    price = db.Column(db.Float, nullable=False)
    contact = db.Column(db.String(100), nullable=False)

    def to_dict(self):

        return {
            "id": self.id,
            "name": self.name,
            "image_path": self.image_path,  # We'll use this to display the image
            "price": self.price,
            "contact": self.contact
        }
    

    

