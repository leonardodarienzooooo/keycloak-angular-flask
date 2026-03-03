from flask import request, jsonify, g
from functools import wraps
import jwt
import requests

# CONFIGURAZIONE - Sostituisci con il tuo URL reale della porta 8080
KEYCLOAK_URL = "https://musical-space-rotary-phone-r7w4v9656pvcp4qp-8080.app.github.dev/"
REALM        = "prova"
CLIENT_ID    = "provapp"
JWKS_URL     = f"{KEYCLOAK_URL}/realms/{REALM}/protocol/openid-connect/certs"

def get_keycloak_public_key(token: str):
    unverified_header = jwt.get_unverified_header(token)
    kid = unverified_header.get("kid")
    
    response = requests.get(JWKS_URL)
    jwks = response.json()

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
            payload = jwt.decode(
                token,
                public_key,
                algorithms=["RS256"],
                audience=CLIENT_ID,
                options={"verify_exp": True},
            )
            # Salviamo l'utente in g.user per i decoratori successivi
            g.user = payload

        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token scaduto"}), 401
        except jwt.InvalidTokenError as e:
            return jsonify({"error": f"Token non valido: {str(e)}"}), 401
        except Exception as e:
            return jsonify({"error": str(e)}), 401

        return f(*args, **kwargs)
    return decorated

def get_roles(payload: dict) -> list:
    # Estrae la lista dei ruoli dal token
    return payload.get("realm_access", {}).get("roles", [])

def require_role(role: str):
    def decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            # Controlliamo se il ruolo richiesto è tra i ruoli dell'utente
            if role not in get_roles(g.user):
                return jsonify({"error": "Permesso negato: ruolo mancante"}), 403
            return f(*args, **kwargs)
        return wrapper
    return decorator