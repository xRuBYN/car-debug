import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPlanConfig, NewPlanConfig } from '../plan-config.model';

export type PartialUpdatePlanConfig = Partial<IPlanConfig> & Pick<IPlanConfig, 'id'>;

export type EntityResponseType = HttpResponse<IPlanConfig>;
export type EntityArrayResponseType = HttpResponse<IPlanConfig[]>;

@Injectable({ providedIn: 'root' })
export class PlanConfigService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/plan-configs');

  create(planConfig: NewPlanConfig): Observable<EntityResponseType> {
    return this.http.post<IPlanConfig>(this.resourceUrl, planConfig, { observe: 'response' });
  }

  purchasePlan(planConfigId: string): Observable<any> {
    return this.http.post(`${this.resourceUrl}/purchase/${planConfigId}`, { observe: 'response' });
  }

  update(planConfig: IPlanConfig): Observable<EntityResponseType> {
    return this.http.put<IPlanConfig>(`${this.resourceUrl}/${this.getPlanConfigIdentifier(planConfig)}`, planConfig, {
      observe: 'response',
    });
  }

  partialUpdate(planConfig: PartialUpdatePlanConfig): Observable<EntityResponseType> {
    return this.http.patch<IPlanConfig>(`${this.resourceUrl}/${this.getPlanConfigIdentifier(planConfig)}`, planConfig, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IPlanConfig>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IPlanConfig[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getPlanConfigIdentifier(planConfig: Pick<IPlanConfig, 'id'>): string {
    return planConfig.id;
  }

  comparePlanConfig(o1: Pick<IPlanConfig, 'id'> | null, o2: Pick<IPlanConfig, 'id'> | null): boolean {
    return o1 && o2 ? this.getPlanConfigIdentifier(o1) === this.getPlanConfigIdentifier(o2) : o1 === o2;
  }

  addPlanConfigToCollectionIfMissing<Type extends Pick<IPlanConfig, 'id'>>(
    planConfigCollection: Type[],
    ...planConfigsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const planConfigs: Type[] = planConfigsToCheck.filter(isPresent);
    if (planConfigs.length > 0) {
      const planConfigCollectionIdentifiers = planConfigCollection.map(planConfigItem => this.getPlanConfigIdentifier(planConfigItem));
      const planConfigsToAdd = planConfigs.filter(planConfigItem => {
        const planConfigIdentifier = this.getPlanConfigIdentifier(planConfigItem);
        if (planConfigCollectionIdentifiers.includes(planConfigIdentifier)) {
          return false;
        }
        planConfigCollectionIdentifiers.push(planConfigIdentifier);
        return true;
      });
      return [...planConfigsToAdd, ...planConfigCollection];
    }
    return planConfigCollection;
  }
}
