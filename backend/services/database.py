import psycopg2
from dotenv import load_dotenv
import datetime
import bcrypt
import sys
import os

load_dotenv()

# Im choosing to document everything in this file for clarity :D
class Database:
    def __init__(self):
        """
        Initialize the PostgreSQL client and connect to the database.
        
        :raises ConnectionError: If unable to connect to PostgreSQL.
        """

        self.connection = psycopg2.connect(os.getenv("POSTGRE_CONNECTION_STRING"))
        self.cursor = self.connection.cursor()

    def ping(self) -> bool:
        """
        Ping the MongoDB server to check if the connection is alive.
        
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
    def create_user(self, user_data: dict) -> str:
        """
        Create a user in the database.
        
        :param user_data: User data dict. For example:
            {
                "username": "string",
                "email": "string",
                "password_hash": "string",
                "music_data": {
                    "reviews": [review_1, review_2, ...],
                    "playlists": [playlist_1, playlist_2, ...]
                },
                "date_created": "datetime"
            }
        :type user_data: dict
        :raises ValueError: If username or email already exists.
        :return: The id of the created user.
        :rtype: str
        """
        self.cursor.execute("SELECT id FROM users WHERE username = %s OR email = %s", (user_data["username"], user_data["email"]))
        existing_user = self.cursor.fetchone()
        if existing_user:
            raise ValueError("Username or email already exists.")
        
        self.cursor.execute(
            "INSERT INTO users (username, email, password_hash, music_data, date_created) VALUES (%s, %s, %s, %s, %s) RETURNING id",
            (
                user_data["username"],
                user_data["email"],
                user_data["password_hash"],
                str(user_data["music_data"]),
                user_data["date_created"]
            )
        )
        return self.cursor.fetchone()[0] # Tuple
    
    def delete_user(self, username: str) -> bool:
        """
        Delete a user from the database.
        
        :param username: The username of the user to delete.
        :type username: str
        :return: True if the user was deleted, False otherwise.
        :rtype: bool
        """
        users = self.database.get_collection("users")
        result = users.delete_one({"username": username})
        return result.deleted_count > 0 # Return True if a document was deleted

    def get_user(self, username: str, filter: list[str]) -> dict:
        """
        Get a user from the database.
        
        :param username: The username of the user to get.
        :type username: str
        :param filter: List of fields to exclude in the result. Password hash is automatically removed.
        :type filter: list[str]
        :return: The user data dict if found, None otherwise.
        :rtype: dict
        """
        users = self.database.get_collection("users")
        user = users.find_one({"username": username})
        del user["password_hash"]
        for field in filter:
            if field in user:
                del user[field]
        return user
    



# Testing
if __name__ == "__main__":
    mongo = MongoDB(os.getenv("MONGO_DB_URI"))
    if mongo.ping():
        print("MongoDB connection successful.")
    else:
        print("MongoDB connection failed.")
        sys.exit(1)

    password = 'password123'
    password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    user_data = {
        "username": "testuser",
        "email": "testuserlol@test.com",
        "password_hash": password_hash,
        "music_data": {
            "reviews": [],
            "playlists": []
        },
        "date_created": datetime.datetime.now()
    }

    try:
        user_id = mongo.create_user(user_data)
        print(f"User created with id: {user_id}")
    except ValueError as e:
        print(f"Error creating user: {e}")
    
    print("Getting user")
    user = mongo.get_user("testuser", filter=["music_data"])
    print(user)
    user = mongo.get_user("testuser", filter=[])
    print(user)
    user = mongo.get_user("testuser", filter=["email","username"])
    print(user)
    user_input = input("Press Enter to delete the test user... Type n to skip")
    if user_input.lower() != 'n':
        if mongo.delete_user("testuser"):
            print("Test user deleted.")
        else:
            print("Failed to delete test user.")