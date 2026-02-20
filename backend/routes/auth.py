from flask import Blueprint, request, jsonify, session
from flask_jwt_extended import create_access_token, set_access_cookies, unset_jwt_cookies, jwt_required, get_jwt_identity
from database import Database
import bcrypt

auth_bp = Blueprint('auth', __name__)
db = Database()

@auth_bp.route('/register', methods=['POST'])
def register():
    """
    Registers a new user.

    """
    # Todo: Logic:
    # 1. Parse JSON data from request (username, email, password, bio, etc.).
    # 2. Validate input (check if fields are empty).
    # 3. Hash the password using bcrypt.
    # 4. Call db.create_user(user_data).
    # 5. Handle ValueError if username/email exists.
    # Returns: JSON object with user_id and success message, or error 400.
    """
    {
        "username": "string",
        "email": "string",
        "password": "string",
        "bio": "string",
        "profile_pic_url": "string"
    }
    """
    data = request.get_json()
    user_data = {}
    if not data["username"]:
        return "Missing username", 400
    else:
        user_data["username"] = data["username"]

    if not data["email"]:
        return "Missing email", 400
    else:
        user_data['email'] = data['email']

    if not data["password_hash"]:
        return "Missing password", 400
    else:
        user_data['password_hash'] = hash_password(data["password_hash"].encode('utf-8'), bcrypt.gensalt(rounds=12))

    if not data["bio"]:
        user_data["bio"] = ""
    else:
        user_data["bio"] = data["bio"]

    if not data["profile_pic_url"]:
        user_data["profile_pic_url"] = ""
    else:
        user_data["profile_pic_url"] = data["profile_pic_url"]

    try:
        db.create_user(user_data)
    except ValueError:
        return "Current username/email already exist. Be more creative :D", 400
    except Exception as e:
        return f"Gateway internal error:\n{e}", 500 
    return "User created successfuly", 200  

@auth_bp.route('/login', methods=['POST'])
def login():
    """
    Logs in an existing user.
    """
    data = request.get_json()
    username = data["username"]
    password = data["password"]

    user = db.get_user(username, filter=[])
    if not user:
        return "Invalid Credentials", 401
    password_hash = bytes.fromhex(user["password_hash"].replace("\\x",""))

    if bcrypt.checkpw(password, password_hash):
        return "Ok", 200
    else:
        return "Invalid Credentials", 401
      
    response = jsonify({"message": "Login Successful"})
    access_token = create_access_token(identity=username)
    set_access_cookies(response, access_token)
    return jsonify(response, user=user), 200


@auth_bp.route('/logout', methods=['POST'])
def logout():
    """
    Logs out the current user.
    """
    response = jsonify({"message": "Logout Successful"})
    unset_jwt_cookies(response)
    return jsonify(response), 200

@jwt_required
@auth_bp.route('/me', methods=['GET'])
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
    return jsonify(current_user), 200

def hash_password(password, salt):
        return bcrypt.hashpw(password, salt)