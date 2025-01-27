import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAccident } from '../accident.model';
import { AccidentService } from '../service/accident.service';

const accidentResolve = (route: ActivatedRouteSnapshot): Observable<null | IAccident> => {
  const id = route.params.id;
  if (id) {
    return inject(AccidentService)
      .find(id)
      .pipe(
        mergeMap((accident: HttpResponse<IAccident>) => {
          if (accident.body) {
            return of(accident.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default accidentResolve;
