import os
import sys

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

    def search(self, query: str, search_type: str) -> list[dict]:
        """
        A basic ILIKE search. Note: if this is too slow, we may want to switch to using the MB Solr container
        """
        search_term = f"%{query}%"
        if search_type == 'artist':
            self.cursor.execute("""
                SELECT gid AS mbid, name, type.name AS artist_type 
                FROM artist 
                LEFT JOIN artist_type type ON artist.type = type.id
                WHERE artist.name ILIKE %s LIMIT 20
            """, (search_term,))
            self.cursor.execute("""
                SELECT gid AS mbid, name AS title 
                FROM release_group 
                WHERE name ILIKE %s LIMIT 20
            """, (search_term,))
        elif search_type == 'song':
            self.cursor.execute("""
                SELECT gid AS mbid, name AS title, length AS duration 
                FROM recording 
                WHERE name ILIKE %s LIMIT 20
            """, (search_term,))
        else:
            return []

        return [dict(row) for row in self.cursor.fetchall()]

    def get_artist_by_mbid(self, mbid: str) -> dict | None:
        self.cursor.execute("""
            SELECT gid AS mbid, name, begin_date_year, end_date_year, comment AS disambiguation
            FROM artist WHERE gid = %s
        """, (mbid,))
        row = self.cursor.fetchone()
        return dict(row) if row else None

    def get_album_by_mbid(self, mbid: str) -> dict | None:
        self.cursor.execute("""
            SELECT rg.gid AS mbid, rg.name AS title, a.gid AS artist_mbid 
            FROM release_group rg
            JOIN artist_credit ac ON rg.artist_credit = ac.id
            JOIN artist_credit_name acn ON ac.id = acn.artist_credit
            JOIN artist a ON acn.artist = a.id
            WHERE rg.gid = %s
        """, (mbid,))
        row = self.cursor.fetchone()
        return dict(row) if row else None

    def get_song_by_mbid(self, mbid: str) -> dict | None:
        self.cursor.execute("""
            SELECT r.gid AS mbid, r.name AS title, r.length AS duration, a.gid AS artist_mbid
            FROM recording r
            JOIN artist_credit ac ON r.artist_credit = ac.id
            JOIN artist_credit_name acn ON ac.id = acn.artist_credit
            JOIN artist a ON acn.artist = a.id
            WHERE r.gid = %s
        """, (mbid,))
        row = self.cursor.fetchone()
        return dict(row) if row else None

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
