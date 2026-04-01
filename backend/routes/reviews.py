from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from database import Database
from musicbrainz import MusicBrainzDatabase

reviews_bp = Blueprint('reviews', __name__)
db = Database()
mbdb = MusicBrainzDatabase()


@reviews_bp.route('/', methods=['POST'])
@jwt_required()
def create_review():
    """
    Creates a new review for a Song OR Album.
    """

    username = get_jwt_identity()
    user_id = db.get_user(username)["id"]
    if not user_id:
        return jsonify({"message": "User does not exist"}), 404

    data = request.get_json()
    song_id = data['song_id']
    album_id = data['album_id']
    rating = data['rating']
    review_text = data['review_text']

    if not song_id and not album_id:
        return jsonify({"message": "Invalid request. Must include either song_id or album_id"}), 400

    if not rating or not review_text:
        return jsonify(
            {"message": "Invalid request. Missing either fields: rating, review_text"}), 400

    if not rating:
        review_text = ""

    if not review_text:
        rating = None

    existing_review = db.fetch_review(user_id=user_id, song_id=song_id, album_id=album_id)
    if existing_review:
        return jsonify({"message": "Review already exists"}), 400

    new_review = db.create_review(user_id, song_id, album_id, rating, review_text)
    if new_review:
        return jsonify({"message": "Review created"}), 201
    else:
        return jsonify({"message": "Failed to create review"}), 500


@reviews_bp.route('/<int:review_id>', methods=['DELETE'])
@jwt_required()
def delete_review(review_id):
    """
    Deletes a review.
    """

    username = get_jwt_identity()
    user_id = db.get_user(username)["id"]
    if not user_id:
        return jsonify({"message": "User does not exist"}), 404

    existing_review = db.fetch_review(user_id, review_id)
    if not existing_review["id"] == user_id:
        return jsonify({"message": "User does not own review"}), 400

    deleted_review = db.delete_review(user_id, review_id)
    if deleted_review:
        return jsonify({"message": "Review deleted"}), 200
    else:
        return jsonify({"message": "Failed to delete review"}), 500


@reviews_bp.route('/<int:review_id>/reply', methods=['POST'])
@jwt_required()
def reply_to_review(review_id):
    """
    Adds a reply to an existing review.
    """

    username = get_jwt_identity()
    user_id = db.get_user(username)["id"]
    if not user_id:
        return jsonify({"message": "User does not exist"}), 404

    if not review_id:
        return jsonify({"message": "Review does not exist"}), 404

    data = request.get_json()
    content = data['content']

    if not content:
        return jsonify({"message": "Invalid request"}), 400

    add_reply = db.reply(review_id, user_id, content)
    if add_reply:
        return jsonify({"message": "Reply created"}), 201
    else:
        return jsonify({"message": "Failed to create reply"}), 500


@reviews_bp.route('/song/<int:song_id>', methods=['GET'])
def get_reviews(song_id):
    """
    Gets all reviews for a specific song (internal ID).
    """

    if not song_id:
        return jsonify({"message": "Missing song_id"}), 400

    try:
        reviews = db.fetch_reviews(song_id=song_id)
    except Exception as e:
        return jsonify({"message": "Failed to fetch reviews", "error": str(e)}), 500

    if not reviews:
        return jsonify({"message": "No reviews found for this song"}), 200

    return jsonify(reviews), 200


@reviews_bp.route('/album/<int:album_id>', methods=['GET'])
def get_album_reviews(album_id):
    """
    Gets all reviews for a specific album (internal ID).
    """

    if not album_id:
        return jsonify({"message": "Missing album_id"}), 400

    try:
        reviews = db.fetch_reviews(album_id=album_id)
    except Exception as e:
        return jsonify({"message": "Failed to fetch reviews", "error": str(e)}), 500

    if not reviews:
        return jsonify({"message": "No reviews found for this album"}), 200

    return jsonify(reviews), 200
