import dayjs from 'dayjs/esm';

import { IOrderHistory, NewOrderHistory } from './order-history.model';

export const sampleWithRequiredData: IOrderHistory = {
  id: 16217,
  userId: 20182,
  planType: 'ecstatic fooey',
  amount: 28633.69,
  createdBy: 'between tiny',
  createdDate: dayjs('2025-01-26T22:40'),
};

export const sampleWithPartialData: IOrderHistory = {
  id: 4436,
  userId: 5944,
  planType: 'strong step-uncle among',
  amount: 25746.57,
  createdBy: 'failing',
  createdDate: dayjs('2025-01-27T09:31'),
  lastModifiedBy: 'yahoo deeply yum',
  lastModifiedDate: dayjs('2025-01-27T18:02'),
};

export const sampleWithFullData: IOrderHistory = {
  id: 9351,
  userId: 3192,
  planType: 'beanie gadzooks wide-eyed',
  amount: 11008.43,
  createdBy: 'hm wide',
  createdDate: dayjs('2025-01-27T19:52'),
  lastModifiedBy: 'pickaxe',
  lastModifiedDate: dayjs('2025-01-27T16:00'),
};

export const sampleWithNewData: NewOrderHistory = {
  userId: 10537,
  planType: 'gadzooks that across',
  amount: 13391.32,
  createdBy: 'that',
  createdDate: dayjs('2025-01-27T14:21'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
