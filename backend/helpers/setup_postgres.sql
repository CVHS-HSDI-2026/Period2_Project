-- RUN THIS FILE ONLY ONCE TO SET UP POSTGRESQL DATABASE
-- MAKE SURE `soundwave` DATABASE IS CREATED BEFORE RUNNING THIS SCRIPT

CREATE TABLE IF NOT EXISTS Users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    bio TEXT,
    profile_pic_url TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS User_Follow (
    follower_id INT NOT NULL REFERENCES Users(id),
    followed_id INT NOT NULL REFERENCES Users(id),
    followed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS User_Favorite_Song (
    user_id INT NOT NULL REFERENCES Users(id),
    song_id INT NOT NULL REFERENCES Song(id),
    rank SMALLINT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS Song (
    id SERIAL PRIMARY KEY,
    mbid UUID NOT NULL UNIQUE,
    title VARCHAR(200) NOT NULL,
    artist_id INT FK REFERENCES Artist(id),
    album_id INT FK REFERENCES Album(id),
    duration INT,
    average_rating DECIMAL(3,2),
    track_number INT
);

CREATE TABLE IF NOT EXISTS Album (
    id SERIAL PRIMARY KEY,
    mbid UUID NOT NULL UNIQUE,
    title VARCHAR(200) NOT NULL,
    artist_id INT FK REFERENCES Artist(id),
    release_mbid UUID,
    release_date DATE,
    average_rating DECIMAL(3,2),
    cover_art_id INT FK REFERENCES Cover_Art(id),
);

CREATE TABLE IF NOT EXISTS Artist (
    id SERIAL PRIMARY KEY,
    mbid UUID NOT NULL UNIQUE,
    name VARCHAR(200) NOT NULL,
    type VARCHAR(50),
    profile_pic_url TEXT,
    gender VARCHAR(50),
    country VARCHAR(50),
    born DATE,
    died DATE,
    disambiguation VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS Review (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL FK REFERENCES Users(id),
    song_id INT NOT NULL FK REFERENCES Song(id),
    album_id INT FK REFERENCES Album(id),
    rating SMALLINT NOT NULL,
    review_text TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Reply (
    id SERIAL PRIMARY KEY,
    review_id INT NOT NULL FK REFERENCES Review(id),
    user_id INT NOT NULL FK REFERENCES Users(id),
    content TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);