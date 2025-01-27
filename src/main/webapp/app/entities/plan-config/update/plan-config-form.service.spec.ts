import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../plan-config.test-samples';

import { PlanConfigFormService } from './plan-config-form.service';

describe('PlanConfig Form Service', () => {
  let service: PlanConfigFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlanConfigFormService);
  });

  describe('Service methods', () => {
    describe('createPlanConfigFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createPlanConfigFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            price: expect.any(Object),
            attempts: expect.any(Object),
          }),
        );
      });

      it('passing IPlanConfig should create a new form with FormGroup', () => {
        const formGroup = service.createPlanConfigFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            price: expect.any(Object),
            attempts: expect.any(Object),
          }),
        );
      });
    });

    describe('getPlanConfig', () => {
      it('should return NewPlanConfig for default PlanConfig initial value', () => {
        const formGroup = service.createPlanConfigFormGroup(sampleWithNewData);

        const planConfig = service.getPlanConfig(formGroup) as any;

        expect(planConfig).toMatchObject(sampleWithNewData);
      });

      it('should return NewPlanConfig for empty PlanConfig initial value', () => {
        const formGroup = service.createPlanConfigFormGroup();

        const planConfig = service.getPlanConfig(formGroup) as any;

        expect(planConfig).toMatchObject({});
      });

      it('should return IPlanConfig', () => {
        const formGroup = service.createPlanConfigFormGroup(sampleWithRequiredData);

        const planConfig = service.getPlanConfig(formGroup) as any;

        expect(planConfig).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IPlanConfig should not enable id FormControl', () => {
        const formGroup = service.createPlanConfigFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewPlanConfig should disable id FormControl', () => {
        const formGroup = service.createPlanConfigFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
