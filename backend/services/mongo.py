from pymongo import MongoClient
from dotenv import load_dotenv
import datetime
import bcrypt
import sys
import os

load_dotenv()

# Im choosing to document everything in this file for clarity :D
class MongoDB:
    def __init__(self, connection_string: str):
        """
        Initialize the MongoDB client and connect to the database.
        
        :param connection_string: MongoDB connection string. Get it from .env
        :type connection_string: str
        :raises ConnectionError: If unable to connect to MongoDB.
        """
        self.connection_string = connection_string
        self.client = MongoClient(self.connection_string)
        if not self.ping():
            raise ConnectionError("Failed to connect to MongoDB")
        self.database = self.client.get_database(os.getenv("APP_NAME"))

    def ping(self) -> bool:
        """
        Ping the MongoDB server to check if the connection is alive.
        
        :return: True if the server responds to the ping command, False otherwise.
        :rtype: bool
        """
        try:
            self.client.admin.command('ping')
            return True
        except Exception as e:
            print(f"MongoDB ping failed: {e}")
            raise ConnectionError("Failed to connect to MongoDB")
    
   
    # High-level validation should be done before calling this method
    # Make sure to calculate hash of password before passing user_data
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
        users = self.database.get_collection("users")
        if users.find_one({"username": user_data["username"]}) or users.find_one({"email": user_data["email"]}):
            raise ValueError("Username/email already exists")
        result = users.insert_one(user_data)
        return result.inserted_id # Return the id of the created user
    
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
    
    user_input = input("Press Enter to delete the test user... Type n to skip")
    if user_input.lower() != 'n':
        if mongo.delete_user("testuser"):
            print("Test user deleted.")
        else:
            print("Failed to delete test user.")