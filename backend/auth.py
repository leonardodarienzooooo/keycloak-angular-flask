from flask import request, jsonify, g
from functools import wraps
import jwt
import requests

# CONFIGURAZIONE - Inserisci i tuoi dati
KEYCLOAK_URL = "https://musical-space-rotary-phone-r7w4v9656pvcp4qp-8080.app.github.dev/" # URL della porta 8080 senza /
REALM = "prova"
CLIENT_ID = "provapp"
JWKS_URL = f"{KEYCLOAK_URL}/realms/{REALM}/protocol/openid-connect/certs"

def get_keycloak_public_key(token):
    # 1) Legge l'header per trovare il 'kid' (Key ID)
    unverified_header = jwt.get_unverified_header(token)
    kid = unverified_header.get("kid")

    # 2) Scarica le chiavi pubbliche da Keycloak
    response = requests.get(JWKS_URL)
    jwks = response.json()

    # 3) Trova la chiave corretta
    for key_data in jwks["keys"]:
        if key_data["kid"] == kid:
            return jwt.algorithms.RSAAlgorithm.from_jwk(key_data)
    raise Exception("Chiave pubblica non trovata")

def require_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get("Authorization", "")
        
        if not auth_header.startswith("Bearer "):
            return jsonify({"error": "Token mancante"}), 401
        
        token = auth_header.split(" ")[1]
        
        try:
            public_key = get_keycloak_public_key(token)
            # Verifica e decodifica il token
            payload = jwt.decode(
                token,
                public_key,
                algorithms=["RS256"],
                audience=CLIENT_ID,
                options={"verify_exp": True}
            )
            # Salva l'utente per usarlo nelle route
            g.user = payload
        except Exception as e:
            return jsonify({"error": f"Token non valido: {str(e)}"}), 401
            
        return f(*args, **kwargs)
    return decorated