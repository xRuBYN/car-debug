export interface IPlanConfig {
  id: number;
  price?: number | null;
  attempts?: number | null;
}

export type NewPlanConfig = Omit<IPlanConfig, 'id'> & { id: null };
