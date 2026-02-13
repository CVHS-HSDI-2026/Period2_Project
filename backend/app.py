from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

from routes.auth import auth_bp
from routes.users import users_bp
from routes.music import music_bp
from routes.reviews import reviews_bp

from database import Database

load_dotenv()

app = Flask(__name__)
CORS(app)

db = Database()

app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(users_bp, url_prefix='/api/users')
app.register_blueprint(music_bp, url_prefix='/api/music')
app.register_blueprint(reviews_bp, url_prefix='/api/reviews')

@app.route('/health')
def health_check():
    db_true = db.ping()
    if db_true:
        return jsonify({"status": "healthy", "db_connected": True}), 200
    else:
        return jsonify({"status": "dead", "db_connected": False}), 500


if __name__ == '__main__':
    app.run(debug=True, port=5000)