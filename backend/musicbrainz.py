import os
import sys
import uuid

import psycopg2
import psycopg2.extras
from dotenv import load_dotenv

load_dotenv()


class MusicBrainzDatabase:
    def __init__(self):
        """
        Initialize the PostgreSQL client and connect to the database.

        :raises ConnectionError: If unable to connect to PostgreSQL.
        """

        self.connection = psycopg2.connect(os.getenv("MUSICBRAINZ_POSTGRES_CONNECTION_STRING"))
        self.connection.autocommit = True
        self.cursor = self.connection.cursor(cursor_factory=psycopg2.extras.DictCursor)

        self.cursor.execute("SET search_path TO musicbrainz, public;")

    def ping(self) -> bool:
        """
        Ping the PostgreSQL server to check if the connection is alive.

        :return: True if the server responds to the ping command, False otherwise.
        :rtype: bool
        """
        try:
            self.cursor.execute("SELECT 1")
            return True
        except Exception as e:
            print(f"MusicBrainz DB ping failed: {e}")
            raise ConnectionError("Failed to connect to MusicBrainz")

    def search(self, query: str, search_type: str = 'all') -> dict | list:
        search_term = f"%{query}%"

        def search_artists():
            self.cursor.execute("""
                SELECT artist.gid AS mbid, artist.name, type.name AS artist_type 
                FROM artist 
                LEFT JOIN artist_type type ON artist.type = type.id
                WHERE artist.name ILIKE %s LIMIT 10
            """, (search_term,))
            return [dict(row) for row in self.cursor.fetchall()]

        def search_albums():
            self.cursor.execute("""
                SELECT 
                    gid AS mbid, 
                    name AS title,
                    'https://coverartarchive.org/release-group/' || gid || '/front-250' as cover_url
                FROM release_group 
                WHERE name ILIKE %s LIMIT 10
            """, (search_term,))
            return [dict(row) for row in self.cursor.fetchall()]

        def search_songs():
            self.cursor.execute("""
                SELECT 
                    r.gid AS mbid, 
                    r.name AS title, 
                    r.length AS duration,
                    (
                        SELECT 'https://coverartarchive.org/release-group/' || rg.gid || '/front-250'
                        FROM track t
                        JOIN medium m ON t.medium = m.id
                        JOIN release rel ON m.release = rel.id
                        JOIN release_group rg ON rel.release_group = rg.id
                        WHERE t.recording = r.id
                        LIMIT 1
                    ) as cover_url
                FROM recording r
                WHERE r.name ILIKE %s LIMIT 10
            """, (search_term,))
            return [dict(row) for row in self.cursor.fetchall()]

        if search_type == 'all':
            return {
                "artists": search_artists(),
                "albums": search_albums(),
                "songs": search_songs()
            }

        elif search_type == 'artist':
            return search_artists()
        elif search_type == 'album':
            return search_albums()
        elif search_type == 'song':
            return search_songs()
        else:
            return []

    def get_artist_by_mbid(self, mbid: str) -> dict | None:
        try:
            uuid.UUID(str(mbid))
        except ValueError:
            return None

        self.cursor.execute("""
            SELECT gid AS mbid, name, begin_date_year, end_date_year, comment AS disambiguation
            FROM artist WHERE gid = %s
        """, (str(mbid),))
        row = self.cursor.fetchone()
        return dict(row) if row else None

    def get_album_by_mbid(self, mbid: str) -> dict | None:
        try:
            uuid.UUID(str(mbid))
        except ValueError:
            return None

        self.cursor.execute("""
            SELECT 
                rg.gid AS mbid, 
                rg.name AS title, 
                a.gid AS artist_mbid,
                rgm.first_release_date_year AS release_year
            FROM release_group rg
            JOIN artist_credit ac ON rg.artist_credit = ac.id
            JOIN artist_credit_name acn ON ac.id = acn.artist_credit
            JOIN artist a ON acn.artist = a.id
            LEFT JOIN release_group_meta rgm ON rg.id = rgm.id
            WHERE rg.gid = %s
        """, (str(mbid),))
        row = self.cursor.fetchone()
        return dict(row) if row else None

    def get_song_by_mbid(self, mbid: str) -> dict | None:
        try:
            uuid.UUID(str(mbid))
        except ValueError:
            return None

        self.cursor.execute("""
            SELECT r.gid AS mbid, r.name AS title, r.length AS duration, a.gid AS artist_mbid
            FROM recording r
            JOIN artist_credit ac ON r.artist_credit = ac.id
            JOIN artist_credit_name acn ON ac.id = acn.artist_credit
            JOIN artist a ON acn.artist = a.id
            WHERE r.gid = %s
        """, (str(mbid),))
        row = self.cursor.fetchone()
        return dict(row) if row else None

    def get_artist_tags(self, mbid: str) -> list[str]:
        """
        aka return genres for artist
        """
        try:
            uuid.UUID(str(mbid))
        except ValueError:
            return []

        self.cursor.execute("""
            SELECT t.name
            FROM artist a
            JOIN artist_tag at ON a.id = at.artist
            JOIN tag t ON at.tag = t.id
            WHERE a.gid = %s
            ORDER BY at.count DESC
            LIMIT 5
        """, (str(mbid),))

        return [row['name'] for row in self.cursor.fetchall()]

    def close(self):
        """
        Close the database connection.
        """
        self.cursor.close()
        self.connection.close()


if __name__ == "__main__":
    db = MusicBrainzDatabase()
    if db.ping():
        print("DB connection successful.")
    else:
        print("DB connection failed.")
        sys.exit(1)
    db.close()
