from flask import Blueprint, request, jsonify, session
from database import Database

search_bp = Blueprint('search', __name__)
db = Database()

@search_bp.route('/song/<query>', methods=['POST'])
def search_songs(query):
    """
    Searches for songs by title.
    """
    pass

@search_bp.route('/album/<query>', methods=['POST'])
def search_albums(query):
    """
    Searches for albums by title.
    """
    pass

@search_bp.route('/artist/<query>', methods=['POST'])
def search_artists(query):
    """
    Searches for artists by name.
    """
    pass