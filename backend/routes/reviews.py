from flask import Blueprint, request, jsonify

reviews_bp = Blueprint('reviews', __name__)

@reviews_bp.route('/', methods=['POST'])
def create_review():
    """
    Creates a new review for a Song OR Album.
    """
    # Todo: Logic:
    # 1. Get user_id from session.
    # 2. Parse song_id or album_id, rating, and review_text from request.
    # 3. Validate that user hasn't already reviewed this specific item (optional).
    # 4. Call db.create_review(...).
    # Returns: Success message and the new review ID.
    pass

@reviews_bp.route('/<int:review_id>', methods=['DELETE'])
def delete_review(review_id):
    """
    Deletes a review.
    """
    # Todo: Logic:
    # 1. Check ownership (current user_id == review owner_id).
    # 2. Call db.delete_review(review_id).
    # Returns: Success message 200.
    pass

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