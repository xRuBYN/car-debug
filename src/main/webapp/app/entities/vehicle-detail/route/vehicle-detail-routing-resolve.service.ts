import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IVehicleDetail } from '../vehicle-detail.model';
import { VehicleDetailService } from '../service/vehicle-detail.service';

const vehicleDetailResolve = (route: ActivatedRouteSnapshot): Observable<null | IVehicleDetail> => {
  const id = route.params.id;
  if (id) {
    return inject(VehicleDetailService)
      .find(id)
      .pipe(
        mergeMap((vehicleDetail: HttpResponse<IVehicleDetail>) => {
          if (vehicleDetail.body) {
            return of(vehicleDetail.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default vehicleDetailResolve;
