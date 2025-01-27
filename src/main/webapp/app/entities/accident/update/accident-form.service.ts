import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IAccident, NewAccident } from '../accident.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IAccident for edit and NewAccidentFormGroupInput for create.
 */
type AccidentFormGroupInput = IAccident | PartialWithRequiredKeyOf<NewAccident>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IAccident | NewAccident> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

type AccidentFormRawValue = FormValueOf<IAccident>;

type NewAccidentFormRawValue = FormValueOf<NewAccident>;

type AccidentFormDefaults = Pick<NewAccident, 'id' | 'createdDate' | 'lastModifiedDate'>;

type AccidentFormGroupContent = {
  id: FormControl<AccidentFormRawValue['id'] | NewAccident['id']>;
  description: FormControl<AccidentFormRawValue['description']>;
  createdBy: FormControl<AccidentFormRawValue['createdBy']>;
  createdDate: FormControl<AccidentFormRawValue['createdDate']>;
  lastModifiedBy: FormControl<AccidentFormRawValue['lastModifiedBy']>;
  lastModifiedDate: FormControl<AccidentFormRawValue['lastModifiedDate']>;
  vehicle: FormControl<AccidentFormRawValue['vehicle']>;
};

export type AccidentFormGroup = FormGroup<AccidentFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class AccidentFormService {
  createAccidentFormGroup(accident: AccidentFormGroupInput = { id: null }): AccidentFormGroup {
    const accidentRawValue = this.convertAccidentToAccidentRawValue({
      ...this.getFormDefaults(),
      ...accident,
    });
    return new FormGroup<AccidentFormGroupContent>({
      id: new FormControl(
        { value: accidentRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      description: new FormControl(accidentRawValue.description),
      createdBy: new FormControl(accidentRawValue.createdBy, {
        validators: [Validators.required, Validators.maxLength(50)],
      }),
      createdDate: new FormControl(accidentRawValue.createdDate, {
        validators: [Validators.required],
      }),
      lastModifiedBy: new FormControl(accidentRawValue.lastModifiedBy, {
        validators: [Validators.maxLength(50)],
      }),
      lastModifiedDate: new FormControl(accidentRawValue.lastModifiedDate),
      vehicle: new FormControl(accidentRawValue.vehicle),
    });
  }

  getAccident(form: AccidentFormGroup): IAccident | NewAccident {
    return this.convertAccidentRawValueToAccident(form.getRawValue() as AccidentFormRawValue | NewAccidentFormRawValue);
  }

  resetForm(form: AccidentFormGroup, accident: AccidentFormGroupInput): void {
    const accidentRawValue = this.convertAccidentToAccidentRawValue({ ...this.getFormDefaults(), ...accident });
    form.reset(
      {
        ...accidentRawValue,
        id: { value: accidentRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): AccidentFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      createdDate: currentTime,
      lastModifiedDate: currentTime,
    };
  }

  private convertAccidentRawValueToAccident(rawAccident: AccidentFormRawValue | NewAccidentFormRawValue): IAccident | NewAccident {
    return {
      ...rawAccident,
      createdDate: dayjs(rawAccident.createdDate, DATE_TIME_FORMAT),
      lastModifiedDate: dayjs(rawAccident.lastModifiedDate, DATE_TIME_FORMAT),
    };
  }

  private convertAccidentToAccidentRawValue(
    accident: IAccident | (Partial<NewAccident> & AccidentFormDefaults),
  ): AccidentFormRawValue | PartialWithRequiredKeyOf<NewAccidentFormRawValue> {
    return {
      ...accident,
      createdDate: accident.createdDate ? accident.createdDate.format(DATE_TIME_FORMAT) : undefined,
      lastModifiedDate: accident.lastModifiedDate ? accident.lastModifiedDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
