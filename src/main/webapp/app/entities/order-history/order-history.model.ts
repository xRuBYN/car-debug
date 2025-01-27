import dayjs from 'dayjs/esm';

export interface IOrderHistory {
  id: number;
  userId?: number | null;
  planType?: string | null;
  amount?: number | null;
  createdBy?: string | null;
  createdDate?: dayjs.Dayjs | null;
  lastModifiedBy?: string | null;
  lastModifiedDate?: dayjs.Dayjs | null;
}

export type NewOrderHistory = Omit<IOrderHistory, 'id'> & { id: null };
