import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductApiService } from '../../../core/services/product-api';
import { Product } from '../../../core/models/product';

@Component({
  selector: 'app-game-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './game-detail.html',
  styleUrls: ['./game-detail.css'],
})
export class GameDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private productApi = inject(ProductApiService);

  product = signal<Product | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.productApi.getProduct(parseInt(id)).subscribe({
        next: (data) => {
          this.product.set(data);
          this.loading.set(false);
        },
        error: (err) => {
          console.error('Erreur chargement détail', err);
          this.error.set('Impossible de charger le jeu');
          this.loading.set(false);
        },
      });
    }
  }
}
