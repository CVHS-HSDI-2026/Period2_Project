import requests

from flask import Blueprint, request, jsonify
from database import Database
from musicbrainz import MusicBrainzDatabase

music_bp = Blueprint('music', __name__)
app_db = Database()
mb_db = MusicBrainzDatabase()


@music_bp.route('/search', methods=['GET'])
def search_music():
    query = request.args.get('query')
    search_type = request.args.get('type', 'artist')

    if not query:
        return jsonify({"message": "Missing search query"}), 400

    results = mb_db.search(query, search_type)
    return jsonify(results), 200


@music_bp.route('/artist/<mbid>', methods=['GET'])
def get_artist(mbid):
    # Todo: add a `get_artist_by_mbid` method to our app db handler
    local_artist = app_db.get_artist_by_mbid(mbid)

    if not local_artist:
        mb_artist = mb_db.get_artist_by_mbid(mbid)
        if not mb_artist:
            return jsonify({"message": "Artist not found"}), 404

        # Todo: add a `create_artist` method to our app db handler
        app_db.create_artist(mb_artist)
        local_artist = app_db.get_artist_by_mbid(mbid)

    # Todo: maybe Fetch local app stats (like follow counts, etc.). In which case we need methods for artist follows, etc.

    return jsonify(local_artist), 200


@music_bp.route('/album/<mbid>', methods=['GET'])
def get_album(mbid):
    local_album = app_db.get_album_by_mbid(mbid)

    if not local_album:
        mb_album = mb_db.get_album_by_mbid(mbid)
        if not mb_album:
            return jsonify({"message": "Album not found"}), 404

        cover_art_url = None
        caa_response = requests.get(f"http://coverartarchive.org/release-group/{mbid}")
        if caa_response.status_code == 200:
            images = caa_response.json().get('images', [])
            if images:
                cover_art_url = images[0].get('image')

        app_db.create_album(mb_album, cover_art_url)
        local_album = app_db.get_album_by_mbid(mbid)

    return jsonify(local_album), 200


@music_bp.route('/song/<mbid>', methods=['GET'])
def get_song(mbid):
    local_song = app_db.get_song_by_mbid(mbid)

    if not local_song:
        mb_song = mb_db.get_song_by_mbid(mbid)
        if not mb_song:
            return jsonify({"message": "Song not found"}), 404

        app_db.create_song(mb_song)
        local_song = app_db.get_song_by_mbid(mbid)

    reviews = app_db.fetch_reviews(song_id=local_song['id'])

    return jsonify({
        "song": local_song,
        "reviews": reviews
    }), 200
