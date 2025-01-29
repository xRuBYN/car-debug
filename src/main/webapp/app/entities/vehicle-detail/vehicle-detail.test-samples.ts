import { IVehicleDetail, NewVehicleDetail } from './vehicle-detail.model';

export const sampleWithRequiredData: IVehicleDetail = {
  id: 22480,
};

export const sampleWithPartialData: IVehicleDetail = {
  id: 21552,
  engineDescription: 'when tease',
};

export const sampleWithFullData: IVehicleDetail = {
  id: 15496,
  color: 'indigo',
  engineDescription: 'apropos',
  fuelType: 'than carelessly',
};

export const sampleWithNewData: NewVehicleDetail = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
