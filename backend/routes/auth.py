from flask import Blueprint, request, jsonify, session
from flask_jwt_extended import create_access_token, set_access_cookies, unset_jwt_cookies, jwt_required, \
    get_jwt_identity
from database import Database
import bcrypt

auth_bp = Blueprint('auth', __name__)
db = Database()


@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()

    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    if not username or not email or not password:
        return jsonify({"message": "Missing required fields"}), 400

    hashed_pw = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt(rounds=12)).decode('utf-8')

    user_data = {
        "username": username,
        "email": email,
        "password_hash": hashed_pw,
        "bio": data.get("bio", ""),
        "profile_pic_url": data.get("profile_pic_url", "")
    }

    try:
        db.create_user(user_data)
        return jsonify({"message": "User created successfully"}), 201
    except ValueError:
        return jsonify({"message": "Username or email already exists"}), 400
    except Exception as e:
        print(f"Register Error: {e}")
        return jsonify({"message": "Internal server error"}), 500


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    login_id = data.get("username")
    password = data.get("password")

    if not login_id or not password:
        return jsonify({"message": "Missing credentials"}), 400

    user = db.get_user(login_id, filter=[])
    if not user:
        # dumb check by email if we can't find the user by username
        db.cursor.execute("SELECT * FROM users WHERE email = %s", (login_id,))
        row = db.cursor.fetchone()
        if not row:
            return jsonify({"message": "Invalid credentials"}), 401
        user = dict(zip([desc[0] for desc in db.cursor.description], row))

    stored_hash = user["password_hash"].encode('utf-8')
    if not bcrypt.checkpw(password.encode('utf-8'), stored_hash):
        return jsonify({"message": "Invalid credentials"}), 401

    access_token = create_access_token(identity=user["username"])
    sanitized_user = db.get_user(user["username"], filter=["password_hash"])

    return jsonify({
        "message": "Login Successful",
        "user": sanitized_user,
        "token": access_token
    }), 200


@auth_bp.route('/logout', methods=['POST'])
def logout():
    """
    Logs out the current user.
    """
    response = jsonify({"message": "Logout Successful"})
    unset_jwt_cookies(response)
    return response, 200


@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    """
    Gets the currently logged-in user's session data.
    """
    current_user_identity = get_jwt_identity()
    if not current_user_identity:
        return jsonify({"message": "No identity provided"}), 401

    current_user = db.get_user(current_user_identity)
    if not current_user:
        return jsonify({"message": "User not found"}), 404

    sanitized_user = db.get_user(current_user_identity, filter=["password_hash"])

    return jsonify({"message": "Fetched successfully", "user": sanitized_user}), 200


def hash_password(password, salt):
    return bcrypt.hashpw(password, salt)
