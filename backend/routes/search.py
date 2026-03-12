from flask import Blueprint, request, jsonify, session
from flask_jwt_extended import create_access_token, set_access_cookies, unset_jwt_cookies, jwt_required, get_jwt_identity
from database import Database
import bcrypt

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