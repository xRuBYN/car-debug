import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IVehicle, NewVehicle } from '../vehicle.model';

export type PartialUpdateVehicle = Partial<IVehicle> & Pick<IVehicle, 'vin'>;

export type EntityResponseType = HttpResponse<IVehicle>;
export type EntityArrayResponseType = HttpResponse<IVehicle[]>;

@Injectable({ providedIn: 'root' })
export class VehicleService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/vehicles');

  create(vehicle: NewVehicle): Observable<EntityResponseType> {
    return this.http.post<IVehicle>(this.resourceUrl, vehicle, { observe: 'response' });
  }

  update(vehicle: IVehicle): Observable<EntityResponseType> {
    return this.http.put<IVehicle>(`${this.resourceUrl}/${this.getVehicleIdentifier(vehicle)}`, vehicle, { observe: 'response' });
  }

  partialUpdate(vehicle: PartialUpdateVehicle): Observable<EntityResponseType> {
    return this.http.patch<IVehicle>(`${this.resourceUrl}/${this.getVehicleIdentifier(vehicle)}`, vehicle, { observe: 'response' });
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http.get<IVehicle>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IVehicle[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  generateReport(id: string): Observable<HttpResponse<{}>> {
    return this.http.get(`${this.resourceUrl}/generate-report/${id}`, { observe: 'response' });
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getVehicleIdentifier(vehicle: Pick<IVehicle, 'vin'>): string {
    return vehicle.vin;
  }

  compareVehicle(o1: Pick<IVehicle, 'vin'> | null, o2: Pick<IVehicle, 'vin'> | null): boolean {
    return o1 && o2 ? this.getVehicleIdentifier(o1) === this.getVehicleIdentifier(o2) : o1 === o2;
  }

  addVehicleToCollectionIfMissing<Type extends Pick<IVehicle, 'vin'>>(
    vehicleCollection: Type[],
    ...vehiclesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const vehicles: Type[] = vehiclesToCheck.filter(isPresent);
    if (vehicles.length > 0) {
      const vehicleCollectionIdentifiers = vehicleCollection.map(vehicleItem => this.getVehicleIdentifier(vehicleItem));
      const vehiclesToAdd = vehicles.filter(vehicleItem => {
        const vehicleIdentifier = this.getVehicleIdentifier(vehicleItem);
        if (vehicleCollectionIdentifiers.includes(vehicleIdentifier)) {
          return false;
        }
        vehicleCollectionIdentifiers.push(vehicleIdentifier);
        return true;
      });
      return [...vehiclesToAdd, ...vehicleCollection];
    }
    return vehicleCollection;
  }
}
