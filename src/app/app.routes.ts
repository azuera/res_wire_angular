import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'test-api',
    loadComponent: () =>
      import('./features/public/api-test/api-test').then((m) => m.ApiTestComponent),
  },
];
