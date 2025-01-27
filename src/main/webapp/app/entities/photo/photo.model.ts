import dayjs from 'dayjs/esm';
import { IVehicle } from 'app/entities/vehicle/vehicle.model';
import { IInspection } from 'app/entities/inspection/inspection.model';
import { IAccident } from 'app/entities/accident/accident.model';
import { IService } from 'app/entities/service/service.model';

export interface IPhoto {
  id: string;
  path?: string | null;
  createdBy?: string | null;
  createdDate?: dayjs.Dayjs | null;
  lastModifiedBy?: string | null;
  lastModifiedDate?: dayjs.Dayjs | null;
  vehicle?: IVehicle | null;
  inspection?: IInspection | null;
  accident?: IAccident | null;
  service?: IService | null;
}

export type NewPhoto = Omit<IPhoto, 'id'> & { id: null };
