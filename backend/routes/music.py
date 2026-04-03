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

def _ensure_album_exists(album_mbid: str, cover_url: str = None) -> bool:
    if not album_mbid:
        return False

    local_album = app_db.get_album_by_mbid(album_mbid)
    if local_album:
        return True

    mb_album = mb_db.get_album_by_mbid(album_mbid)
    if not mb_album:
        return False

    _ensure_artist_exists(mb_album.get('artist_mbid'))
    app_db.create_album(mb_album, cover_url)
    return True

def enrich_and_sort(items):
    if not items: return []
    mbids = tuple(item['mbid'] for item in items)
    stats = app_db.get_stats_for_mbids(mbids)

    for item in items:
        item_stats = stats.get(item['mbid'], {})
        item['commentsCount'] = item_stats.get('review_count', 0)
        item['rating'] = item_stats.get('rating', 0)

    items.sort(key=lambda x: (x.get('commentsCount', 0), float(x.get('rating', 0))), reverse=True)
    return items

@music_bp.route('/search', methods=['GET'])
def search_music():
    query = request.args.get('query')
    search_type = request.args.get('type', 'all')
    limit = int(request.args.get('limit', 10))

    if not query:
        return jsonify({"message": "Missing search query"}), 400

    results = mb_db.search(query, search_type, limit)

    if isinstance(results, dict):
        if 'albums' in results: results['albums'] = enrich_and_sort(results['albums'])
        if 'songs' in results: results['songs'] = enrich_and_sort(results['songs'])
    elif isinstance(results, list) and search_type in ['album', 'song']:
        results = enrich_and_sort(results)
        
    return jsonify(results=results), 200


@music_bp.route('/popular', methods=['GET'])
def get_popular_music():
    results = app_db.get_popular()
    return jsonify(results=results), 200


@music_bp.route('/new_releases', methods=['GET'])
def new_releases():
    results = app_db.get_new_releases()
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

    artist_discography = mb_db.get_artist_discography(mbid)
    albums = artist_discography.get('albums', []) if artist_discography else []

    if albums:
        album_mbids = tuple(album['mbid'] for album in albums)

        # todo: should probably turn this review_count into its own function in the db handler...too bad!
        app_db.cursor.execute("""
                        SELECT al.mbid, COUNT(r.id) as review_count, ROUND(COALESCE(AVG(r.rating), 0), 1) as rating
                        FROM Album al LEFT JOIN Review r ON al.id = r.album_id
                        WHERE al.mbid IN %s GROUP BY al.mbid
                    """, (album_mbids,))

        local_stats = {row['mbid']: dict(row) for row in app_db.cursor.fetchall()}

        for album in albums:
            stats = local_stats.get(album['mbid'], {})
            album['rating'] = stats.get('rating', 0)
            album['commentsCount'] = stats.get('review_count', 0)

        albums.sort(key=lambda x: (x.get('commentsCount', 0), float(x.get('rating', 0))), reverse=True)

    followers_count = 0
    if local_artist and local_artist.get("id"):
        app_db.cursor.execute("""
                SELECT COUNT(*) FROM User_Favorite_Artist WHERE artist_id = %s
            """, (local_artist['id'],))
        followers_count = app_db.cursor.fetchone()[0]

    return jsonify({
        "artist": {
            "id": local_artist.get("id"),
            "name": local_artist.get("name"),
            "mbid": local_artist.get("mbid"),
            "disambiguation": local_artist.get("disambiguation"),
            "born": local_artist.get("born"),
            "died": local_artist.get("died"),
            "followers": followers_count
        },
        "albums": albums
    }), 200


@music_bp.route('/album/<mbid>', methods=['GET'])
def get_album(mbid):
    local_album = app_db.get_album_by_mbid(mbid)

    if local_album:
        mb_album = mb_db.get_album_by_mbid(mbid)  # we still need to fetch tracks so that's why I'm doing this call
        tags = mb_db.get_album_tags(mbid)
        genre_string = ", ".join(tags) if tags else "Unknown"
        cover_url = f"https://coverartarchive.org/release-group/{mbid}/front-250"

        local_artist = app_db.get_artist_by_id(local_album.get('artist_id'))

    else:
        mb_album = mb_db.get_album_by_mbid(mbid)
        if not mb_album:
            return jsonify({"message": "Album not found"}), 404

        tags = mb_db.get_album_tags(mbid)
        genre_string = ", ".join(tags) if tags else "Unknown"
        cover_url = mb_album.get('cover_url')

        artist_mbid = mb_album.get('artist_mbid')
        _ensure_artist_exists(artist_mbid)
        app_db.create_album(mb_album, cover_url)

        local_album = app_db.get_album_by_mbid(mbid)
        local_artist = {"name": mb_album.get("artist_name"), "mbid": artist_mbid}

    reviews = app_db.fetch_reviews(album_id=local_album['id']) if local_album else []

    avg_rating = 5
    if reviews:
        valid_ratings = [r['rating'] for r in reviews if r.get('rating') is not None]
        if valid_ratings:
            avg_rating = round(sum(valid_ratings) / len(valid_ratings), 1)

    return jsonify({
        "album": {
            "id": local_album.get("id"),
            "title": local_album.get("title") if local_album else mb_album.get("title"),
            "mbid": mbid,
            "artist": local_artist.get("name"),
            "artist_mbid": local_artist.get("mbid"),
            "year": mb_album.get("release_year") if mb_album else "Unknown",
            "cover": cover_url,
            "genre": genre_string,
            "rating": avg_rating,
            "tracks": mb_album.get("tracks", []) if mb_album else []
        },
        "reviews": reviews
    }), 200


@music_bp.route('/song/<mbid>', methods=['GET'])
def get_song(mbid):
    local_song = app_db.get_song_by_mbid(mbid)

    if local_song:
        mb_song = mb_db.get_song_by_mbid(mbid)  # similarly, we also need the latest album context
        tags = mb_db.get_song_tags(mbid)
        genre_string = ", ".join(tags) if tags else "Unknown"

        local_artist = app_db.get_artist_by_id(local_song.get('artist_id'))
    else:
        mb_song = mb_db.get_song_by_mbid(mbid)
        if not mb_song:
            return jsonify({"message": "Song not found"}), 404

        tags = mb_db.get_song_tags(mbid)
        genre_string = ", ".join(tags) if tags else "Unknown"

        artist_mbid = mb_song.get('artist_mbid')
        _ensure_artist_exists(artist_mbid)

        album_mbid = mb_song.get('album_mbid')
        if album_mbid:
            _ensure_album_exists(album_mbid, mb_song.get('cover_url'))

        app_db.create_song(mb_song)
        local_song = app_db.get_song_by_mbid(mbid)
        local_artist = {"name": mb_song.get("artist_name"), "mbid": artist_mbid}

    reviews = app_db.fetch_reviews(song_id=local_song['id']) if local_song else []

    avg_rating = 5
    if reviews:
        valid_ratings = [r['rating'] for r in reviews if r.get('rating') is not None]
        if valid_ratings:
            avg_rating = round(sum(valid_ratings) / len(valid_ratings), 1)

    return jsonify({
        "song": {
            "id": local_song.get("id"),
            "title": local_song.get("title") if local_song else mb_song.get("title"),
            "mbid": mbid,
            "artist": local_artist.get("name"),
            "artist_mbid": local_artist.get("mbid"),
            "album": mb_song.get("album_title") if mb_song else "Unknown Album",
            "album_mbid": mb_song.get("album_mbid") if mb_song else None,
            "rating": avg_rating,
            "genre": genre_string,
            "duration": local_song.get("duration") if local_song else mb_song.get("duration"),
            "year": mb_song.get("release_year") if mb_song else "Unknown",
            "cover": mb_song.get("cover_url") if mb_song else None
        },
        "reviews": reviews
    }), 200
