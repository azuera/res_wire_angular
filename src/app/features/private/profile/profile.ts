import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css'],
})
export class ProfileComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  user = this.authService.currentUser;
  editMode = signal(false);
  loading = signal(false);
  deleting = signal(false);
  success = signal<string | null>(null);
  error = signal<string | null>(null);

  editData = {
    email: '',
    plainPassword: '',
    confirmPassword: '',
  };

  ngOnInit() {
    if (this.user()) {
      this.editData.email = this.user()?.email || '';
    }
  }

  toggleEditMode() {
    this.editMode.set(!this.editMode());
    if (!this.editMode()) {
      // Reset form when canceling
      this.editData.email = this.user()?.email || '';
      this.editData.plainPassword = '';
      this.editData.confirmPassword = '';
      this.success.set(null);
      this.error.set(null);
    }
  }

  onSubmit() {
    this.loading.set(true);
    this.error.set(null);
    this.success.set(null);

    const updateData: any = {};

    if (this.editData.email !== this.user()?.email) {
      updateData.email = this.editData.email;
    }

    if (this.editData.plainPassword) {
      if (this.editData.plainPassword.length < 8) {
        this.error.set('Le mot de passe doit contenir au moins 8 caractères');
        this.loading.set(false);
        return;
      }
      if (this.editData.plainPassword !== this.editData.confirmPassword) {
        this.error.set('Les mots de passe ne correspondent pas');
        this.loading.set(false);
        return;
      }
      updateData.plainPassword = this.editData.plainPassword;
    }

    if (Object.keys(updateData).length === 0) {
      this.error.set('Aucune modification détectée');
      this.loading.set(false);
      return;
    }

    this.authService.updateProfile(updateData).subscribe({
      next: () => {
        this.success.set('Profil mis à jour avec succès !');
        this.loading.set(false);
        setTimeout(() => this.toggleEditMode(), 2000);
      },
      error: (err) => {
        console.error('Erreur mise à jour', err);
        this.error.set('Erreur lors de la mise à jour du profil');
        this.loading.set(false);
      },
    });
  }

  onDeleteAccount() {
    const confirmed = confirm(
      '⚠️ Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.',
    );

    if (confirmed) {
      this.deleting.set(true);
      this.authService.deleteAccount().subscribe({
        next: () => {
          this.deleting.set(false);
          this.authService.logout();
          this.router.navigate(['/']);
        },
        error: (err) => {
          console.error('Erreur suppression', err);
          this.error.set('Erreur lors de la suppression du compte');
          this.deleting.set(false);
        },
      });
    }
  }
}
