import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { IVehicleDetail, NewVehicleDetail } from '../vehicle-detail.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IVehicleDetail for edit and NewVehicleDetailFormGroupInput for create.
 */
type VehicleDetailFormGroupInput = IVehicleDetail | PartialWithRequiredKeyOf<NewVehicleDetail>;

type VehicleDetailFormDefaults = Pick<NewVehicleDetail, 'id'>;

type VehicleDetailFormGroupContent = {
  id: FormControl<IVehicleDetail['id'] | NewVehicleDetail['id']>;
  color: FormControl<IVehicleDetail['color']>;
  engineDescription: FormControl<IVehicleDetail['engineDescription']>;
  fuelType: FormControl<IVehicleDetail['fuelType']>;
};

export type VehicleDetailFormGroup = FormGroup<VehicleDetailFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class VehicleDetailFormService {
  createVehicleDetailFormGroup(vehicleDetail: VehicleDetailFormGroupInput = { id: null }): VehicleDetailFormGroup {
    const vehicleDetailRawValue = {
      ...this.getFormDefaults(),
      ...vehicleDetail,
    };
    return new FormGroup<VehicleDetailFormGroupContent>({
      id: new FormControl(
        { value: vehicleDetailRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      color: new FormControl(vehicleDetailRawValue.color),
      engineDescription: new FormControl(vehicleDetailRawValue.engineDescription),
      fuelType: new FormControl(vehicleDetailRawValue.fuelType),
    });
  }

  getVehicleDetail(form: VehicleDetailFormGroup): IVehicleDetail | NewVehicleDetail {
    return form.getRawValue() as IVehicleDetail | NewVehicleDetail;
  }

  resetForm(form: VehicleDetailFormGroup, vehicleDetail: VehicleDetailFormGroupInput): void {
    const vehicleDetailRawValue = { ...this.getFormDefaults(), ...vehicleDetail };
    form.reset(
      {
        ...vehicleDetailRawValue,
        id: { value: vehicleDetailRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): VehicleDetailFormDefaults {
    return {
      id: null,
    };
  }
}
