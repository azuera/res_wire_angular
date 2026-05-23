import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../core/services/api';

@Component({
  selector: 'app-api-test',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="test-container">
      <h2>Test API GameWall</h2>

      <div class="controls">
        <button (click)="testProducts()">Tester /api/products</button>
        <button (click)="clearLogs()">Effacer logs</button>
      </div>

      <div class="results" *ngIf="response">
        <h3>Réponse de l'API :</h3>
        <pre>{{ response | json }}</pre>
      </div>

      <div class="error" *ngIf="error">
        <h3>❌ Erreur :</h3>
        <pre>{{ error }}</pre>
      </div>
    </div>
  `,
  styles: [
    `
      .test-container {
        padding: 20px;
        font-family: monospace;
      }
      .controls {
        margin: 20px 0;
      }
      button {
        margin-right: 10px;
        padding: 10px 20px;
        background: #007bff;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
      }
      button:hover {
        background: #0056b3;
      }
      .results,
      .error {
        margin-top: 20px;
        padding: 15px;
        border-radius: 5px;
      }
      .results {
        background: #f0f8ff;
        border: 1px solid #007bff;
      }
      .error {
        background: #ffe6e6;
        border: 1px solid #ff0000;
        color: #ff0000;
      }
      pre {
        overflow-x: auto;
        white-space: pre-wrap;
        word-wrap: break-word;
      }
    `,
  ],
})
export class ApiTestComponent implements OnInit {
  private apiService = inject(ApiService);

  response: any = null;
  error: string | null = null;

  ngOnInit() {
    console.log('Composant de test API chargé');
    console.log('URL de base:', 'http://127.0.0.1:8000/api');
  }

  testProducts() {
    this.error = null;
    this.apiService.getProducts(1).subscribe({
      next: (data) => {
        console.log('Réponse API products:', data);
        this.response = data;
      },
      error: (err) => {
        console.error('Erreur API:', err);
        this.error = `Status: ${err.status} - ${err.statusText}\nMessage: ${err.message}\nURL: ${err.url}`;
      },
    });
  }

  clearLogs() {
    this.response = null;
    this.error = null;
  }
}
