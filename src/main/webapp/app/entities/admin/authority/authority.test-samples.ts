import { IAuthority, NewAuthority } from './authority.model';

export const sampleWithRequiredData: IAuthority = {
  name: '6b929e98-c698-47dd-a61a-f5aa3a4f5598',
};

export const sampleWithPartialData: IAuthority = {
  name: '8f7c784a-2729-436b-947c-99e83672f76e',
};

export const sampleWithFullData: IAuthority = {
  name: '39cd1f58-5ced-4364-89bb-711fd5de9aef',
};

export const sampleWithNewData: NewAuthority = {
  name: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
