import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IInspection, NewInspection } from '../inspection.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IInspection for edit and NewInspectionFormGroupInput for create.
 */
type InspectionFormGroupInput = IInspection | PartialWithRequiredKeyOf<NewInspection>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IInspection | NewInspection> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

type InspectionFormRawValue = FormValueOf<IInspection>;

type NewInspectionFormRawValue = FormValueOf<NewInspection>;

type InspectionFormDefaults = Pick<NewInspection, 'id' | 'createdDate' | 'lastModifiedDate'>;

type InspectionFormGroupContent = {
  id: FormControl<InspectionFormRawValue['id'] | NewInspection['id']>;
  description: FormControl<InspectionFormRawValue['description']>;
  createdBy: FormControl<InspectionFormRawValue['createdBy']>;
  createdDate: FormControl<InspectionFormRawValue['createdDate']>;
  lastModifiedBy: FormControl<InspectionFormRawValue['lastModifiedBy']>;
  lastModifiedDate: FormControl<InspectionFormRawValue['lastModifiedDate']>;
  vehicle: FormControl<InspectionFormRawValue['vehicle']>;
};

export type InspectionFormGroup = FormGroup<InspectionFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class InspectionFormService {
  createInspectionFormGroup(inspection: InspectionFormGroupInput = { id: null }): InspectionFormGroup {
    const inspectionRawValue = this.convertInspectionToInspectionRawValue({
      ...this.getFormDefaults(),
      ...inspection,
    });
    return new FormGroup<InspectionFormGroupContent>({
      id: new FormControl(
        { value: inspectionRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      description: new FormControl(inspectionRawValue.description),
      createdBy: new FormControl(inspectionRawValue.createdBy, {
        validators: [Validators.required, Validators.maxLength(50)],
      }),
      createdDate: new FormControl(inspectionRawValue.createdDate, {
        validators: [Validators.required],
      }),
      lastModifiedBy: new FormControl(inspectionRawValue.lastModifiedBy, {
        validators: [Validators.maxLength(50)],
      }),
      lastModifiedDate: new FormControl(inspectionRawValue.lastModifiedDate),
      vehicle: new FormControl(inspectionRawValue.vehicle),
    });
  }

  getInspection(form: InspectionFormGroup): IInspection | NewInspection {
    return this.convertInspectionRawValueToInspection(form.getRawValue() as InspectionFormRawValue | NewInspectionFormRawValue);
  }

  resetForm(form: InspectionFormGroup, inspection: InspectionFormGroupInput): void {
    const inspectionRawValue = this.convertInspectionToInspectionRawValue({ ...this.getFormDefaults(), ...inspection });
    form.reset(
      {
        ...inspectionRawValue,
        id: { value: inspectionRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): InspectionFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      createdDate: currentTime,
      lastModifiedDate: currentTime,
    };
  }

  private convertInspectionRawValueToInspection(
    rawInspection: InspectionFormRawValue | NewInspectionFormRawValue,
  ): IInspection | NewInspection {
    return {
      ...rawInspection,
      createdDate: dayjs(rawInspection.createdDate, DATE_TIME_FORMAT),
      lastModifiedDate: dayjs(rawInspection.lastModifiedDate, DATE_TIME_FORMAT),
    };
  }

  private convertInspectionToInspectionRawValue(
    inspection: IInspection | (Partial<NewInspection> & InspectionFormDefaults),
  ): InspectionFormRawValue | PartialWithRequiredKeyOf<NewInspectionFormRawValue> {
    return {
      ...inspection,
      createdDate: inspection.createdDate ? inspection.createdDate.format(DATE_TIME_FORMAT) : undefined,
      lastModifiedDate: inspection.lastModifiedDate ? inspection.lastModifiedDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
