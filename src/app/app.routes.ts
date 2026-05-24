import { Routes } from '@angular/router';
import { HomeComponent } from './features/public/home/home';
import { GameListComponent } from './features/public/game-list/game-list';
import { GameDetailComponent } from './features/public/game-detail/game-detail';
import { LoginComponent } from './features/auth/login/login';
import { RegisterComponent } from './features/auth/register/register';
import { LogoutComponent } from './features/auth/logout/logout';
import { DashboardComponent } from './features/private/dashboard/dashboard';
import { ProfileComponent } from './features/private/profile/profile';
import { InvoicesComponent } from './features/private/invoices/invoices';
import { authGuard } from './core/guards/auth-guard';
import { guestGuard } from './core/guards/guest-guard';

export const routes: Routes = [
  // Routes publiques
  { path: '', component: HomeComponent },
  { path: 'games', component: GameListComponent },
  { path: 'game/:id', component: GameDetailComponent },

  // Routes d'authentification
  { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [guestGuard] },
  { path: 'logout', component: LogoutComponent, canActivate: [authGuard] },

  // Routes privées
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  { path: 'invoices', component: InvoicesComponent, canActivate: [authGuard] },

  // Redirection
  { path: '**', redirectTo: '' },
];
