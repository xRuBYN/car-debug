import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IBankCard } from '../bank-card.model';
import { BankCardService } from '../service/bank-card.service';

const bankCardResolve = (route: ActivatedRouteSnapshot): Observable<null | IBankCard> => {
  const id = route.params.id;
  if (id) {
    return inject(BankCardService)
      .find(id)
      .pipe(
        mergeMap((bankCard: HttpResponse<IBankCard>) => {
          if (bankCard.body) {
            return of(bankCard.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default bankCardResolve;
