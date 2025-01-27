import dayjs from 'dayjs/esm';

import { IService, NewService } from './service.model';

export const sampleWithRequiredData: IService = {
  id: 3289,
  name: 'corduroy luxurious coat',
  price: 31948.16,
  createdBy: 'lovingly till',
  createdDate: dayjs('2025-01-27T08:07'),
};

export const sampleWithPartialData: IService = {
  id: 6152,
  name: 'calculating scarper',
  price: 9319.57,
  createdBy: 'drizzle smother offensively',
  createdDate: dayjs('2025-01-26T16:36'),
  lastModifiedBy: 'shunt showcase',
  lastModifiedDate: dayjs('2025-01-27T03:33'),
};

export const sampleWithFullData: IService = {
  id: 7422,
  name: 'for everlasting',
  description: 'amidst yahoo whether',
  price: 25387.96,
  createdBy: 'oof but',
  createdDate: dayjs('2025-01-26T17:29'),
  lastModifiedBy: 'when furthermore smile',
  lastModifiedDate: dayjs('2025-01-26T21:42'),
};

export const sampleWithNewData: NewService = {
  name: 'whereas quail parachute',
  price: 13448.99,
  createdBy: 'the mid carelessly',
  createdDate: dayjs('2025-01-26T19:37'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
