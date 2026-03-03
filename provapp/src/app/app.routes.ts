import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { ProfileComponent } from './pages/profile/profile';
import { ListaSpesaComponent } from './pages/lista-spesa/lista-spesa';
import { Plus } from './pages/plus/plus'; // Importiamo il nuovo componente
import { authGuard, userPlusGuard } from './core/auth.guard'; // Importiamo le guard

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  { path: 'spesa', component: ListaSpesaComponent, canActivate: [authGuard] },
  
  // Questa rotta è protetta dalla Guard specifica per i "Plus"
  { path: 'plus', component: Plus, canActivate: [userPlusGuard] },
  
  { path: '**', redirectTo: '' },
];