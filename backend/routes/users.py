from flask import Blueprint, request, jsonify

users_bp = Blueprint('users', __name__)

@users_bp.route('/<username>', methods=['GET'])
def get_user_profile(username):
    """
    Fetches a specific user's public profile.
    """
    # Todo: Logic:
    # 1. Call db.get_user(username, filter=["email"]).
    # 2. Calculate derived stats (follower count, following count) via a db query.
    # Returns: User object, stats, and recent activity log.
    pass

@users_bp.route('/<username>', methods=['DELETE'])
def delete_user(username):
    """
    Deletes a user account.
    """
    # Todo: Logic:
    # 1. Verify the requester is the owner of the account or an admin.
    # 2. Call db.delete_user(username).
    # Returns: Success message 200.
    pass

@users_bp.route('/follow', methods=['POST'])
def follow_user():
    """
    Makes the logged-in user follow another user.
    """
    # Todo: Logic:
    # 1. Get follower_id from session/token.
    # 2. Get followed_id from request body.
    # 3. Call db.follow_user(follower_id, followed_id).
    # Returns: Success message 200 or error if already following.
    pass

@users_bp.route('/unfollow', methods=['POST'])
def unfollow_user():
    """
    Unfollows a user.
    """
    # Todo: Logic:
    # 1. Get follower_id from session/token.
    # 2. Get followed_id from request body.
    # 3. Call db.unfollow_user(follower_id, followed_id).
    # Returns: Success message 200.
    pass

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

@users_bp.route('/favorite/song', methods=['POST'])
def add_favorite_song():
    """
    Adds a song to the user's favorites.
    """
    # Todo: Logic:
    # 1. Get user_id from session.
    # 2. Get song_id (internal ID) and rank from request.
    # 3. Call db.favorite_song(user_id, song_id, rank).
    # Returns: Success message.
    pass