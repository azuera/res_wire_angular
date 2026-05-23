import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [CommonModule],
  template: '<p>Déconnexion...</p>',
})
export class LogoutComponent implements OnInit {
  private authService = inject(AuthService);

  ngOnInit() {
    this.authService.logout();
  }
}
