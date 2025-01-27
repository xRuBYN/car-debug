import { IPlanConfig, NewPlanConfig } from './plan-config.model';

export const sampleWithRequiredData: IPlanConfig = {
  id: 10284,
  price: 470.9,
  attempts: 17657,
};

export const sampleWithPartialData: IPlanConfig = {
  id: 7619,
  price: 4701.04,
  attempts: 32722,
};

export const sampleWithFullData: IPlanConfig = {
  id: 2034,
  price: 28151.71,
  attempts: 11761,
};

export const sampleWithNewData: NewPlanConfig = {
  price: 32470.59,
  attempts: 21807,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
