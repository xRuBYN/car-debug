import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IVehicleDetail, NewVehicleDetail } from '../vehicle-detail.model';

export type PartialUpdateVehicleDetail = Partial<IVehicleDetail> & Pick<IVehicleDetail, 'id'>;

export type EntityResponseType = HttpResponse<IVehicleDetail>;
export type EntityArrayResponseType = HttpResponse<IVehicleDetail[]>;

@Injectable({ providedIn: 'root' })
export class VehicleDetailService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/vehicle-details');

  create(vehicleDetail: NewVehicleDetail): Observable<EntityResponseType> {
    return this.http.post<IVehicleDetail>(this.resourceUrl, vehicleDetail, { observe: 'response' });
  }

  update(vehicleDetail: IVehicleDetail): Observable<EntityResponseType> {
    return this.http.put<IVehicleDetail>(`${this.resourceUrl}/${this.getVehicleDetailIdentifier(vehicleDetail)}`, vehicleDetail, {
      observe: 'response',
    });
  }

  partialUpdate(vehicleDetail: PartialUpdateVehicleDetail): Observable<EntityResponseType> {
    return this.http.patch<IVehicleDetail>(`${this.resourceUrl}/${this.getVehicleDetailIdentifier(vehicleDetail)}`, vehicleDetail, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IVehicleDetail>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IVehicleDetail[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getVehicleDetailIdentifier(vehicleDetail: Pick<IVehicleDetail, 'id'>): number {
    return vehicleDetail.id;
  }

  compareVehicleDetail(o1: Pick<IVehicleDetail, 'id'> | null, o2: Pick<IVehicleDetail, 'id'> | null): boolean {
    return o1 && o2 ? this.getVehicleDetailIdentifier(o1) === this.getVehicleDetailIdentifier(o2) : o1 === o2;
  }

  addVehicleDetailToCollectionIfMissing<Type extends Pick<IVehicleDetail, 'id'>>(
    vehicleDetailCollection: Type[],
    ...vehicleDetailsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const vehicleDetails: Type[] = vehicleDetailsToCheck.filter(isPresent);
    if (vehicleDetails.length > 0) {
      const vehicleDetailCollectionIdentifiers = vehicleDetailCollection.map(vehicleDetailItem =>
        this.getVehicleDetailIdentifier(vehicleDetailItem),
      );
      const vehicleDetailsToAdd = vehicleDetails.filter(vehicleDetailItem => {
        const vehicleDetailIdentifier = this.getVehicleDetailIdentifier(vehicleDetailItem);
        if (vehicleDetailCollectionIdentifiers.includes(vehicleDetailIdentifier)) {
          return false;
        }
        vehicleDetailCollectionIdentifiers.push(vehicleDetailIdentifier);
        return true;
      });
      return [...vehicleDetailsToAdd, ...vehicleDetailCollection];
    }
    return vehicleDetailCollection;
  }
}
