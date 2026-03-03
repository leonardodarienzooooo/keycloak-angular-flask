export const environment = {
  production: false,
  keycloak: {
    url: 'https://musical-space-rotary-phone-r7w4v9656pvcp4qp-8080.app.github.dev', 
    realm: 'prova',
    clientId: 'provapp', // <--- DEVE ESSERE IDENTICO A QUELLO SU KEYCLOAK
    redirectUri: window.location.origin,
  }
};