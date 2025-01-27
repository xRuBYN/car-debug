export interface IVehicle {
  vin: string;
  make?: string | null;
  model?: string | null;
  year?: number | null;
}

export type NewVehicle = Omit<IVehicle, 'vin'> & { vin: null };
