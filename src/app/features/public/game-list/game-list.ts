import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductApiService } from '../../../core/services/product-api';
import { Product } from '../../../core/models/product';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-game-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './game-list.html',
  styleUrls: ['./game-list.css'],
})
export class GameListComponent implements OnInit {
  private productApi = inject(ProductApiService);
  products = signal<Product[]>([]); // ← Déjà bon, initialisé à []
  error = signal<string | null>(null); // ← Ajoutez cette ligne

  ngOnInit() {
    this.productApi.getProducts().subscribe({
      next: (data) => {
        console.log('Données reçues:', data);
        this.products.set(Array.isArray(data) ? data : []);
      },
      error: (err) => {
        console.error('Erreur chargement produits', err);
        this.error.set('Impossible de charger les jeux');
      },
    });
  }
}
