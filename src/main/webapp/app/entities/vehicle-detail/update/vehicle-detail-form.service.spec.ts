import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../vehicle-detail.test-samples';

import { VehicleDetailFormService } from './vehicle-detail-form.service';

describe('VehicleDetail Form Service', () => {
  let service: VehicleDetailFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VehicleDetailFormService);
  });

  describe('Service methods', () => {
    describe('createVehicleDetailFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createVehicleDetailFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            color: expect.any(Object),
            engineDescription: expect.any(Object),
            fuelType: expect.any(Object),
          }),
        );
      });

      it('passing IVehicleDetail should create a new form with FormGroup', () => {
        const formGroup = service.createVehicleDetailFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            color: expect.any(Object),
            engineDescription: expect.any(Object),
            fuelType: expect.any(Object),
          }),
        );
      });
    });

    describe('getVehicleDetail', () => {
      it('should return NewVehicleDetail for default VehicleDetail initial value', () => {
        const formGroup = service.createVehicleDetailFormGroup(sampleWithNewData);

        const vehicleDetail = service.getVehicleDetail(formGroup) as any;

        expect(vehicleDetail).toMatchObject(sampleWithNewData);
      });

      it('should return NewVehicleDetail for empty VehicleDetail initial value', () => {
        const formGroup = service.createVehicleDetailFormGroup();

        const vehicleDetail = service.getVehicleDetail(formGroup) as any;

        expect(vehicleDetail).toMatchObject({});
      });

      it('should return IVehicleDetail', () => {
        const formGroup = service.createVehicleDetailFormGroup(sampleWithRequiredData);

        const vehicleDetail = service.getVehicleDetail(formGroup) as any;

        expect(vehicleDetail).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IVehicleDetail should not enable id FormControl', () => {
        const formGroup = service.createVehicleDetailFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewVehicleDetail should disable id FormControl', () => {
        const formGroup = service.createVehicleDetailFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
