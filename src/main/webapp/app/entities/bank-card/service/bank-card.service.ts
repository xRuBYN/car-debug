import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IBankCard, NewBankCard } from '../bank-card.model';

export type PartialUpdateBankCard = Partial<IBankCard> & Pick<IBankCard, 'id'>;

export type EntityResponseType = HttpResponse<IBankCard>;
export type EntityArrayResponseType = HttpResponse<IBankCard[]>;

@Injectable({ providedIn: 'root' })
export class BankCardService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/bank-cards');

  create(bankCard: NewBankCard): Observable<EntityResponseType> {
    return this.http.post<IBankCard>(this.resourceUrl, bankCard, { observe: 'response' });
  }

  update(bankCard: IBankCard): Observable<EntityResponseType> {
    return this.http.put<IBankCard>(`${this.resourceUrl}/${this.getBankCardIdentifier(bankCard)}`, bankCard, { observe: 'response' });
  }

  partialUpdate(bankCard: PartialUpdateBankCard): Observable<EntityResponseType> {
    return this.http.patch<IBankCard>(`${this.resourceUrl}/${this.getBankCardIdentifier(bankCard)}`, bankCard, { observe: 'response' });
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http.get<IBankCard>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IBankCard[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getBankCardIdentifier(bankCard: Pick<IBankCard, 'id'>): string {
    return bankCard.id;
  }

  compareBankCard(o1: Pick<IBankCard, 'id'> | null, o2: Pick<IBankCard, 'id'> | null): boolean {
    return o1 && o2 ? this.getBankCardIdentifier(o1) === this.getBankCardIdentifier(o2) : o1 === o2;
  }

  addBankCardToCollectionIfMissing<Type extends Pick<IBankCard, 'id'>>(
    bankCardCollection: Type[],
    ...bankCardsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const bankCards: Type[] = bankCardsToCheck.filter(isPresent);
    if (bankCards.length > 0) {
      const bankCardCollectionIdentifiers = bankCardCollection.map(bankCardItem => this.getBankCardIdentifier(bankCardItem));
      const bankCardsToAdd = bankCards.filter(bankCardItem => {
        const bankCardIdentifier = this.getBankCardIdentifier(bankCardItem);
        if (bankCardCollectionIdentifiers.includes(bankCardIdentifier)) {
          return false;
        }
        bankCardCollectionIdentifiers.push(bankCardIdentifier);
        return true;
      });
      return [...bankCardsToAdd, ...bankCardCollection];
    }
    return bankCardCollection;
  }
}
