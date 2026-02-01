# RUN THIS FILE ONLY ONCE TO SET UP POSTGRESQL DATABASE
# MAKE SURE `soundwave` DATABASE IS CREATED BEFORE RUNNING THIS SCRIPT
import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()


connection = psycopg2.connect(os.getenv("POSTGRES_CONNECTION_STRING"))
cursor = connection.cursor()


print("Setting up users table...")
# Create users table
cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        rating TEXT,
        followers TEXT DEFAULT '[]',
        following TEXT DEFAULT '[]',
        ratings TEXT DEFAULT '[]',
        bio TEXT,
        top_songs TEXT DEFAULT '[]',
        top_albums TEXT DEFAULT '[]',
        top_artists TEXT DEFAULT '[]',
        activity_log TEXT DEFAULT '[]',
        date_created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
""")
connection.commit()

cursor.execute("SELECT table_name FROM information_schema.tables WHERE table_name = 'users';")
if cursor.fetchone():
    print("Users table check success")
else:
    print("ERROR: Table creation failed!        --------------------------------------")

# print("Creating postgresql musicbrainz database...")

connection.close()