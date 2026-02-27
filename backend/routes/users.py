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

    user = db.get_user(username, filter=["email", "password_hash", "created_at", "updated_at"])
    user_id = user["id"]
    if not user_id:
        return jsonify("User does not exist"), 404

    followed_by = db.get_followed_count(user_id)
    following_count = db.get_following_count(user_id)
    activity = db.get_user_activity(user_id)

    if not followed_by:
        return jsonify("Failed to fetch followed users"), 500

    if not following_count:
        return jsonify("Failed to fetch following users"), 500

    if not activity:
        return jsonify("Failed to fetch activity"), 500

    return jsonify(user=user, followed=followed_by, following=following_count, activity=activity), 200

@jwt_required()
@users_bp.route('/<username>', methods=['DELETE'])
def delete_user(username):
    """
    Deletes a user account.
    """

    current_user_identity = get_jwt_identity()
    user = db.get_user(username=current_user_identity)

    if not current_user_identity:
        return jsonify({"message": "User not logged in"}), 401

    if not user:
        return jsonify({"message": "User does not exist"}), 404

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
    user_id = db.get_user(username)["user_id"]
    if not user_id:
        return jsonify({"message": "Provided user does not exist"}), 401

    favorites = db.get_user_favorites(user_id)
    if not favorites:
        return jsonify({"message": "Failed to fetch favorites for user"}), 500

    return jsonify(username=username, favorites=favorites), 200

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