import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import OrderHistoryResolve from './route/order-history-routing-resolve.service';

const orderHistoryRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/order-history.component').then(m => m.OrderHistoryComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/order-history-detail.component').then(m => m.OrderHistoryDetailComponent),
    resolve: {
      orderHistory: OrderHistoryResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/order-history-update.component').then(m => m.OrderHistoryUpdateComponent),
    resolve: {
      orderHistory: OrderHistoryResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/order-history-update.component').then(m => m.OrderHistoryUpdateComponent),
    resolve: {
      orderHistory: OrderHistoryResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default orderHistoryRoute;
