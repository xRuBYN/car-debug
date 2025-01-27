import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../vehicle.test-samples';

import { VehicleFormService } from './vehicle-form.service';

describe('Vehicle Form Service', () => {
  let service: VehicleFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VehicleFormService);
  });

  describe('Service methods', () => {
    describe('createVehicleFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createVehicleFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            vin: expect.any(Object),
            make: expect.any(Object),
            model: expect.any(Object),
            year: expect.any(Object),
          }),
        );
      });

      it('passing IVehicle should create a new form with FormGroup', () => {
        const formGroup = service.createVehicleFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            vin: expect.any(Object),
            make: expect.any(Object),
            model: expect.any(Object),
            year: expect.any(Object),
          }),
        );
      });
    });

    describe('getVehicle', () => {
      it('should return NewVehicle for default Vehicle initial value', () => {
        const formGroup = service.createVehicleFormGroup(sampleWithNewData);

        const vehicle = service.getVehicle(formGroup) as any;

        expect(vehicle).toMatchObject(sampleWithNewData);
      });

      it('should return NewVehicle for empty Vehicle initial value', () => {
        const formGroup = service.createVehicleFormGroup();

        const vehicle = service.getVehicle(formGroup) as any;

        expect(vehicle).toMatchObject({});
      });

      it('should return IVehicle', () => {
        const formGroup = service.createVehicleFormGroup(sampleWithRequiredData);

        const vehicle = service.getVehicle(formGroup) as any;

        expect(vehicle).toMatchObject(sampleWithRequiredData);
      });
    });
  });
});
