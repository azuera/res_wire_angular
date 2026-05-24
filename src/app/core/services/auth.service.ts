import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

interface LoginResponse {
  token: string;
  refresh_token?: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  plainPassword: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private apiUrl = 'http://localhost:8000/api';

  isAuthenticated = signal<boolean>(false);
  currentUser = signal<any>(null);

  constructor() {
    const token = this.getToken();
    if (token && !this.isTokenExpired(token)) {
      this.isAuthenticated.set(true);
      this.loadUserInfo();
    } else if (token && this.isTokenExpired(token)) {
      // Token expiré au démarrage → on nettoie
      this.removeToken();
      this.isAuthenticated.set(false);
    }
  }

  login(credentials: LoginCredentials): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login_check`, credentials).pipe(
      tap((response) => {
        if (response.token) {
          this.setToken(response.token);
          this.isAuthenticated.set(true);
          this.loadUserInfo();
        }
      }),
    );
  }

  register(userData: RegisterData): Observable<any> {
    return this.http.post(`${this.apiUrl}/users`, userData, {
      headers: {
        'Content-Type': 'application/ld+json',
      },
    });
  }

  logout(): void {
    this.removeToken();
    this.isAuthenticated.set(false);
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('jwt_token');
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  // Décode le payload JWT et vérifie la date d'expiration
  isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return Date.now() >= payload.exp * 1000;
    } catch {
      return true; // token malformé → considéré expiré
    }
  }

  private setToken(token: string): void {
    localStorage.setItem('jwt_token', token);
  }

  private removeToken(): void {
    localStorage.removeItem('jwt_token');
  }

  private loadUserInfo(): void {
    this.http.get(`${this.apiUrl}/users/me`).subscribe({
      next: (user) => this.currentUser.set(user),
      error: () => this.currentUser.set(null),
    });
  }
  updateProfile(userData: any): Observable<any> {
    const userId = this.currentUser()?.id;
    return this.http
      .patch(`${this.apiUrl}/users/${userId}`, userData)
      .pipe(tap(() => this.loadUserInfo()));
  }
  deleteAccount(): Observable<any> {
    const userId = this.currentUser()?.id;
    return this.http.delete(`${this.apiUrl}/users/${userId}`).pipe(
      tap(() => {
        this.removeToken();
        this.isAuthenticated.set(false);
        this.currentUser.set(null);
      }),
    );
  }
}
