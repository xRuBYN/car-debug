import dayjs from 'dayjs/esm';

import { IAccident, NewAccident } from './accident.model';

export const sampleWithRequiredData: IAccident = {
  id: 1456,
  createdBy: 'lest even though',
  createdDate: dayjs('2025-01-27T14:46'),
};

export const sampleWithPartialData: IAccident = {
  id: 22235,
  createdBy: 'odyssey',
  createdDate: dayjs('2025-01-26T17:31'),
  lastModifiedDate: dayjs('2025-01-27T00:02'),
};

export const sampleWithFullData: IAccident = {
  id: 27257,
  description: 'legislature without',
  createdBy: 'suddenly successfully',
  createdDate: dayjs('2025-01-27T14:33'),
  lastModifiedBy: 'lest flu',
  lastModifiedDate: dayjs('2025-01-26T18:45'),
};

export const sampleWithNewData: NewAccident = {
  createdBy: 'sheepishly',
  createdDate: dayjs('2025-01-26T18:44'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
