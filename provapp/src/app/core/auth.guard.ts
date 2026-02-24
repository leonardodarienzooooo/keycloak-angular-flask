import { inject } from '@angular/core';
import { CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import Keycloak from 'keycloak-js';

export const authGuard: CanActivateFn = (
  _route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const keycloak = inject(Keycloak);

  if (keycloak.authenticated) {
    return true;
  }

  // Se non è autenticato, lo manda al login
  keycloak.login({
    redirectUri: window.location.origin + state.url,
  });
  return false;
};