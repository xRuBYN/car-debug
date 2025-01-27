import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { IVehicle, NewVehicle } from '../vehicle.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { vin: unknown }> = Partial<Omit<T, 'vin'>> & { vin: T['vin'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IVehicle for edit and NewVehicleFormGroupInput for create.
 */
type VehicleFormGroupInput = IVehicle | PartialWithRequiredKeyOf<NewVehicle>;

type VehicleFormDefaults = Pick<NewVehicle, 'vin'>;

type VehicleFormGroupContent = {
  vin: FormControl<IVehicle['vin'] | NewVehicle['vin']>;
  make: FormControl<IVehicle['make']>;
  model: FormControl<IVehicle['model']>;
  year: FormControl<IVehicle['year']>;
};

export type VehicleFormGroup = FormGroup<VehicleFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class VehicleFormService {
  createVehicleFormGroup(vehicle: VehicleFormGroupInput = { vin: null }): VehicleFormGroup {
    const vehicleRawValue = {
      ...this.getFormDefaults(),
      ...vehicle,
    };
    return new FormGroup<VehicleFormGroupContent>({
      vin: new FormControl(
        { value: vehicleRawValue.vin, disabled: vehicleRawValue.vin !== null },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      make: new FormControl(vehicleRawValue.make, {
        validators: [Validators.required],
      }),
      model: new FormControl(vehicleRawValue.model, {
        validators: [Validators.required],
      }),
      year: new FormControl(vehicleRawValue.year, {
        validators: [Validators.required],
      }),
    });
  }

  getVehicle(form: VehicleFormGroup): IVehicle | NewVehicle {
    return form.getRawValue() as IVehicle | NewVehicle;
  }

  resetForm(form: VehicleFormGroup, vehicle: VehicleFormGroupInput): void {
    const vehicleRawValue = { ...this.getFormDefaults(), ...vehicle };
    form.reset(
      {
        ...vehicleRawValue,
        vin: { value: vehicleRawValue.vin, disabled: vehicleRawValue.vin !== null },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): VehicleFormDefaults {
    return {
      vin: null,
    };
  }
}
