from flask import Flask, request, jsonify
from dotenv import load_dotenv
from flask_cors import CORS
from initiateLangchainRAG import initiateLangchainRAG
load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})


@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    query = data.get("query")
    history = data.get("history")
    generate = initiateLangchainRAG(query, history)
    return generate, {"Content-Type": "text/plain"}


@app.route("/", methods=["GET"])
def telemetry():
    return jsonify({"status": True, "message": "server live"})


if __name__ == "__main__":
    import os
    app.run(port=os.environ.get("PORT", 8000))
