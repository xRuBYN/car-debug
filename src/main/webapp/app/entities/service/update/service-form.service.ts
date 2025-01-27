import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IService, NewService } from '../service.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IService for edit and NewServiceFormGroupInput for create.
 */
type ServiceFormGroupInput = IService | PartialWithRequiredKeyOf<NewService>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IService | NewService> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

type ServiceFormRawValue = FormValueOf<IService>;

type NewServiceFormRawValue = FormValueOf<NewService>;

type ServiceFormDefaults = Pick<NewService, 'id' | 'createdDate' | 'lastModifiedDate'>;

type ServiceFormGroupContent = {
  id: FormControl<ServiceFormRawValue['id'] | NewService['id']>;
  name: FormControl<ServiceFormRawValue['name']>;
  description: FormControl<ServiceFormRawValue['description']>;
  price: FormControl<ServiceFormRawValue['price']>;
  createdBy: FormControl<ServiceFormRawValue['createdBy']>;
  createdDate: FormControl<ServiceFormRawValue['createdDate']>;
  lastModifiedBy: FormControl<ServiceFormRawValue['lastModifiedBy']>;
  lastModifiedDate: FormControl<ServiceFormRawValue['lastModifiedDate']>;
  vehicle: FormControl<ServiceFormRawValue['vehicle']>;
};

export type ServiceFormGroup = FormGroup<ServiceFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ServiceFormService {
  createServiceFormGroup(service: ServiceFormGroupInput = { id: null }): ServiceFormGroup {
    const serviceRawValue = this.convertServiceToServiceRawValue({
      ...this.getFormDefaults(),
      ...service,
    });
    return new FormGroup<ServiceFormGroupContent>({
      id: new FormControl(
        { value: serviceRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      name: new FormControl(serviceRawValue.name, {
        validators: [Validators.required],
      }),
      description: new FormControl(serviceRawValue.description),
      price: new FormControl(serviceRawValue.price, {
        validators: [Validators.required],
      }),
      createdBy: new FormControl(serviceRawValue.createdBy, {
        validators: [Validators.required, Validators.maxLength(50)],
      }),
      createdDate: new FormControl(serviceRawValue.createdDate, {
        validators: [Validators.required],
      }),
      lastModifiedBy: new FormControl(serviceRawValue.lastModifiedBy, {
        validators: [Validators.maxLength(50)],
      }),
      lastModifiedDate: new FormControl(serviceRawValue.lastModifiedDate),
      vehicle: new FormControl(serviceRawValue.vehicle),
    });
  }

  getService(form: ServiceFormGroup): IService | NewService {
    return this.convertServiceRawValueToService(form.getRawValue() as ServiceFormRawValue | NewServiceFormRawValue);
  }

  resetForm(form: ServiceFormGroup, service: ServiceFormGroupInput): void {
    const serviceRawValue = this.convertServiceToServiceRawValue({ ...this.getFormDefaults(), ...service });
    form.reset(
      {
        ...serviceRawValue,
        id: { value: serviceRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): ServiceFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      createdDate: currentTime,
      lastModifiedDate: currentTime,
    };
  }

  private convertServiceRawValueToService(rawService: ServiceFormRawValue | NewServiceFormRawValue): IService | NewService {
    return {
      ...rawService,
      createdDate: dayjs(rawService.createdDate, DATE_TIME_FORMAT),
      lastModifiedDate: dayjs(rawService.lastModifiedDate, DATE_TIME_FORMAT),
    };
  }

  private convertServiceToServiceRawValue(
    service: IService | (Partial<NewService> & ServiceFormDefaults),
  ): ServiceFormRawValue | PartialWithRequiredKeyOf<NewServiceFormRawValue> {
    return {
      ...service,
      createdDate: service.createdDate ? service.createdDate.format(DATE_TIME_FORMAT) : undefined,
      lastModifiedDate: service.lastModifiedDate ? service.lastModifiedDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
