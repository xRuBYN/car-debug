import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import BankCardResolve from './route/bank-card-routing-resolve.service';

const bankCardRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/bank-card.component').then(m => m.BankCardComponent),
    data: {},
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/bank-card-detail.component').then(m => m.BankCardDetailComponent),
    resolve: {
      bankCard: BankCardResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/bank-card-update.component').then(m => m.BankCardUpdateComponent),
    resolve: {
      bankCard: BankCardResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/bank-card-update.component').then(m => m.BankCardUpdateComponent),
    resolve: {
      bankCard: BankCardResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default bankCardRoute;
