import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import AccidentResolve from './route/accident-routing-resolve.service';

const accidentRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/accident.component').then(m => m.AccidentComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/accident-detail.component').then(m => m.AccidentDetailComponent),
    resolve: {
      accident: AccidentResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/accident-update.component').then(m => m.AccidentUpdateComponent),
    resolve: {
      accident: AccidentResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/accident-update.component').then(m => m.AccidentUpdateComponent),
    resolve: {
      accident: AccidentResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default accidentRoute;
