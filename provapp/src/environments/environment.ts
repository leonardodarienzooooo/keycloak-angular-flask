export const environment = {
  production: false,
  keycloak: {
    // IMPORTANTE: Metti l'URL della tua porta 8080 SENZA lo slash finale /
    url: 'https://musical-space-rotary-phone-r7w4v9656pvcp4qp-8080.app.github.dev/', 
    realm: 'prova',
    clientId: 'provapp',
    redirectUri: window.location.origin,
  }
};