import dayjs from 'dayjs/esm';
import { IVehicle } from 'app/entities/vehicle/vehicle.model';

export interface IAccident {
  id: number;
  description?: string | null;
  createdBy?: string | null;
  createdDate?: dayjs.Dayjs | null;
  lastModifiedBy?: string | null;
  lastModifiedDate?: dayjs.Dayjs | null;
  vehicle?: IVehicle | null;
}

export type NewAccident = Omit<IAccident, 'id'> & { id: null };
