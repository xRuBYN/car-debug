import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import VehicleResolve from './route/vehicle-routing-resolve.service';

const vehicleRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/vehicle.component').then(m => m.VehicleComponent),
    data: {},
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':vin/view',
    loadComponent: () => import('./detail/vehicle-detail.component').then(m => m.VehicleDetailComponent),
    resolve: {
      vehicle: VehicleResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/vehicle-update.component').then(m => m.VehicleUpdateComponent),
    resolve: {
      vehicle: VehicleResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':vin/edit',
    loadComponent: () => import('./update/vehicle-update.component').then(m => m.VehicleUpdateComponent),
    resolve: {
      vehicle: VehicleResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default vehicleRoute;
