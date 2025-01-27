import { IBankCard, NewBankCard } from './bank-card.model';

export const sampleWithRequiredData: IBankCard = {
  id: 'c4b9556a-3fa7-4625-818e-4173bfcd10cb',
  cardCode: 'brr stud questio',
  firstName: 'Levi',
  lastName: 'Jast',
  cvv: 'dec',
};

export const sampleWithPartialData: IBankCard = {
  id: 'a781f668-7661-4a7a-872a-4228334b8845',
  cardCode: 'which lest super',
  firstName: 'Noelia',
  lastName: 'Osinski',
  cvv: 'pis',
};

export const sampleWithFullData: IBankCard = {
  id: 'b7e65f35-8439-4c9b-956a-fafe38d888f7',
  cardCode: 'huzzah enlighten',
  firstName: 'Marcelina',
  lastName: 'Muller',
  cvv: 'ah ',
};

export const sampleWithNewData: NewBankCard = {
  cardCode: 'ultimately',
  firstName: 'Elroy',
  lastName: 'Mosciski',
  cvv: 'wit',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
