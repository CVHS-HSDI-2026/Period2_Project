from flask import Flask

app = Flask(__name__)

@app.route("/")
def test_route():
    return {
        "message": "Hello world!"
    }

@app.route("/poopoo")
def poopoo_route():
    return {
        "message": "poopoo!"
    }

if __name__ == '__main__':
    app.run()