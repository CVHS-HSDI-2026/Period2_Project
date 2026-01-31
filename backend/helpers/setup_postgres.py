# RUN THIS FILE ONLY ONCE TO SET UP POSTGRESQL DATABASE
# MAKE SURE `soundwave` DATABASE IS CREATED BEFORE RUNNING THIS SCRIPT
import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()


connection = psycopg2.connect(os.getenv("POSTGRES_CONNECTION_STRING"))
cursor = connection.cursor()

# Create users table
cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        music_data TEXT DEFAULT '{}',
        date_created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
""")
connection.commit()