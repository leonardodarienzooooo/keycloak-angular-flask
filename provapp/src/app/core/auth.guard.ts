import { inject } from '@angular/core';
import { CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import Keycloak from 'keycloak-js';
import { AuthService } from './auth.service';

// GUARD 1: Controlla solo se sei loggato (quella che avevamo già)
export const authGuard: CanActivateFn = (
  _route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const keycloak = inject(Keycloak);

  if (keycloak.authenticated) {
    return true;
  }

  keycloak.login({
    redirectUri: window.location.origin + state.url,
  });
  return false;
};

// GUARD 2 (NUOVA): Controlla se sei loggato E se hai il ruolo user_plus
export const userPlusGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Se l'utente ha il ruolo user_plus, lo facciamo passare
  if (authService.hasRole('user_plus')) {
    return true;
  }

  // Altrimenti, lo rimandiamo alla home (o una pagina di errore)
  alert("Accesso negato! Non hai i permessi per l'Area Plus.");
  router.navigate(['/']);
  return false;
};