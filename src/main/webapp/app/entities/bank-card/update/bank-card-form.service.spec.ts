import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../bank-card.test-samples';

import { BankCardFormService } from './bank-card-form.service';

describe('BankCard Form Service', () => {
  let service: BankCardFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BankCardFormService);
  });

  describe('Service methods', () => {
    describe('createBankCardFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createBankCardFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            cardCode: expect.any(Object),
            firstName: expect.any(Object),
            lastName: expect.any(Object),
            cvv: expect.any(Object),
          }),
        );
      });

      it('passing IBankCard should create a new form with FormGroup', () => {
        const formGroup = service.createBankCardFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            cardCode: expect.any(Object),
            firstName: expect.any(Object),
            lastName: expect.any(Object),
            cvv: expect.any(Object),
          }),
        );
      });
    });

    describe('getBankCard', () => {
      it('should return NewBankCard for default BankCard initial value', () => {
        const formGroup = service.createBankCardFormGroup(sampleWithNewData);

        const bankCard = service.getBankCard(formGroup) as any;

        expect(bankCard).toMatchObject(sampleWithNewData);
      });

      it('should return NewBankCard for empty BankCard initial value', () => {
        const formGroup = service.createBankCardFormGroup();

        const bankCard = service.getBankCard(formGroup) as any;

        expect(bankCard).toMatchObject({});
      });

      it('should return IBankCard', () => {
        const formGroup = service.createBankCardFormGroup(sampleWithRequiredData);

        const bankCard = service.getBankCard(formGroup) as any;

        expect(bankCard).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IBankCard should not enable id FormControl', () => {
        const formGroup = service.createBankCardFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewBankCard should disable id FormControl', () => {
        const formGroup = service.createBankCardFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
