export interface IBankCard {
  id: string;
  cardCode?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  cvv?: string | null;
}

export type NewBankCard = Omit<IBankCard, 'id'> & { id: null };
