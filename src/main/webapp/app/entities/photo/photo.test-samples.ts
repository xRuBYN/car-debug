import dayjs from 'dayjs/esm';

import { IPhoto, NewPhoto } from './photo.model';

export const sampleWithRequiredData: IPhoto = {
  id: '7166939a-b539-4214-90f9-2a802d1cb3a1',
  createdBy: 'hmph',
  createdDate: dayjs('2025-01-27T11:52'),
};

export const sampleWithPartialData: IPhoto = {
  id: 'e928a0e8-4c28-4e31-a194-6bd72b7cc7b8',
  path: 'or',
  createdBy: 'yowza',
  createdDate: dayjs('2025-01-27T07:35'),
};

export const sampleWithFullData: IPhoto = {
  id: 'f841d004-a57e-4eed-9e1b-05e5c4973271',
  path: 'sandpaper salve',
  createdBy: 'whenever for simvastatin',
  createdDate: dayjs('2025-01-26T20:10'),
  lastModifiedBy: 'yum',
  lastModifiedDate: dayjs('2025-01-27T01:05'),
};

export const sampleWithNewData: NewPhoto = {
  createdBy: 'heap',
  createdDate: dayjs('2025-01-27T15:57'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
