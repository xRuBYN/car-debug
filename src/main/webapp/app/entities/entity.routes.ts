import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'authority',
    data: { pageTitle: 'monitoringApp.adminAuthority.home.title' },
    loadChildren: () => import('./admin/authority/authority.routes'),
  },
  {
    path: 'bank-card',
    data: { pageTitle: 'monitoringApp.bankCard.home.title' },
    loadChildren: () => import('./bank-card/bank-card.routes'),
  },
  {
    path: 'plan-config',
    data: { pageTitle: 'monitoringApp.planConfig.home.title' },
    loadChildren: () => import('./plan-config/plan-config.routes'),
  },
  {
    path: 'vehicle',
    data: { pageTitle: 'monitoringApp.vehicle.home.title' },
    loadChildren: () => import('./vehicle/vehicle.routes'),
  },
  {
    path: 'inspection',
    data: { pageTitle: 'monitoringApp.inspection.home.title' },
    loadChildren: () => import('./inspection/inspection.routes'),
  },
  {
    path: 'accident',
    data: { pageTitle: 'monitoringApp.accident.home.title' },
    loadChildren: () => import('./accident/accident.routes'),
  },
  {
    path: 'service',
    data: { pageTitle: 'monitoringApp.service.home.title' },
    loadChildren: () => import('./service/service.routes'),
  },
  {
    path: 'photo',
    data: { pageTitle: 'monitoringApp.photo.home.title' },
    loadChildren: () => import('./photo/photo.routes'),
  },
  {
    path: 'order-history',
    data: { pageTitle: 'monitoringApp.orderHistory.home.title' },
    loadChildren: () => import('./order-history/order-history.routes'),
  },
  {
    path: 'vehicle-detail',
    data: { pageTitle: 'monitoringApp.vehicleDetail.home.title' },
    loadChildren: () => import('./vehicle-detail/vehicle-detail.routes'),
  },
  /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
];

export default routes;
