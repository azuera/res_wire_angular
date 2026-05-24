import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { InvoiceService, Invoice } from '../../../core/services/invoice.service';

@Component({
  selector: 'app-invoices',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './invoices.html',
  styleUrls: ['./invoices.css'],
})
export class InvoicesComponent implements OnInit {
  private invoiceService = inject(InvoiceService);

  invoices = signal<Invoice[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit() {
    this.loadInvoices();
  }

  loadInvoices() {
    this.invoiceService.getUserInvoices().subscribe({
      next: (data) => {
        // Trier par date décroissante
        const sorted = [...data].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        this.invoices.set(sorted);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Erreur chargement factures', err);
        // Pas d'erreur affichée, juste un tableau vide
        this.invoices.set([]);
        this.loading.set(false);
      },
    });
  }
  viewDetail(invoiceId: number) {
    // Pour l'instant, affiche juste une alerte
    // Vous pourrez plus tard créer une page de détail
    alert(`Détail de la facture #${invoiceId} à implémenter`);
    // Option: this.router.navigate(['/invoice', invoiceId]);
  }
}
