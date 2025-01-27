import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IPlanConfig } from '../plan-config.model';
import { PlanConfigService } from '../service/plan-config.service';

const planConfigResolve = (route: ActivatedRouteSnapshot): Observable<null | IPlanConfig> => {
  const id = route.params.id;
  if (id) {
    return inject(PlanConfigService)
      .find(id)
      .pipe(
        mergeMap((planConfig: HttpResponse<IPlanConfig>) => {
          if (planConfig.body) {
            return of(planConfig.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default planConfigResolve;
