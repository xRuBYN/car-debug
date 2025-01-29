export interface IVehicleDetail {
  id: number;
  color?: string | null;
  engineDescription?: string | null;
  fuelType?: string | null;
}

export type NewVehicleDetail = Omit<IVehicleDetail, 'id'> & { id: null };
