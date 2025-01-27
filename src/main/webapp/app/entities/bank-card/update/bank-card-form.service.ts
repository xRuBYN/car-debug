import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { IBankCard, NewBankCard } from '../bank-card.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IBankCard for edit and NewBankCardFormGroupInput for create.
 */
type BankCardFormGroupInput = IBankCard | PartialWithRequiredKeyOf<NewBankCard>;

type BankCardFormDefaults = Pick<NewBankCard, 'id'>;

type BankCardFormGroupContent = {
  id: FormControl<IBankCard['id'] | NewBankCard['id']>;
  cardCode: FormControl<IBankCard['cardCode']>;
  firstName: FormControl<IBankCard['firstName']>;
  lastName: FormControl<IBankCard['lastName']>;
  cvv: FormControl<IBankCard['cvv']>;
};

export type BankCardFormGroup = FormGroup<BankCardFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class BankCardFormService {
  createBankCardFormGroup(bankCard: BankCardFormGroupInput = { id: null }): BankCardFormGroup {
    const bankCardRawValue = {
      ...this.getFormDefaults(),
      ...bankCard,
    };
    return new FormGroup<BankCardFormGroupContent>({
      id: new FormControl(
        { value: bankCardRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      cardCode: new FormControl(bankCardRawValue.cardCode, {
        validators: [Validators.required, Validators.maxLength(16)],
      }),
      firstName: new FormControl(bankCardRawValue.firstName, {
        validators: [Validators.required, Validators.maxLength(50)],
      }),
      lastName: new FormControl(bankCardRawValue.lastName, {
        validators: [Validators.required, Validators.maxLength(50)],
      }),
      cvv: new FormControl(bankCardRawValue.cvv, {
        validators: [Validators.required, Validators.maxLength(3)],
      }),
    });
  }

  getBankCard(form: BankCardFormGroup): IBankCard | NewBankCard {
    return form.getRawValue() as IBankCard | NewBankCard;
  }

  resetForm(form: BankCardFormGroup, bankCard: BankCardFormGroupInput): void {
    const bankCardRawValue = { ...this.getFormDefaults(), ...bankCard };
    form.reset(
      {
        ...bankCardRawValue,
        id: { value: bankCardRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): BankCardFormDefaults {
    return {
      id: null,
    };
  }
}
