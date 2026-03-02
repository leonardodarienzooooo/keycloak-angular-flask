import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { ProfileComponent } from './pages/profile/profile';
import { authGuard } from './core/auth.guard';
// IMPORTANTE: deve puntare a /lista-spesa
import { ListaSpesaComponent } from './pages/lista-spesa/lista-spesa'; 

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  { path: 'spesa', component: ListaSpesaComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' }
];