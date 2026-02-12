from flask import Blueprint, request, jsonify, session
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
    #else:
        #Hash the password :D
        
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
    # Todo: we should probably change this to a session token in the future, but a JWT token will work for now

    # Todo: Logic:
    # 1. Parse username and password from request.
    # 2. Call db.get_user(username, filter=[]) to get the user + password_hash.
    # 3. Verify provided password against stored hash using bcrypt.checkpw.
    # 4. If valid, generate a JWT token (in the future we can change this to a session token).
    # Returns: Auth token and user info (excluding password), or error 401.
    pass

@auth_bp.route('/logout', methods=['POST'])
def logout():
    """
    Logs out the current user.
    """
    # Todo: Logic:
    # 1. Clear the flask session and/or blacklist the JWT token.
    # Returns: Success message 200.
    pass

@auth_bp.route('/me', methods=['GET'])
def get_current_user():
    """
    Gets the currently logged-in user's session data.
    """
    # Todo: Logic:
    # 1. Check if user_id exists in session/token.
    # 2. Call db.get_user() by ID (we might need to add get_user_by_id to the DB).
    # Returns: User profile data for the frontend context.
    pass