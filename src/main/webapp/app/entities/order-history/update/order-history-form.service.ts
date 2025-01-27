import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IOrderHistory, NewOrderHistory } from '../order-history.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IOrderHistory for edit and NewOrderHistoryFormGroupInput for create.
 */
type OrderHistoryFormGroupInput = IOrderHistory | PartialWithRequiredKeyOf<NewOrderHistory>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IOrderHistory | NewOrderHistory> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

type OrderHistoryFormRawValue = FormValueOf<IOrderHistory>;

type NewOrderHistoryFormRawValue = FormValueOf<NewOrderHistory>;

type OrderHistoryFormDefaults = Pick<NewOrderHistory, 'id' | 'createdDate' | 'lastModifiedDate'>;

type OrderHistoryFormGroupContent = {
  id: FormControl<OrderHistoryFormRawValue['id'] | NewOrderHistory['id']>;
  userId: FormControl<OrderHistoryFormRawValue['userId']>;
  planType: FormControl<OrderHistoryFormRawValue['planType']>;
  amount: FormControl<OrderHistoryFormRawValue['amount']>;
  createdBy: FormControl<OrderHistoryFormRawValue['createdBy']>;
  createdDate: FormControl<OrderHistoryFormRawValue['createdDate']>;
  lastModifiedBy: FormControl<OrderHistoryFormRawValue['lastModifiedBy']>;
  lastModifiedDate: FormControl<OrderHistoryFormRawValue['lastModifiedDate']>;
};

export type OrderHistoryFormGroup = FormGroup<OrderHistoryFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class OrderHistoryFormService {
  createOrderHistoryFormGroup(orderHistory: OrderHistoryFormGroupInput = { id: null }): OrderHistoryFormGroup {
    const orderHistoryRawValue = this.convertOrderHistoryToOrderHistoryRawValue({
      ...this.getFormDefaults(),
      ...orderHistory,
    });
    return new FormGroup<OrderHistoryFormGroupContent>({
      id: new FormControl(
        { value: orderHistoryRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      userId: new FormControl(orderHistoryRawValue.userId, {
        validators: [Validators.required],
      }),
      planType: new FormControl(orderHistoryRawValue.planType, {
        validators: [Validators.required, Validators.maxLength(50)],
      }),
      amount: new FormControl(orderHistoryRawValue.amount, {
        validators: [Validators.required],
      }),
      createdBy: new FormControl(orderHistoryRawValue.createdBy, {
        validators: [Validators.required, Validators.maxLength(50)],
      }),
      createdDate: new FormControl(orderHistoryRawValue.createdDate, {
        validators: [Validators.required],
      }),
      lastModifiedBy: new FormControl(orderHistoryRawValue.lastModifiedBy, {
        validators: [Validators.maxLength(50)],
      }),
      lastModifiedDate: new FormControl(orderHistoryRawValue.lastModifiedDate),
    });
  }

  getOrderHistory(form: OrderHistoryFormGroup): IOrderHistory | NewOrderHistory {
    return this.convertOrderHistoryRawValueToOrderHistory(form.getRawValue() as OrderHistoryFormRawValue | NewOrderHistoryFormRawValue);
  }

  resetForm(form: OrderHistoryFormGroup, orderHistory: OrderHistoryFormGroupInput): void {
    const orderHistoryRawValue = this.convertOrderHistoryToOrderHistoryRawValue({ ...this.getFormDefaults(), ...orderHistory });
    form.reset(
      {
        ...orderHistoryRawValue,
        id: { value: orderHistoryRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): OrderHistoryFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      createdDate: currentTime,
      lastModifiedDate: currentTime,
    };
  }

  private convertOrderHistoryRawValueToOrderHistory(
    rawOrderHistory: OrderHistoryFormRawValue | NewOrderHistoryFormRawValue,
  ): IOrderHistory | NewOrderHistory {
    return {
      ...rawOrderHistory,
      createdDate: dayjs(rawOrderHistory.createdDate, DATE_TIME_FORMAT),
      lastModifiedDate: dayjs(rawOrderHistory.lastModifiedDate, DATE_TIME_FORMAT),
    };
  }

  private convertOrderHistoryToOrderHistoryRawValue(
    orderHistory: IOrderHistory | (Partial<NewOrderHistory> & OrderHistoryFormDefaults),
  ): OrderHistoryFormRawValue | PartialWithRequiredKeyOf<NewOrderHistoryFormRawValue> {
    return {
      ...orderHistory,
      createdDate: orderHistory.createdDate ? orderHistory.createdDate.format(DATE_TIME_FORMAT) : undefined,
      lastModifiedDate: orderHistory.lastModifiedDate ? orderHistory.lastModifiedDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
