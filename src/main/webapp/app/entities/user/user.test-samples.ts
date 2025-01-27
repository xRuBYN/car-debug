import { IUser } from './user.model';

export const sampleWithRequiredData: IUser = {
  id: 18911,
  login: 'Y@WE9OyE\\QYhZ-dW\\@n\\ztanHfn\\qjrX1K',
};

export const sampleWithPartialData: IUser = {
  id: 6977,
  login: 'QaFj',
};

export const sampleWithFullData: IUser = {
  id: 864,
  login: 'o',
};
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
