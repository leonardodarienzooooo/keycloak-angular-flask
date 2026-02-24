import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home'; // <--- DEVE ESSERE COSÌ
import { ProfileComponent } from './pages/profile/profile'; // <--- DEVE ESSERE COSÌ
import { authGuard } from './core/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' }
];