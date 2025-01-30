export interface IPlanConfig {
  id: string;
  planType?: string | null;
  price?: number | null;
  attempts?: number | null;
}

export type NewPlanConfig = Omit<IPlanConfig, 'id'> & { id: null };
