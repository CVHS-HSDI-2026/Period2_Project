import argparse
import os
import sys

try:
    import psycopg
except ImportError:
    print("Missing dependency: psycopg. Install with: pip install 'psycopg[binary]'\n", file=sys.stderr)
    raise


def main() -> int:
    p = argparse.ArgumentParser()
    p.add_argument("--host", default=os.getenv("MB_HOST", "10.1.10.242"))
    p.add_argument("--port", type=int, default=int(os.getenv("MB_PORT", "5432")))
    p.add_argument("--db", default=os.getenv("MB_DB", "musicbrainz_db"))
    p.add_argument("--user", default=os.getenv("MB_USER", "app_mb_ro"))
    p.add_argument("--password", default=os.getenv("MB_PASSWORD", "soundwaveadmin"))
    p.add_argument("--sslmode", default=os.getenv("MB_SSLMODE", "prefer"))
    args = p.parse_args()

    dsn = (
        f"host={args.host} port={args.port} dbname={args.db} "
        f"user={args.user} password={args.password} sslmode={args.sslmode}"
    )

    print(f"Connecting to: host={args.host} port={args.port} db={args.db} user={args.user} sslmode={args.sslmode}")

    with psycopg.connect(dsn) as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT current_user, current_database(), version();")
            user, db, version = cur.fetchone()
            print(f"Connected as: {user} to db: {db}")
            print(f"Server: {version.splitlines()[0]}")

            cur.execute("SELECT COUNT(*) FROM musicbrainz.artist;")
            (artist_count,) = cur.fetchone()
            print(f"musicbrainz.artist count = {artist_count:,}")

            try:
                cur.execute("SELECT COUNT(*) FROM cover_art_archive.cover_art;")
                (caa_count,) = cur.fetchone()
                print(f"cover_art_archive.cover_art count = {caa_count:,}")
            except Exception as e:
                print(f"(Optional) cover_art_archive.cover_art count failed: {e.__class__.__name__}: {e}")

    print("OK")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
