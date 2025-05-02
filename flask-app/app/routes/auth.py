from flask import Blueprint, request, jsonify
from app import db, bcrypt
from app.models import User
from flask_jwt_extended import create_access_token

auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        username = data.get('username', '').strip()
        password = data.get('password', '').strip()

        if not username or not password:
            return jsonify({"msg": "Username and password required"}), 400

        with db.session() as session:
            user = session.query(User).filter_by(username=username).first()

            if not user or not bcrypt.check_password_hash(user.password, password):
                return jsonify({"msg": "Invalid credentials"}), 401

            access_token = create_access_token(identity=str(user.id))  # Convert to string
            return jsonify(access_token=access_token), 200

    except Exception as e:
        return jsonify({"msg": str(e)}), 500


@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        username = data.get('username', '').strip()
        password = data.get('password', '').strip()

        if not username or not password:
            return jsonify({"msg": "Username and password required"}), 400

        # Check existing user WITHIN APP CONTEXT
        with db.session() as session:
            if session.query(User).filter_by(username=username).first():
                return jsonify({"msg": "Username exists"}), 409

            hashed_pw = bcrypt.generate_password_hash(password).decode('utf-8')
            new_user = User(username=username, password=hashed_pw)

            session.add(new_user)
            session.commit()

        return jsonify({"msg": "Registration successful"}), 201

    except Exception as e:
        return jsonify({"msg": str(e)}), 500
