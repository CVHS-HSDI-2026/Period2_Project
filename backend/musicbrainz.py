import os
import sys
import uuid

import requests
import psycopg2
import psycopg2.extras
import xml.etree.ElementTree as ET
from dotenv import load_dotenv

load_dotenv()


class MusicBrainzDatabase:
    def __init__(self):
        """
        Initialize the PostgreSQL client and connect to the database.
        """
        self.connection = psycopg2.connect(os.getenv("MUSICBRAINZ_POSTGRES_CONNECTION_STRING"))
        self.connection.autocommit = True
        self.cursor = self.connection.cursor(cursor_factory=psycopg2.extras.DictCursor)
        self.cursor.execute("SET search_path TO musicbrainz, public;")

    def ping(self) -> bool:
        try:
            self.cursor.execute("SELECT 1")
            return True
        except Exception as e:
            print(f"MusicBrainz DB ping failed: {e}")
            raise ConnectionError("Failed to connect to MusicBrainz")

    def search(self, query: str, search_type: str = 'all', limit: int = 10) -> dict | list:
        if not query:
            return {"artists": [], "albums": [], "songs": []} if search_type == 'all' else []

        exact_match = query
        starts_with_match = f"{query}%"
        fuzzy_match = f"%{query}%"
        SOLR_BASE_URL = os.getenv("SOLR_URL", "http://10.1.10.236:8983/solr")

        def parse_solr_xml(xml_string, ns):
            root = ET.fromstring(xml_string)
            return {
                "mbid": root.attrib.get('id'),
                "type": root.attrib.get('type'),
                "name": root.find(f".//ns0:{ns}",
                                  namespaces={"ns0": "http://musicbrainz.org/ns/mmd-2.0#"}).text if root.find(
                    f".//ns0:{ns}", namespaces={"ns0": "http://musicbrainz.org/ns/mmd-2.0#"}) is not None else "Unknown"
            }

        def search_artists():
            try:
                res = requests.get(f"{SOLR_BASE_URL}/artist/select", params={"q": query, "rows": limit, "wt": "json"})
                docs = res.json().get("response", {}).get("docs", [])

                results = []
                for doc in docs:
                    store_xml = doc.get("_store")
                    if store_xml:
                        parsed = parse_solr_xml(store_xml, "name")
                        results.append({
                            "mbid": parsed.get("mbid"),
                            "name": parsed.get("name"),
                            "artist_type": parsed.get("type", "Artist")
                        })
                return results
            except Exception as e:
                print(f"Solr artist search failed: {e}")
                return []

        def search_albums():
            try:
                res = requests.get(f"{SOLR_BASE_URL}/release-group/select",
                                   params={"q": query, "rows": limit, "wt": "json"})
                docs = res.json().get("response", {}).get("docs", [])

                results = []
                for doc in docs:
                    store_xml = doc.get("_store")
                    if store_xml:
                        root = ET.fromstring(store_xml)
                        ns = {"ns0": "http://musicbrainz.org/ns/mmd-2.0#"}

                        mbid = root.attrib.get('id')
                        title = root.find(".//ns0:title", namespaces=ns)
                        artist = root.find(".//ns0:artist-credit/ns0:name-credit/ns0:artist/ns0:name", namespaces=ns)

                        results.append({
                            "mbid": mbid,
                            "title": title.text if title is not None else "Unknown Album",
                            "artist_name": artist.text if artist is not None else "Unknown Artist",
                            "cover_url": f"https://coverartarchive.org/release-group/{mbid}/front-250"
                        })
                return results
            except Exception as e:
                print(f"Solr album search failed: {e}")
                return []

        def search_songs():
            try:
                res = requests.get(f"{SOLR_BASE_URL}/recording/select",
                                   params={"q": query, "rows": limit, "wt": "json"})
                docs = res.json().get("response", {}).get("docs", [])

                results = []
                for doc in docs:
                    store_xml = doc.get("_store")
                    if store_xml:
                        root = ET.fromstring(store_xml)
                        ns = {"ns0": "http://musicbrainz.org/ns/mmd-2.0#"}

                        mbid = root.attrib.get('id')
                        title = root.find(".//ns0:title", namespaces=ns)
                        artist = root.find(".//ns0:artist-credit/ns0:name-credit/ns0:artist/ns0:name", namespaces=ns)
                        length = root.find(".//ns0:length", namespaces=ns)

                        results.append({
                            "mbid": mbid,
                            "title": title.text if title is not None else "Unknown Song",
                            "duration": int(length.text) if length is not None and length.text else None,
                            "artist_name": artist.text if artist is not None else "Unknown Artist",
                            "cover_url": None
                        })
                return results
            except Exception as e:
                print(f"Solr song search failed: {e}")
                return []

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

        with self.connection.cursor(cursor_factory=psycopg2.extras.DictCursor) as cursor:
            cursor.execute("""
                SELECT gid AS mbid, name, begin_date_year, end_date_year, comment AS disambiguation
                FROM artist WHERE gid = %s
            """, (str(mbid),))
            row = cursor.fetchone()
            return dict(row) if row else None

    def get_artist_discography(self, mbid: str) -> dict | None:
        try:
            uuid.UUID(str(mbid))
        except ValueError:
            return None

        with self.connection.cursor(cursor_factory=psycopg2.extras.DictCursor) as cursor:
            cursor.execute("""
                SELECT gid AS mbid, name, begin_date_year, end_date_year, comment AS disambiguation
                FROM artist WHERE gid = %s
            """, (str(mbid),))

            artist_row = cursor.fetchone()
            if not artist_row:
                return None

            artist_data = dict(artist_row)

            cursor.execute("""
                SELECT 
                    rg.gid AS mbid, 
                    rg.name AS title,
                    rgm.first_release_date_year AS release_year,
                    'https://coverartarchive.org/release-group/' || rg.gid || '/front-250' as cover_url
                FROM release_group rg
                JOIN artist_credit ac ON rg.artist_credit = ac.id
                JOIN artist_credit_name acn ON ac.id = acn.artist_credit
                JOIN artist a ON acn.artist = a.id
                LEFT JOIN release_group_meta rgm ON rg.id = rgm.id
                WHERE a.gid = %s AND rg.type = 1
                ORDER BY rgm.first_release_date_year DESC NULLS LAST
                LIMIT 10
            """, (str(mbid),))

            artist_data['albums'] = [dict(row) for row in cursor.fetchall()]
            return artist_data

    def get_album_by_mbid(self, mbid: str) -> dict | None:
        try:
            uuid.UUID(str(mbid))
        except ValueError:
            return None

        with self.connection.cursor(cursor_factory=psycopg2.extras.DictCursor) as cursor:
            cursor.execute("""
                SELECT 
                    rg.gid AS mbid, 
                    rg.name AS title, 
                    a.gid AS artist_mbid,
                    a.name AS artist_name,
                    rgm.first_release_date_year AS release_year,
                    'https://coverartarchive.org/release-group/' || rg.gid || '/front-250' as cover_url
                FROM release_group rg
                JOIN artist_credit ac ON rg.artist_credit = ac.id
                JOIN artist_credit_name acn ON ac.id = acn.artist_credit
                JOIN artist a ON acn.artist = a.id
                LEFT JOIN release_group_meta rgm ON rg.id = rgm.id
                WHERE rg.gid = %s
            """, (str(mbid),))

            album_row = cursor.fetchone()
            if not album_row:
                return None

            album_data = dict(album_row)

            cursor.execute("""
                SELECT 
                    r.gid AS mbid, 
                    t.name AS title, 
                    t.number, 
                    t.length AS duration
                FROM release_group rg
                JOIN release rel ON rel.release_group = rg.id
                JOIN medium m ON m.release = rel.id
                JOIN track t ON t.medium = m.id
                JOIN recording r ON t.recording = r.id
                WHERE rg.gid = %s
                AND rel.id = (
                    SELECT id FROM release 
                    WHERE release_group = rg.id 
                    ORDER BY id ASC 
                    LIMIT 1
                )
                ORDER BY m.position ASC, t.position ASC
            """, (str(mbid),))

            album_data['tracks'] = [dict(row) for row in cursor.fetchall()]

            return album_data

    def get_song_by_mbid(self, mbid: str) -> dict | None:
        try:
            uuid.UUID(str(mbid))
        except ValueError:
            return None

        with self.connection.cursor(cursor_factory=psycopg2.extras.DictCursor) as cursor:
            cursor.execute("""
                SELECT 
                    r.gid AS mbid, 
                    r.name AS title, 
                    r.length AS duration, 
                    a.gid AS artist_mbid,
                    a.name AS artist_name,
                    rg.name AS album_title,
                    rg.gid AS album_mbid,
                    rgm.first_release_date_year AS release_year,
                    'https://coverartarchive.org/release-group/' || rg.gid || '/front-250' AS cover_url
                FROM recording r
                JOIN artist_credit ac ON r.artist_credit = ac.id
                JOIN artist_credit_name acn ON ac.id = acn.artist_credit
                JOIN artist a ON acn.artist = a.id
                LEFT JOIN track t ON t.recording = r.id
                LEFT JOIN medium m ON t.medium = m.id
                LEFT JOIN release rel ON m.release = rel.id
                LEFT JOIN release_group rg ON rel.release_group = rg.id
                LEFT JOIN release_group_meta rgm ON rg.id = rgm.id
                WHERE r.gid = %s
                ORDER BY rgm.first_release_date_year ASC NULLS LAST
                LIMIT 1
            """, (str(mbid),))
            row = cursor.fetchone()
            return dict(row) if row else None

    def get_song_tags(self, mbid: str) -> list[str]:
        try:
            uuid.UUID(str(mbid))
        except ValueError:
            return []

        with self.connection.cursor(cursor_factory=psycopg2.extras.DictCursor) as cursor:
            cursor.execute("""
                SELECT t.name
                FROM recording r
                JOIN recording_tag rt ON r.id = rt.recording
                JOIN tag t ON rt.tag = t.id
                WHERE r.gid = %s
                ORDER BY rt.count DESC
                LIMIT 3
            """, (str(mbid),))
            return [row['name'].title() for row in cursor.fetchall()]

    def get_artist_tags(self, mbid: str) -> list[str]:
        try:
            uuid.UUID(str(mbid))
        except ValueError:
            return []

        with self.connection.cursor(cursor_factory=psycopg2.extras.DictCursor) as cursor:
            cursor.execute("""
                SELECT t.name
                FROM artist a
                JOIN artist_tag at ON a.id = at.artist
                JOIN tag t ON at.tag = t.id
                WHERE a.gid = %s
                ORDER BY at.count DESC
                LIMIT 5
            """, (str(mbid),))
            return [row['name'] for row in cursor.fetchall()]

    def get_album_tags(self, mbid: str) -> list[str]:
        try:
            uuid.UUID(str(mbid))
        except ValueError:
            return []

        with self.connection.cursor(cursor_factory=psycopg2.extras.DictCursor) as cursor:
            cursor.execute("""
                SELECT t.name
                FROM release_group rg
                JOIN release_group_tag rgt ON rg.id = rgt.release_group
                JOIN tag t ON rgt.tag = t.id
                WHERE rg.gid = %s
                ORDER BY rgt.count DESC
                LIMIT 5
            """, (str(mbid),))
            return [row['name'].title() for row in cursor.fetchall()]

    def close(self):
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
