from flask import Blueprint, request, jsonify

music_bp = Blueprint('music', __name__)

@music_bp.route('/search', methods=['GET'])
def search_music():
    """
    Searches for Artists, Albums, or Songs using the Solr/MusicBrainz search container.
    """
    # Todo: Logic:
    # 1. Get 'query' and 'type' (artist, release_group, recording) from request args.
    # 2. Make a query the MusicBrainz DB directly (probably using ILIKE, though that might be slow; there might be a
    # faster implementation that I'm not thinking of. Feel free to play around and figure out a better query!)
    # Returns: List of search results with MBIDs, Names, and Artist info.
    pass

@music_bp.route('/artist/<mbid>', methods=['GET'])
def get_artist(mbid):
    """
    Gets Artist details.
    """
    # Todo: Logic:
    # 1. Check if Artist exists in local 'Artist' table.
    # 2. If NO: Query MusicBrainz DB for artist details, insert into local 'Artist' table.
    # 3. Get generic info (Bio, Image URL, etc.) from MusicBrainz/Cover Art Archive.
    # 4. Fetch 'User_Follow' counts or local app ratings for this artist.
    # Returns: Artist metadata + App-specific stats.
    pass

@music_bp.route('/album/<mbid>', methods=['GET'])
def get_album(mbid):
    """
    Gets Album (Release Group) details and tracklist.
    """
    # Todo: Logic:
    # 1. Check if Album exists in local 'Album' table.
    # 2. If NO: Fetch from MB DB, insert into local 'Album' table.
    # 3. Fetch Tracklist: Query MB 'track' and 'recording' tables linked to this release.
    # 4. Fetch Cover Art: Use MBID to query Cover Art Archive API.
    # Returns: Album metadata, tracklist, and cover art URL.
    pass

@music_bp.route('/song/<mbid>', methods=['GET'])
def get_song(mbid):
    """
    Gets specific Song details and its reviews.
    """
    # Todo: Logic:
    # 1. Check local 'Song' table. Insert if missing (using MB data).
    # 2. Calculate average_rating from the 'Review' table.
    # 3. Fetch reviews associated with this song_id.
    # Returns: Song metadata, average rating, and list of reviews.
    pass