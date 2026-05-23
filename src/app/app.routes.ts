import { Routes } from '@angular/router';
import { HomeComponent } from './features/public/home/home';
import { GameListComponent } from './features/public/game-list/game-list';
import { GameDetailComponent } from './features/public/game-detail/game-detail';
import { LoginComponent } from './features/auth/login/login';
import { RegisterComponent } from './features/auth/register/register';
import { LogoutComponent } from './features/auth/logout/logout';
import { authGuard } from './core/guards/auth-guard';
import { guestGuard } from './core/guards/guest-guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'games', component: GameListComponent },
  { path: 'game/:id', component: GameDetailComponent },
  { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [guestGuard] },
  { path: 'logout', component: LogoutComponent, canActivate: [authGuard] },
];
