import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import ServiceResolve from './route/service-routing-resolve.service';

const serviceRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/service.component').then(m => m.ServiceComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/service-detail.component').then(m => m.ServiceDetailComponent),
    resolve: {
      service: ServiceResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/service-update.component').then(m => m.ServiceUpdateComponent),
    resolve: {
      service: ServiceResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/service-update.component').then(m => m.ServiceUpdateComponent),
    resolve: {
      service: ServiceResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default serviceRoute;
