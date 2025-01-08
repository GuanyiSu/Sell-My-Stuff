from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os

from models import Product
from database import db

app = Flask(__name__)
CORS(app)

# ----------------------
# Database configuration
# ----------------------
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///furniture.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

# --------------
# Uploads config
# --------------
app.config['UPLOAD_FOLDER'] = os.path.join(os.getcwd(), 'uploads')
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)  # Ensure the folder exists

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

def allowed_file(filename: str) -> bool:
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

@app.before_first_request
def create_tables():
    db.create_all()

@app.route('/api/products', methods=['GET'])
def get_products():
    products = Product.query.all()
    print([p.to_dict() for p in products])
    return jsonify([p.to_dict() for p in products]), 200

# ------------------------------------------------
# Route to serve uploaded images from uploads/ dir
# ------------------------------------------------
@app.route('/api/products/upload', methods=['POST'])
def upload_product():
    print(request.files)

    # 1. Check if "image" is in request.files
    if 'image' not in request.files:
        return jsonify({"error": "No image file part"}), 400

    file = request.files['image']
    name = request.form.get('name')
    price = request.form.get('price')
    contact = request.form.get('contact')

    # 2. Check for empty filename
    if file.filename == '':
        return jsonify({"error": "Empty filename"}), 400

    # 3. Check file extension
    if not allowed_file(file.filename):
        return jsonify({"error": "File type not allowed"}), 400

    # 4. Save the file (example of saving locally)
    from werkzeug.utils import secure_filename
    filename = secure_filename(file.filename)
    file.save(os.path.join(app.config["UPLOAD_FOLDER"], filename))

    # 5. Create a new Product item and insert into DB
    try:
        new_product = Product(
            name=name,
            price=float(price),
            contact=contact,
            image_path=f"uploads/{filename}"  # store relative path
        )
        db.session.add(new_product)
        db.session.commit()
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    # 6. Return success, including the newly created product
    return jsonify(new_product.to_dict()), 201

@app.route('/uploads/<path:filename>')
def serve_uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)


if __name__ == '__main__':
    app.run(port=8000, debug=True)