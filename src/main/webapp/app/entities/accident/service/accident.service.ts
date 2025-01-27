import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAccident, NewAccident } from '../accident.model';

export type PartialUpdateAccident = Partial<IAccident> & Pick<IAccident, 'id'>;

type RestOf<T extends IAccident | NewAccident> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

export type RestAccident = RestOf<IAccident>;

export type NewRestAccident = RestOf<NewAccident>;

export type PartialUpdateRestAccident = RestOf<PartialUpdateAccident>;

export type EntityResponseType = HttpResponse<IAccident>;
export type EntityArrayResponseType = HttpResponse<IAccident[]>;

@Injectable({ providedIn: 'root' })
export class AccidentService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/accidents');

  create(accident: NewAccident): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(accident);
    return this.http
      .post<RestAccident>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(accident: IAccident): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(accident);
    return this.http
      .put<RestAccident>(`${this.resourceUrl}/${this.getAccidentIdentifier(accident)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(accident: PartialUpdateAccident): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(accident);
    return this.http
      .patch<RestAccident>(`${this.resourceUrl}/${this.getAccidentIdentifier(accident)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestAccident>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestAccident[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getAccidentIdentifier(accident: Pick<IAccident, 'id'>): number {
    return accident.id;
  }

  compareAccident(o1: Pick<IAccident, 'id'> | null, o2: Pick<IAccident, 'id'> | null): boolean {
    return o1 && o2 ? this.getAccidentIdentifier(o1) === this.getAccidentIdentifier(o2) : o1 === o2;
  }

  addAccidentToCollectionIfMissing<Type extends Pick<IAccident, 'id'>>(
    accidentCollection: Type[],
    ...accidentsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const accidents: Type[] = accidentsToCheck.filter(isPresent);
    if (accidents.length > 0) {
      const accidentCollectionIdentifiers = accidentCollection.map(accidentItem => this.getAccidentIdentifier(accidentItem));
      const accidentsToAdd = accidents.filter(accidentItem => {
        const accidentIdentifier = this.getAccidentIdentifier(accidentItem);
        if (accidentCollectionIdentifiers.includes(accidentIdentifier)) {
          return false;
        }
        accidentCollectionIdentifiers.push(accidentIdentifier);
        return true;
      });
      return [...accidentsToAdd, ...accidentCollection];
    }
    return accidentCollection;
  }

  protected convertDateFromClient<T extends IAccident | NewAccident | PartialUpdateAccident>(accident: T): RestOf<T> {
    return {
      ...accident,
      createdDate: accident.createdDate?.toJSON() ?? null,
      lastModifiedDate: accident.lastModifiedDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restAccident: RestAccident): IAccident {
    return {
      ...restAccident,
      createdDate: restAccident.createdDate ? dayjs(restAccident.createdDate) : undefined,
      lastModifiedDate: restAccident.lastModifiedDate ? dayjs(restAccident.lastModifiedDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestAccident>): HttpResponse<IAccident> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestAccident[]>): HttpResponse<IAccident[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
