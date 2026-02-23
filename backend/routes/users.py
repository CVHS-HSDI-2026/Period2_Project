from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from database import Database
from routes import auth

users_bp = Blueprint('users', __name__)
db = Database()

@users_bp.route('/<username>', methods=['GET'])
def get_user_profile(username):
    """
    Fetches a specific user's public profile.
    """
    # Todo: Logic:
    user = db.get_user(username, filter=["email", "password_hash", "created_at", "updated_at"])
    user_id = user["id"]
    followed_by = db.get_followed_count(user_id)
    following_count = db.get_following_count(user_id)

    # 2. Calculate derived stats (follower count, following count) via a db query.
    # Returns: User object, stats, and recent activity log.
    pass

@jwt_required()
@users_bp.route('/<username>', methods=['DELETE'])
def delete_user(username):
    """
    Deletes a user account.
    """
    # Todo: Logic:
    # 1. Verify the requester is the owner of the account or an admin.
    # 2. Call db.delete_user(username).
    # Returns: Success message 200.

    current_user_identity = get_jwt_identity()
    user = db.get_user(username=current_user_identity)

    if not current_user_identity:
        return jsonify({"message": "User not logged in"}), 401

    if not user:
        return jsonify({"message": "User does not exist"}), 401

    if user == username:
        db.delete_user(username)
        auth.logout()

    return jsonify({"message": "Successfully deleted user"}), 200

@jwt_required()
@users_bp.route('/follow', methods=['POST'])
def follow_user():
    """
    Makes the logged-in user follow another user.

    DTO:
    {
      "followed_id": int
    }
    """
    # Todo: Logic:
    # 1. Get follower_id from session.
    # 2. Get followed_id from request body.
    # 3. Call db.follow_user(follower_id, followed_id).
    # Returns: Success message 200 or error if already following.

    data = request.get_json()
    current_user_identity = get_jwt_identity()

    follower_id = db.get_user(username=current_user_identity)["user_id"]
    followed_id = data["followed_id"]

    if not current_user_identity:
        return jsonify({"message": "User not logged in"}), 401

    if not followed_id:
        return jsonify({"message": "No account id to follow"}), 401

    db.follow_user(follower_id, followed_id)
    return jsonify({"message": "Successfully followed user"}), 200


@jwt_required()
@users_bp.route('/unfollow', methods=['POST'])
def unfollow_user():
    """
    Unfollows a user.
    DTO:
    {
      "followed_id": int
    }
    """
    # Todo: Logic:
    # 1. Get follower_id from session/token.
    # 2. Get followed_id from request body.
    # 3. Call db.unfollow_user(follower_id, followed_id).
    # Returns: Success message 200.

    data = request.get_json()
    current_user_identity = get_jwt_identity()

    follower_id = db.get_user(username=current_user_identity)["user_id"]
    followed_id = data["followed_id"]

    if not current_user_identity:
        return jsonify({"message": "User not logged in"}), 401

    if not followed_id:
        return jsonify({"message": "No account id to follow"}), 401

    db.unfollow_user(follower_id, followed_id)
    return jsonify({"message": "Successfully unfollowed user"}), 200


@users_bp.route('/<username>/favorites', methods=['GET'])
def get_user_favorites(username):
    """
    Gets a user's favorite songs.
    """
    # Todo: Logic:
    # 1. Get user_id from username.
    # 2. Query User_Favorite_Song table joined with Song/Artist tables.
    # Returns: List of song objects with rankings.
    pass

@jwt_required()
@users_bp.route('/favorite/song', methods=['POST'])
def add_favorite_song():
    """
    Adds a song to the user's favorites.

    DTO:
    {
      "song_id": int,
      "rank": int,
    }
    """
    # Todo: Logic:
    # 1. Get user_id by getting the user by username from the current session.
    # 2. Get song_id (internal ID) and rank from request.
    # 3. Call db.favorite_song(user_id, song_id, rank).
    # Returns: Success message.

    data = request.get_json()
    current_user_identity = get_jwt_identity()

    if not current_user_identity:
        return jsonify({"message": "User not logged in"}), 401

    if not data["song_id"]:
        return jsonify({"message": "Song not found"}), 401

    if not data["rank"]:
        return jsonify({"message": "Rank not found"}), 401

    user_id = db.get_user(username=current_user_identity)["user_id"]
    song_id = data["song_id"]
    rank = data["rank"]

    if not user_id:
        return jsonify({"message": "User not logged in"}), 401

    success = db.favorite_song(user_id, song_id, rank)

    if not success:
        return jsonify({"message": "Failed to favorite song"}), 500
    else:
        return jsonify({"message": "Successfully favorite song"}, song_id=song_id), 200