import { ApplicationConfig, provideAppInitializer } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import Keycloak from 'keycloak-js';
import { routes } from './app.routes';
import { environment } from '../environments/environment';

// Crea l'istanza di Keycloak
export const keycloak = new Keycloak({
  url: environment.keycloak.url,
  realm: environment.keycloak.realm,
  clientId: environment.keycloak.clientId,
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    // Registra il servizio Keycloak per iniettarlo dove serve
    { provide: Keycloak, useValue: keycloak },
    provideAppInitializer(async () => {
      await keycloak.init({
        onLoad: 'check-sso', // Controlla se l'utente è già loggato
        checkLoginIframe: false,
      });
    }),
  ],
};