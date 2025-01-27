import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IAccident } from '../accident.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../accident.test-samples';

import { AccidentService, RestAccident } from './accident.service';

const requireRestSample: RestAccident = {
  ...sampleWithRequiredData,
  createdDate: sampleWithRequiredData.createdDate?.toJSON(),
  lastModifiedDate: sampleWithRequiredData.lastModifiedDate?.toJSON(),
};

describe('Accident Service', () => {
  let service: AccidentService;
  let httpMock: HttpTestingController;
  let expectedResult: IAccident | IAccident[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(AccidentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Accident', () => {
      const accident = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(accident).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Accident', () => {
      const accident = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(accident).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Accident', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Accident', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Accident', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addAccidentToCollectionIfMissing', () => {
      it('should add a Accident to an empty array', () => {
        const accident: IAccident = sampleWithRequiredData;
        expectedResult = service.addAccidentToCollectionIfMissing([], accident);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(accident);
      });

      it('should not add a Accident to an array that contains it', () => {
        const accident: IAccident = sampleWithRequiredData;
        const accidentCollection: IAccident[] = [
          {
            ...accident,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addAccidentToCollectionIfMissing(accidentCollection, accident);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Accident to an array that doesn't contain it", () => {
        const accident: IAccident = sampleWithRequiredData;
        const accidentCollection: IAccident[] = [sampleWithPartialData];
        expectedResult = service.addAccidentToCollectionIfMissing(accidentCollection, accident);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(accident);
      });

      it('should add only unique Accident to an array', () => {
        const accidentArray: IAccident[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const accidentCollection: IAccident[] = [sampleWithRequiredData];
        expectedResult = service.addAccidentToCollectionIfMissing(accidentCollection, ...accidentArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const accident: IAccident = sampleWithRequiredData;
        const accident2: IAccident = sampleWithPartialData;
        expectedResult = service.addAccidentToCollectionIfMissing([], accident, accident2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(accident);
        expect(expectedResult).toContain(accident2);
      });

      it('should accept null and undefined values', () => {
        const accident: IAccident = sampleWithRequiredData;
        expectedResult = service.addAccidentToCollectionIfMissing([], null, accident, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(accident);
      });

      it('should return initial array if no Accident is added', () => {
        const accidentCollection: IAccident[] = [sampleWithRequiredData];
        expectedResult = service.addAccidentToCollectionIfMissing(accidentCollection, undefined, null);
        expect(expectedResult).toEqual(accidentCollection);
      });
    });

    describe('compareAccident', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareAccident(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareAccident(entity1, entity2);
        const compareResult2 = service.compareAccident(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareAccident(entity1, entity2);
        const compareResult2 = service.compareAccident(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareAccident(entity1, entity2);
        const compareResult2 = service.compareAccident(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
