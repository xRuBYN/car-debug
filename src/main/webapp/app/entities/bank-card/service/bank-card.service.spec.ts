import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IBankCard } from '../bank-card.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../bank-card.test-samples';

import { BankCardService } from './bank-card.service';

const requireRestSample: IBankCard = {
  ...sampleWithRequiredData,
};

describe('BankCard Service', () => {
  let service: BankCardService;
  let httpMock: HttpTestingController;
  let expectedResult: IBankCard | IBankCard[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(BankCardService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find('9fec3727-3421-4967-b213-ba36557ca194').subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a BankCard', () => {
      const bankCard = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(bankCard).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a BankCard', () => {
      const bankCard = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(bankCard).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a BankCard', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of BankCard', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a BankCard', () => {
      const expected = true;

      service.delete('9fec3727-3421-4967-b213-ba36557ca194').subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addBankCardToCollectionIfMissing', () => {
      it('should add a BankCard to an empty array', () => {
        const bankCard: IBankCard = sampleWithRequiredData;
        expectedResult = service.addBankCardToCollectionIfMissing([], bankCard);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(bankCard);
      });

      it('should not add a BankCard to an array that contains it', () => {
        const bankCard: IBankCard = sampleWithRequiredData;
        const bankCardCollection: IBankCard[] = [
          {
            ...bankCard,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addBankCardToCollectionIfMissing(bankCardCollection, bankCard);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a BankCard to an array that doesn't contain it", () => {
        const bankCard: IBankCard = sampleWithRequiredData;
        const bankCardCollection: IBankCard[] = [sampleWithPartialData];
        expectedResult = service.addBankCardToCollectionIfMissing(bankCardCollection, bankCard);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(bankCard);
      });

      it('should add only unique BankCard to an array', () => {
        const bankCardArray: IBankCard[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const bankCardCollection: IBankCard[] = [sampleWithRequiredData];
        expectedResult = service.addBankCardToCollectionIfMissing(bankCardCollection, ...bankCardArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const bankCard: IBankCard = sampleWithRequiredData;
        const bankCard2: IBankCard = sampleWithPartialData;
        expectedResult = service.addBankCardToCollectionIfMissing([], bankCard, bankCard2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(bankCard);
        expect(expectedResult).toContain(bankCard2);
      });

      it('should accept null and undefined values', () => {
        const bankCard: IBankCard = sampleWithRequiredData;
        expectedResult = service.addBankCardToCollectionIfMissing([], null, bankCard, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(bankCard);
      });

      it('should return initial array if no BankCard is added', () => {
        const bankCardCollection: IBankCard[] = [sampleWithRequiredData];
        expectedResult = service.addBankCardToCollectionIfMissing(bankCardCollection, undefined, null);
        expect(expectedResult).toEqual(bankCardCollection);
      });
    });

    describe('compareBankCard', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareBankCard(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        const entity2 = null;

        const compareResult1 = service.compareBankCard(entity1, entity2);
        const compareResult2 = service.compareBankCard(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        const entity2 = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };

        const compareResult1 = service.compareBankCard(entity1, entity2);
        const compareResult2 = service.compareBankCard(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        const entity2 = { id: '9fec3727-3421-4967-b213-ba36557ca194' };

        const compareResult1 = service.compareBankCard(entity1, entity2);
        const compareResult2 = service.compareBankCard(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
