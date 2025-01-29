import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import VehicleDetailResolve from './route/vehicle-detail-routing-resolve.service';

const vehicleDetailRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/vehicle-detail.component').then(m => m.VehicleDetailComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/vehicle-detail-detail.component').then(m => m.VehicleDetailDetailComponent),
    resolve: {
      vehicleDetail: VehicleDetailResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/vehicle-detail-update.component').then(m => m.VehicleDetailUpdateComponent),
    resolve: {
      vehicleDetail: VehicleDetailResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/vehicle-detail-update.component').then(m => m.VehicleDetailUpdateComponent),
    resolve: {
      vehicleDetail: VehicleDetailResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default vehicleDetailRoute;
