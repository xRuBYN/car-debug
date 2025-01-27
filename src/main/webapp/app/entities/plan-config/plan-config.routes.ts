import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import PlanConfigResolve from './route/plan-config-routing-resolve.service';

const planConfigRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/plan-config.component').then(m => m.PlanConfigComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/plan-config-detail.component').then(m => m.PlanConfigDetailComponent),
    resolve: {
      planConfig: PlanConfigResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/plan-config-update.component').then(m => m.PlanConfigUpdateComponent),
    resolve: {
      planConfig: PlanConfigResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/plan-config-update.component').then(m => m.PlanConfigUpdateComponent),
    resolve: {
      planConfig: PlanConfigResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default planConfigRoute;
