from typing import Any

import psycopg2
from dotenv import load_dotenv
import datetime
import bcrypt
import sys
import os

load_dotenv()

# Todo: We should make a separate database class for the MusicBrainz DB to prevent confusion about which DB we're
#  calling in the code.

# Im choosing to document everything in this file for clarity :D
class Database:
    def __init__(self):
        """
        Initialize the PostgreSQL client and connect to the database.
        
        :raises ConnectionError: If unable to connect to PostgreSQL.
        """

        self.connection = psycopg2.connect(os.getenv("USER_POSTGRES_CONNECTION_STRING"))
        self.connection.autocommit = True
        self.cursor = self.connection.cursor(cursor_factory=psycopg2.extras.DictCursor)

    def ping(self) -> bool:
        """
        Ping the PostgreSQL server to check if the connection is alive.
        
        :return: True if the server responds to the ping command, False otherwise.
        :rtype: bool
        """
        try:
            self.connection.cursor().execute("SELECT 1")
            return True
        except Exception as e:
            print(f"PostgreSQL ping failed: {e}")
            raise ConnectionError("Failed to connect to PostgreSQL")
    
   
    # High-level validation should be done before calling this method
    # Make sure to calculate hash of password before passing user_data
    # Music data should be empty
    def create_user(self, user_data: dict) -> int:
        """
        Create a user in the database.
        
        :param user_data: User data dict. For example:
            {
                "username": "string",
                "email": "string",
                "password_hash": "string",
                "bio": "string",
                "profile_pic_url": "string"
            }
        :type user_data: dict
        :raises ValueError: If username or email already exists.
        :return: The id of the created user.
        :rtype: int
        """
        self.cursor.execute("SELECT id FROM users WHERE username = %s OR email = %s", (user_data["username"], user_data["email"]))
        existing_user = self.cursor.fetchone()
        if existing_user:
            raise ValueError("Username or email already exists.")
        
        self.cursor.execute(
            "INSERT INTO users (username, email, password_hash, bio, profile_pic_url) VALUES (%s, %s, %s, %s, %s) RETURNING id",
            (
                user_data["username"],
                user_data["email"],
                user_data["password_hash"],
                user_data.get("bio"),
                user_data.get("profile_pic_url")
            )
        )

        return self.cursor.fetchone()[0]
    
    def delete_user(self, username: str) -> bool:
        """
        Delete a user from the database.
        
        :param username: The username of the user to delete.
        :type username: str
        :return: True if the user was deleted, False otherwise.
        :rtype: bool
        """
        self.cursor.execute("DELETE FROM users WHERE username = %s", (username,))
        return self.cursor.rowcount > 0

    def get_user(self, username: str, filter: list[str] = None) -> dict[Any, Any] | None:
        """
        Get a user from the database.
        
        :param username: The username of the user to get.
        :type username: str
        :param filter: List of fields to exclude in the result. Password hash is automatically removed.
        :type filter: list[str]
        :return: The user data dict if found, None if not.
        :rtype: dict
        """
        self.cursor.execute("SELECT * FROM users WHERE username = %s", username)
        fetch_user = self.cursor.fetchone()
        if not fetch_user:
            return None
        user_dict = dict(zip([desc[0] for desc in self.cursor.description], fetch_user)) # for those who dont understand, this turns the data into a dictionary

        if filter:
            for field in filter:
                if field in user_dict:
                    del user_dict[field]
        return user_dict

    def get_user_activity(self, user_id: int) -> list[dict[str, Any]]:
        """
        Returns the user's most recent review and reply activity.

        :param user_id:
        :type user_id: int
        :return: The list of dictionaries describing the recent activity.
        :rtype: list
        """
        self.cursor.execute("SELECT * FROM Review WHERE user_id = %s ORDER BY created_at DESC", (user_id,))
        reviews = self.cursor.fetchmany(10)
        list_reviews = []

        for review in reviews:
            list_reviews.append(review)

        self.cursor.execute("SELECT * FROM Reply WHERE user_id = %s ORDER BY created_at DESC", (user_id,))
        replies = self.cursor.fetchmany(10)
        list_replies = []

        for reply in replies:
            list_replies.append(reply)



    def get_user_favorites(self, user_id: int) -> list[dict[str, Any]]:
        """
        Returns the favorite songs + the rank of the favorites for a given user.

        :param user_id:
        :type user_id: int
        :return: The list of dictionaries describing the favorite songs.
        :rtype: list
        """
        self.cursor.execute("SELECT * FROM User_Favorite_Song WHERE user_id = %s ORDER BY rank", (user_id,))
        favorites = self.cursor.fetchall()
        list_favorites = []

        for favorite in favorites:
            list_favorites.append(favorite)

        return list_favorites

    def get_followed_count(self, followed_user_id: int) -> int:
        self.cursor.execute("SELECT * FROM User_Follow WHERE followed_id = %s", followed_user_id)
        count_followed = self.cursor.rowcount()
        if not count_followed:
            return -1
        return count_followed

    def get_following_count(self, following_user_id: int) -> int:
        self.cursor.execute("SELECT * FROM User_Follow WHERE following_id = %s", following_user_id)
        count_following = self.cursor.rowcount()
        if not count_following:
            return -1
        return count_following

    def follow_user(self, follower_id: int, followed_id: int) -> bool:
        """
        Make one user follow another user.
        
        :param follower_id: The id of the follower (the person who is going to follow).
        :type follower_id: int
        :param followed_id: The id of the person who is going to be followed.
        :type followed_id: int
        :return: True if the operation was successful, False otherwise.
        :rtype: bool
        """
        try:
            self.cursor.execute(
                "INSERT INTO User_Follow (follower_id, followed_id) VALUES (%s, %s)",
                (follower_id, followed_id)
            )
            return True
        except Exception as e:
            print(f"Failed to follow user: {e}")
            return False
    
    def unfollow_user(self, follower_id: int, followed_id: int) -> bool:
        """
        Make one user unfollow another user.
        
        :param follower_id: The id of the follower (the person who is going to unfollow).
        :type follower_id: int
        :param followed_id: The id of the person who is going to be unfollowed.
        :type followed_id: int
        :return: True if the operation was successful, False otherwise.
        :rtype: bool
        """
        try:
            self.cursor.execute(
                "DELETE FROM User_Follow WHERE follower_id = %s AND followed_id = %s",
                (follower_id, followed_id)
            )
            return True
        except Exception as e:
            print(f"Failed to unfollow user: {e}")
            return False
        
    def favorite_song(self, user_id: int, song_id: int, rank: int) -> bool:
        """
        Add a song to the user's favorites.
        
        :param user_id: The id of the user.
        :type user_id: int
        :param song_id: The id of the song to favorite.
        :type song_id: int
        :param rank: The rank of the favorite song.
        :type rank: int
        :return: True if the operation was successful, False otherwise.
        :rtype: bool
        """
        try:
            self.cursor.execute(
                "INSERT INTO User_Favorite_Song (user_id, song_id, rank) VALUES (%s, %s, %s)",
                (user_id, song_id, rank)
            )
            return True
        except Exception as e:
            print(f"Failed to favorite song: {e}")
            return False
    
    def unfavorite_song(self, user_id: int, song_id: int) -> bool:
        """
        Remove a song from the user's favorites.
        
        :param user_id: The id of the user.
        :type user_id: int
        :param song_id: The id of the song to unfavorite.
        :type song_id: int
        :return: True if the operation was successful, False otherwise.
        :rtype: bool
        """
        try:
            self.cursor.execute(
                "DELETE FROM User_Favorite_Song WHERE user_id = %s AND song_id = %s",
                (user_id, song_id)
            )
            return True
        except Exception as e:
            print(f"Failed to unfavorite song: {e}")
            return False
        
    def create_review(self, user_id: int, song_id: int, album_id: int, rating: int, review_text: str) -> bool:
        """
        Create a review for a song or album.
        
        :param user_id: The id of the user creating the review.
        :type user_id: int
        :param song_id: The id of the song being reviewed.
        :type song_id: int
        :param album_id: The id of the album being reviewed (optional).
        :type album_id: int
        :param rating: The rating given by the user.
        :type rating: int
        :param review_text: The text of the review.
        :type review_text: str
        :return: True if it succeeded, False if not.
        :rtype: bool
        """
        try:
            self.cursor.execute(
                "INSERT INTO Review (user_id, song_id, album_id, rating, review_text) VALUES (%s, %s, %s, %s, %s)",
                (user_id, song_id, album_id, rating, review_text)
            )
            return True
        except Exception as e:
            print(f"Failed to create review: {e}")
            return False

    def fetch_review(self, user_id: int, review_id: int = None, song_id: int = None, album_id: int = None) -> dict:
        """
        Fetches a review for a song or album.

        Must pass either a song_id or album_id. If a song_id and album_id are passed, we assume you want the review for the song.

        :param review_id: The id of a given review.
        :type review_id: int
        :param user_id: The id of the user fetching the review.
        :type user_id: int
        :param song_id: The id of the song being fetched.
        :type song_id: int
        :param album_id: The id of the album being fetched.
        :type album_id: int
        :return:
        """
        if review_id:
            self.cursor.execute("SELECT * FROM Review WHERE review_id = %s", (review_id,))
            review = self.cursor.fetchone()
            if review:
                return review
        elif song_id:
            self.cursor.execute("SELECT * FROM Review WHERE user_id = %s AND WHERE song_id = %s", (user_id, song_id))
            review = self.cursor.fetchone()
            if review:
                return review
        elif album_id:
            self.cursor.execute("SELECT * FROM Review WHERE user_id = %s AND WHERE album_id = %s", (user_id, album_id))
            review = self.cursor.fetchone()
            if review:
                return review
        raise Exception(f"Invalid request. Missing any of these fields: review_id, song_id, album_id")

    def fetch_reviews(self, song_id: int = None, album_id: int = None) -> list[dict[str | Any]]:
        """
        Fetches all reviews for a song or album.

        :param song_id: The id of the song to fetch reviews for
        :type song_id: int
        :param album_id: The id of the album being fetched.
        :type album_id: int
        :return: list
        """
        if song_id:
            self.cursor.execute("SELECT * FROM Review WHERE song_id = %s", (song_id,))
            reviews = self.cursor.fetchall()
            if reviews:
                return reviews
        elif album_id:
            self.cursor.execute("SELECT * FROM Review WHERE album_id = %s", (album_id,))
            reviews = self.cursor.fetchall()
            if reviews:
                return reviews
        raise Exception("Failed to fetch reviews for song or album")

    def delete_review(self, review_id: int) -> bool:
        """
        Delete a review from the database.
        
        :param review_id: The id of the review to delete.
        :type review_id: int
        :return: True if the review was deleted, False if not.
        :rtype: bool
        """
        try:
            self.cursor.execute("DELETE FROM Review WHERE id = %s", (review_id,))
            return self.cursor.rowcount > 0
        except Exception as e:
            print(f"Failed to delete review: {e}")
            return False
        
    def reply(self, review_id: int, user_id: int, content: str) -> bool:
        """
        Reply to a review.
        
        :param review_id: The id of the review to reply to.
        :type review_id: int
        :param content: The text of the reply.
        :type content: str
        :return: True if the reply was added, False otherwise.
        :rtype: bool
        """
        try:
            self.cursor.execute(
                "INSERT INTO Reply (review_id, user_id, content) VALUES (%s, %s, %s)",
                (review_id, user_id, content)
            )
            return True
        except Exception as e:
            print(f"Failed to reply to review: {e}")
            return False
        
    def close(self):
        """
        Close the database connection.
        """
        self.cursor.close()
        self.connection.close()



# Testing
if __name__ == "__main__":
    db = Database()
    if db.ping():
        print("DB connection successful.")
    else:
        print("DB connection failed.")
        sys.exit(1)

    password = b'password123'
    password_hash = bcrypt.hashpw(password, bcrypt.gensalt(rounds=12))
    user_data = {
        "username": "testuser",
        "email": "testuserlol@test.com",
        "password_hash": password_hash,
        "bio": "",
        "profile_pic_url": "",
        "created_at": datetime.datetime.now(),
        "updated_at": datetime.datetime.now()
    }

    try:
        user_id = db.create_user(user_data)
        print(f"User created with id: {user_id}")
    except ValueError as e:
        print(f"Error creating user: {e}")
    
    print("Getting user")
    user = db.get_user("testuser", filter=[])
    print(user)
    user = db.get_user("testuser", filter=["email","username"])
    print(user)
    user_input = input("Press Enter to delete the test user... Type n to skip")
    if user_input.lower() != 'n':
        if db.delete_user("testuser"):
            print("Test user deleted.")
        else:
            print("Failed to delete test user.")
    db.close()
