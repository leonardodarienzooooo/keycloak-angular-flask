from flask import Flask, request, jsonify, g
from flask_cors import CORS
from auth import require_auth, require_role

app = Flask(__name__)
# Abilitiamo CORS per tutti i metodi necessari
CORS(app, resources={r"/*": {"origins": "*"}}, methods=["GET", "POST", "DELETE", "OPTIONS"])

# Lista condivisa (formato oggetti con ID)
shopping_list: list = []
counter: int = 1

@app.route("/items", methods=["GET"])
@require_auth
def get_items():
    # Tutti gli utenti loggati possono vedere la lista
    return jsonify({"items": shopping_list})

@app.route("/items", methods=["POST"])
@require_auth
@require_role("user_plus")  # Solo utente con ruolo user_plus
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
@require_role("user_plus")  # Solo utente con ruolo user_plus
def delete_item(item_id):
    global shopping_list
    original_len = len(shopping_list)
    # Filtriamo la lista eliminando l'ID corrispondente
    shopping_list = [item for item in shopping_list if item["id"] != item_id]
    
    if len(shopping_list) < original_len:
        return '', 204

    return jsonify({"error": "Elemento non trovato"}), 404

if __name__ == "__main__":
    # Avviamo Flask sulla porta 5000
    app.run(port=5000, debug=True)