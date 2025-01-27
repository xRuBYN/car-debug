import dayjs from 'dayjs/esm';
import { IVehicle } from 'app/entities/vehicle/vehicle.model';

export interface IInspection {
  id: number;
  description?: string | null;
  createdBy?: string | null;
  createdDate?: dayjs.Dayjs | null;
  lastModifiedBy?: string | null;
  lastModifiedDate?: dayjs.Dayjs | null;
  vehicle?: IVehicle | null;
}

export type NewInspection = Omit<IInspection, 'id'> & { id: null };
