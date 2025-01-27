import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { IPlanConfig, NewPlanConfig } from '../plan-config.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IPlanConfig for edit and NewPlanConfigFormGroupInput for create.
 */
type PlanConfigFormGroupInput = IPlanConfig | PartialWithRequiredKeyOf<NewPlanConfig>;

type PlanConfigFormDefaults = Pick<NewPlanConfig, 'id'>;

type PlanConfigFormGroupContent = {
  id: FormControl<IPlanConfig['id'] | NewPlanConfig['id']>;
  price: FormControl<IPlanConfig['price']>;
  attempts: FormControl<IPlanConfig['attempts']>;
};

export type PlanConfigFormGroup = FormGroup<PlanConfigFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class PlanConfigFormService {
  createPlanConfigFormGroup(planConfig: PlanConfigFormGroupInput = { id: null }): PlanConfigFormGroup {
    const planConfigRawValue = {
      ...this.getFormDefaults(),
      ...planConfig,
    };
    return new FormGroup<PlanConfigFormGroupContent>({
      id: new FormControl(
        { value: planConfigRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      price: new FormControl(planConfigRawValue.price, {
        validators: [Validators.required],
      }),
      attempts: new FormControl(planConfigRawValue.attempts, {
        validators: [Validators.required],
      }),
    });
  }

  getPlanConfig(form: PlanConfigFormGroup): IPlanConfig | NewPlanConfig {
    return form.getRawValue() as IPlanConfig | NewPlanConfig;
  }

  resetForm(form: PlanConfigFormGroup, planConfig: PlanConfigFormGroupInput): void {
    const planConfigRawValue = { ...this.getFormDefaults(), ...planConfig };
    form.reset(
      {
        ...planConfigRawValue,
        id: { value: planConfigRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): PlanConfigFormDefaults {
    return {
      id: null,
    };
  }
}
