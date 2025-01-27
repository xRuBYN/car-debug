import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../order-history.test-samples';

import { OrderHistoryFormService } from './order-history-form.service';

describe('OrderHistory Form Service', () => {
  let service: OrderHistoryFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrderHistoryFormService);
  });

  describe('Service methods', () => {
    describe('createOrderHistoryFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createOrderHistoryFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            userId: expect.any(Object),
            planType: expect.any(Object),
            amount: expect.any(Object),
            createdBy: expect.any(Object),
            createdDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
          }),
        );
      });

      it('passing IOrderHistory should create a new form with FormGroup', () => {
        const formGroup = service.createOrderHistoryFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            userId: expect.any(Object),
            planType: expect.any(Object),
            amount: expect.any(Object),
            createdBy: expect.any(Object),
            createdDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
          }),
        );
      });
    });

    describe('getOrderHistory', () => {
      it('should return NewOrderHistory for default OrderHistory initial value', () => {
        const formGroup = service.createOrderHistoryFormGroup(sampleWithNewData);

        const orderHistory = service.getOrderHistory(formGroup) as any;

        expect(orderHistory).toMatchObject(sampleWithNewData);
      });

      it('should return NewOrderHistory for empty OrderHistory initial value', () => {
        const formGroup = service.createOrderHistoryFormGroup();

        const orderHistory = service.getOrderHistory(formGroup) as any;

        expect(orderHistory).toMatchObject({});
      });

      it('should return IOrderHistory', () => {
        const formGroup = service.createOrderHistoryFormGroup(sampleWithRequiredData);

        const orderHistory = service.getOrderHistory(formGroup) as any;

        expect(orderHistory).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IOrderHistory should not enable id FormControl', () => {
        const formGroup = service.createOrderHistoryFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewOrderHistory should disable id FormControl', () => {
        const formGroup = service.createOrderHistoryFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
