from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from database import Database

reviews_bp = Blueprint('reviews', __name__)
db = Database()

@jwt_required
@reviews_bp.route('/', methods=['POST'])
def create_review():
    """
    Creates a new review for a Song OR Album.
    """

    username = get_jwt_identity()
    user_id = db.get_user(username)["user_id"]
    if not user_id:
        return jsonify({"message": "User does not exist"}), 404

    data = request.get_json()
    song_id = data['song_id']
    album_id = data['album_id']
    rating = data['rating']
    review_text = data['review_text']

    if not rating or not review_text or (not song_id and not album_id):
        return jsonify(
            {"message": "Invalid request. Missing required fields: song_id, album_id, rating, review_text"}), 400

    existing_review = db.fetch_review(user_id, song_id, album_id)
    if existing_review:
        return jsonify({"message": "Review already exists"}), 400

    new_review = db.create_review(user_id, song_id, album_id, rating, review_text)
    if new_review:
        return jsonify({"message": "Review created"}), 201
    else:
        return jsonify({"message": "Failed to create review"}), 500

@jwt_required
@reviews_bp.route('/<int:review_id>', methods=['DELETE'])
def delete_review(review_id):
    """
    Deletes a review.
    """

    username = get_jwt_identity()
    user_id = db.get_user(username)["user_id"]
    if not user_id:
        return jsonify({"message": "User does not exist"}), 404

    existing_review = db.fetch_review(user_id, review_id)
    if not existing_review["user_id"] == user_id:
        return jsonify({"message": "User does not own review"}), 400

    deleted_review = db.delete_review(user_id, review_id)
    if deleted_review:
        return jsonify({"message": "Review deleted"}), 200
    else:
        return jsonify({"message": "Failed to delete review"}), 500

@reviews_bp.route('/<int:review_id>/reply', methods=['POST'])
def reply_to_review(review_id):
    """
    Adds a reply to an existing review.
    """
    # Todo: Logic:
    # 1. Get user_id from session.
    # 2. Parse content from request.
    # 3. Call db.reply(review_id, user_id, content).
    # Returns: Success message.
    pass

@reviews_bp.route('/song/<int:song_id>', methods=['GET'])
def get_song_reviews(song_id):
    """
    Gets all reviews for a specific song (internal ID).
    """
    # Todo: Logic:
    # 1. Query Review table where song_id matches.
    # 2. Join with Users table to get username/pfp of the reviewer.
    # 3. Fetch replies for each review (could be done via a separate query or nested).
    # Returns: List of reviews with nested replies.
    pass