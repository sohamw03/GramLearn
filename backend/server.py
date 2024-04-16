from flask import Flask, request, jsonify

app = Flask(__name__)


@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    query = data.get("query")
    response = initiateLangchainRAG(query)
    return jsonify({"output": response})


if __name__ == "__main__":
    app.run(port=8000)
