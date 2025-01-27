import dayjs from 'dayjs/esm';
import { IVehicle } from 'app/entities/vehicle/vehicle.model';

export interface IService {
  id: number;
  name?: string | null;
  description?: string | null;
  price?: number | null;
  createdBy?: string | null;
  createdDate?: dayjs.Dayjs | null;
  lastModifiedBy?: string | null;
  lastModifiedDate?: dayjs.Dayjs | null;
  vehicle?: IVehicle | null;
}

export type NewService = Omit<IService, 'id'> & { id: null };
