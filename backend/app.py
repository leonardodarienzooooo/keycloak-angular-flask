from flask import Flask, request, jsonify, g
from flask_cors import CORS
from auth import require_auth

app = Flask(__name__)
# Sostituisci la vecchia riga CORS(app) con questa:
CORS(app, resources={r"/*": {"origins": "*"}}, methods=["GET", "POST", "DELETE", "OPTIONS"])

# Database temporaneo in memoria
shopping_lists = {}

@app.route("/items", methods=["GET"])
@require_auth
def get_items():
    username = g.user.get("preferred_username")
    items = shopping_lists.get(username, [])
    return jsonify({"items": items, "user": username})

@app.route("/items", methods=["POST"])
@require_auth
def add_item():
    username = g.user.get("preferred_username")
    data = request.get_json()
    item = data.get("item", "").strip()
    
    if not item:
        return jsonify({"error": "Item non può essere vuoto"}), 400
        
    if username not in shopping_lists:
        shopping_lists[username] = []
        
    shopping_lists[username].append(item)
    return jsonify({"message": "Aggiunto", "items": shopping_lists[username]}), 201

@app.route("/items/<int:index>", methods=["DELETE"])
@require_auth
def delete_item(index):
    username = g.user.get("preferred_username")
    
    if username in shopping_lists:
        # Controlliamo se l'indice esiste nella lista
        if 0 <= index < len(shopping_lists[username]):
            # Rimuoviamo l'elemento all'indice indicato
            shopping_lists[username].pop(index)
            return jsonify({"message": "Eliminato", "items": shopping_lists[username]}), 200
            
    return jsonify({"error": "Elemento non trovato"}), 404

if __name__ == "__main__":
    app.run(port=5000, debug=True)