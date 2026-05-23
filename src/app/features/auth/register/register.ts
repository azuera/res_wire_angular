import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';
  confirmPassword = '';
  error = signal<string | null>(null);
  loading = signal(false);

  onSubmit() {
    if (!this.email || !this.password || !this.confirmPassword) {
      this.error.set('Veuillez remplir tous les champs');
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.error.set('Les mots de passe ne correspondent pas');
      return;
    }

    if (this.password.length < 8) {
      this.error.set('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this.authService
      .register({
        email: this.email,
        plainPassword: this.password,
      })
      .subscribe({
        next: () => {
          // Connexion automatique après inscription
          this.authService.login({ email: this.email, password: this.password }).subscribe({
            next: () => this.router.navigate(['/']),
            error: () => this.router.navigate(['/login']),
          });
        },
        error: (err) => {
          console.error('Erreur inscription', err);
          if (err.error?.violations) {
            this.error.set(err.error.violations[0]?.message || "Erreur lors de l'inscription");
          } else {
            this.error.set("Erreur lors de l'inscription");
          }
          this.loading.set(false);
        },
      });
  }
}
