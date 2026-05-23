import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductApiService } from '../../../core/services/product-api';
import { Product } from '../../../core/models/product';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class HomeComponent implements OnInit {
  private productApi = inject(ProductApiService);
  latestProducts = signal<Product[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit() {
    this.productApi.getProducts().subscribe({
      next: (data) => {
        console.log('Tous les produits:', data);

        // Trier par date de sortie (la plus récente d'abord) et prendre les 3 premiers
        const sorted = [...data]
          .sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime())
          .slice(0, 3);

        this.latestProducts.set(sorted);
        this.loading.set(false);
        console.log('3 derniers produits:', sorted);
      },
      error: (err) => {
        console.error('Erreur chargement produits', err);
        this.error.set('Impossible de charger les derniers jeux');
        this.loading.set(false);
      },
    });
  }
}
