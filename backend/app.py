from flask import Flask, request, jsonify
from flask_cors import CORS
from initiateLangchainRAG import initiateLangchainRAG

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})


@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    query = data.get("query")
    response = initiateLangchainRAG(query)
    return jsonify({"status": True, "response": response})


@app.route("/", methods=["GET"])
def telemetry():
    return jsonify({"status": True, "message": "server live"})


if __name__ == "__main__":
    app.run(port=8000)
