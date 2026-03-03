from flask import Flask, request, jsonify, g
from flask_cors import CORS
from auth import require_auth, require_role # Importiamo il nuovo decoratore

app = Flask(__name__)
# CORS più permissivo per gestire i vari metodi
CORS(app, resources={r"/*": {"origins": "*"}}, methods=["GET", "POST", "DELETE", "OPTIONS"])

# Lista condivisa tra tutti gli utenti
# Ora ogni elemento è un oggetto: {"id": 1, "nome": "Pane"}
shopping_list: list = []
counter: int = 1

@app.route("/items", methods=["GET"])
@require_auth
def get_items():
    # Tutti gli utenti autenticati (sia user che user_plus) possono vedere la lista
    return jsonify({"items": shopping_list})

@app.route("/items", methods=["POST"])
@require_auth
@require_role("user_plus")  # SOLO chi ha user_plus può aggiungere
def add_item():
    global counter
    data = request.get_json()
    item_name = data.get("item", "").strip()
    
    if not item_name:
        return jsonify({"error": "Item non può essere vuoto"}), 400

    nuovo = {"id": counter, "nome": item_name}
    shopping_list.append(nuovo)
    counter += 1

    return jsonify({"message": "Aggiunto", "items": shopping_list}), 201

@app.route("/items/<int:item_id>", methods=["DELETE"])
@require_auth
@require_role("user_plus")  # SOLO chi ha user_plus può eliminare
def delete_item(item_id):
    global shopping_list
    # Cerchiamo l'elemento per ID e lo rimuoviamo
    original_len = len(shopping_list)
    shopping_list = [item for item in shopping_list if item["id"] != item_id]
    
    if len(shopping_list) < original_len:
        return '', 204 # Successo senza contenuto

    return jsonify({"error": "Elemento non trovato"}), 404

if __name__ == "__main__":
    app.run(port=5000, debug=True)