import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../accident.test-samples';

import { AccidentFormService } from './accident-form.service';

describe('Accident Form Service', () => {
  let service: AccidentFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccidentFormService);
  });

  describe('Service methods', () => {
    describe('createAccidentFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createAccidentFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            description: expect.any(Object),
            createdBy: expect.any(Object),
            createdDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
            vehicle: expect.any(Object),
          }),
        );
      });

      it('passing IAccident should create a new form with FormGroup', () => {
        const formGroup = service.createAccidentFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            description: expect.any(Object),
            createdBy: expect.any(Object),
            createdDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
            vehicle: expect.any(Object),
          }),
        );
      });
    });

    describe('getAccident', () => {
      it('should return NewAccident for default Accident initial value', () => {
        const formGroup = service.createAccidentFormGroup(sampleWithNewData);

        const accident = service.getAccident(formGroup) as any;

        expect(accident).toMatchObject(sampleWithNewData);
      });

      it('should return NewAccident for empty Accident initial value', () => {
        const formGroup = service.createAccidentFormGroup();

        const accident = service.getAccident(formGroup) as any;

        expect(accident).toMatchObject({});
      });

      it('should return IAccident', () => {
        const formGroup = service.createAccidentFormGroup(sampleWithRequiredData);

        const accident = service.getAccident(formGroup) as any;

        expect(accident).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IAccident should not enable id FormControl', () => {
        const formGroup = service.createAccidentFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewAccident should disable id FormControl', () => {
        const formGroup = service.createAccidentFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
