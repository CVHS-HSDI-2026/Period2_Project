from flask import Blueprint, request, jsonify

from database import Database

search_bp = Blueprint('search', __name__)
db = Database()


@search_bp.route('/users', methods=['GET'])
def search_users():
    """
    Searches for users by username.
    """
    query = request.args.get('query')
    if not query:
        return jsonify({'error': 'Query parameter is required'}), 400

    results = db.search_user(query)

    if not results:
        return jsonify({'message': 'No results found'}), 404

    return jsonify(results)
