from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from flask_bcrypt import Bcrypt
from .models import User
from .extensions import db

auth = Blueprint('auth', __name__)
bcrypt = Bcrypt()

@auth.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data or not data.get('username') or not data.get('password') or not data.get('email'):
        return jsonify({"msg": "Missing requirements"}), 400

    if User.query.filter_by(username=data['username']).first():
        return jsonify({"msg": "Username already exists"}), 409
    
    if User.query.filter_by(email=data['email']).first():
        return jsonify({"msg": "Email already exists"}), 409

    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    new_user = User(username=data['username'], email=data['email'], password_hash=hashed_password)
    
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"msg": "User created successfully"}), 201

@auth.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data.get('username')).first()

    if user and bcrypt.check_password_hash(user.password_hash, data.get('password')):
        access_token = create_access_token(identity=user.id)
        return jsonify(access_token=access_token, user={"id": user.id, "username": user.username, "email": user.email}), 200
    
    return jsonify({"msg": "Bad username or password"}), 401

@auth.route('/profile', methods=['GET'])
@jwt_required()
def profile():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    if not user:
        return jsonify({"msg": "User not found"}), 404
        
    return jsonify({"id": user.id, "username": user.username, "email": user.email}), 200
