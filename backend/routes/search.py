from flask import Blueprint, request, jsonify, session
from database import Database
from musicbrainz import MusicBrainzDatabase

search_bp = Blueprint('search', __name__)
db = Database()
mbdb = MusicBrainzDatabase()

@search_bp.route('/song/<query>', methods=['POST'])
def search_songs(query):
    """
    Searches for songs by title.
    """
    if not query:
        return jsonify({'error': 'Query parameter is required'}), 400
    
    results = mbdb.search(query, 'song')

    if results is None:
        return jsonify({'error': 'An error occurred while searching'}), 500
    
    if results == []:
        return jsonify({'message': 'No results found'}), 404

    return jsonify(results)

@search_bp.route('/album/<query>', methods=['POST'])
def search_albums(query):
    """
    Searches for albums by title.
    """
    if not query:
        return jsonify({'error': 'Query parameter is required'}), 400

    results = mbdb.search(query, 'album')

    if results is None:
        return jsonify({'error': 'An error occurred while searching'}), 500

    if results == []:
        return jsonify({'message': 'No results found'}), 404

    return jsonify(results)

@search_bp.route('/artist/<query>', methods=['POST'])
def search_artists(query):
    """
    Searches for artists by name.
    """
    if not query:
        return jsonify({'error': 'Query parameter is required'}), 400

    results = mbdb.search(query, 'artist')

    if results is None:
        return jsonify({'error': 'An error occurred while searching'}), 500

    if results == []:
        return jsonify({'message': 'No results found'}), 404

    return jsonify(results)

@search_bp.route('/user/<query>', methods=['POST'])
def search_users(query):
    """
    Searches for users by username.
    """
    if not query:
        return jsonify({'error': 'Query parameter is required'}), 400

    results = db.search_user(query)

    if results == []:
        return jsonify({'message': 'No results found'}), 404

    return jsonify(results)