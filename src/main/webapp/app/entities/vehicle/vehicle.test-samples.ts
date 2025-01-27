import { IVehicle, NewVehicle } from './vehicle.model';

export const sampleWithRequiredData: IVehicle = {
  vin: '47401c57-f06b-45b3-85b8-bde80e2d5b17',
  make: 'whoa',
  model: 'physically brr dhow',
  year: 19446,
};

export const sampleWithPartialData: IVehicle = {
  vin: 'c7b97099-0c49-46cf-9c9a-54627aad70d6',
  make: 'ew exactly',
  model: 'regarding',
  year: 27203,
};

export const sampleWithFullData: IVehicle = {
  vin: '433c6888-81f5-4b3d-a3ba-f8ba63d465ff',
  make: 'pfft',
  model: 'wearily likely brr',
  year: 22177,
};

export const sampleWithNewData: NewVehicle = {
  make: 'unethically until',
  model: 'politely',
  year: 9626,
  vin: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
