import dayjs from 'dayjs/esm';

import { IInspection, NewInspection } from './inspection.model';

export const sampleWithRequiredData: IInspection = {
  id: 29265,
  createdBy: 'sleepily grave',
  createdDate: dayjs('2025-01-27T12:19'),
};

export const sampleWithPartialData: IInspection = {
  id: 29900,
  createdBy: 'fake ew elastic',
  createdDate: dayjs('2025-01-27T00:03'),
  lastModifiedBy: 'regularly',
  lastModifiedDate: dayjs('2025-01-27T10:58'),
};

export const sampleWithFullData: IInspection = {
  id: 14071,
  description: 'revamp',
  createdBy: 'husky',
  createdDate: dayjs('2025-01-27T11:45'),
  lastModifiedBy: 'gum houseboat delayed',
  lastModifiedDate: dayjs('2025-01-26T21:22'),
};

export const sampleWithNewData: NewInspection = {
  createdBy: 'tomorrow panel plaintive',
  createdDate: dayjs('2025-01-27T15:28'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
