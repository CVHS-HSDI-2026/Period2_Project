import requests

from flask import Blueprint, request, jsonify
from database import Database
from musicbrainz import MusicBrainzDatabase

music_bp = Blueprint('music', __name__)
app_db = Database()
mb_db = MusicBrainzDatabase()


def _ensure_artist_exists(artist_mbid: str) -> bool:
    if not artist_mbid:
        return False

    local_artist = app_db.get_artist_by_mbid(artist_mbid)
    if local_artist:
        return True

    mb_artist = mb_db.get_artist_by_mbid(artist_mbid)
    if not mb_artist:
        return False

    app_db.create_artist(mb_artist)
    return True


@music_bp.route('/search', methods=['GET'])
def search_music():
    query = request.args.get('query')
    search_type = request.args.get('type', 'artist')

    if not query:
        return jsonify({"message": "Missing search query"}), 400

    results = mb_db.search(query, search_type)
    return jsonify(results=results), 200


@music_bp.route('/artist/<mbid>', methods=['GET'])
def get_artist(mbid):
    local_artist = app_db.get_artist_by_mbid(mbid)

    if not local_artist:
        mb_artist = mb_db.get_artist_by_mbid(mbid)
        if not mb_artist:
            return jsonify({"message": "Artist not found"}), 404

        app_db.create_artist(mb_artist)
        local_artist = app_db.get_artist_by_mbid(mbid)

    return jsonify(local_artist=local_artist), 200


@music_bp.route('/album/<mbid>', methods=['GET'])
def get_album(mbid):
    local_album = app_db.get_album_by_mbid(mbid)

    if not local_album:
        mb_album = mb_db.get_album_by_mbid(mbid)
        if not mb_album:
            return jsonify({"message": "Album not found"}), 404

        artist_mbid = mb_album.get('artist_mbid')
        _ensure_artist_exists(artist_mbid)

        cover_art_url = None
        caa_response = requests.get(f"http://coverartarchive.org/release-group/{mbid}")
        if caa_response.status_code == 200:
            images = caa_response.json().get('images', [])
            if images:
                cover_art_url = images[0].get('image')

        app_db.create_album(mb_album, cover_art_url)
        local_album = app_db.get_album_by_mbid(mbid)

    return jsonify(local_album=local_album), 200


@music_bp.route('/song/<mbid>', methods=['GET'])
def get_song(mbid):
    local_song = app_db.get_song_by_mbid(mbid)

    if not local_song:
        mb_song = mb_db.get_song_by_mbid(mbid)
        if not mb_song:
            return jsonify({"message": "Song not found"}), 404

        artist_mbid = mb_song.get('artist_mbid')
        _ensure_artist_exists(artist_mbid)

        app_db.create_song(mb_song)
        local_song = app_db.get_song_by_mbid(mbid)

    reviews = app_db.fetch_reviews(song_id=local_song['id'])

    return jsonify({
        "song": local_song,
        "reviews": reviews
    }), 200
