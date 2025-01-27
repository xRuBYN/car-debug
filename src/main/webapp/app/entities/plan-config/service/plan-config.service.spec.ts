import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IPlanConfig } from '../plan-config.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../plan-config.test-samples';

import { PlanConfigService } from './plan-config.service';

const requireRestSample: IPlanConfig = {
  ...sampleWithRequiredData,
};

describe('PlanConfig Service', () => {
  let service: PlanConfigService;
  let httpMock: HttpTestingController;
  let expectedResult: IPlanConfig | IPlanConfig[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(PlanConfigService);
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

    it('should create a PlanConfig', () => {
      const planConfig = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(planConfig).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a PlanConfig', () => {
      const planConfig = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(planConfig).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a PlanConfig', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of PlanConfig', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a PlanConfig', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addPlanConfigToCollectionIfMissing', () => {
      it('should add a PlanConfig to an empty array', () => {
        const planConfig: IPlanConfig = sampleWithRequiredData;
        expectedResult = service.addPlanConfigToCollectionIfMissing([], planConfig);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(planConfig);
      });

      it('should not add a PlanConfig to an array that contains it', () => {
        const planConfig: IPlanConfig = sampleWithRequiredData;
        const planConfigCollection: IPlanConfig[] = [
          {
            ...planConfig,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addPlanConfigToCollectionIfMissing(planConfigCollection, planConfig);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a PlanConfig to an array that doesn't contain it", () => {
        const planConfig: IPlanConfig = sampleWithRequiredData;
        const planConfigCollection: IPlanConfig[] = [sampleWithPartialData];
        expectedResult = service.addPlanConfigToCollectionIfMissing(planConfigCollection, planConfig);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(planConfig);
      });

      it('should add only unique PlanConfig to an array', () => {
        const planConfigArray: IPlanConfig[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const planConfigCollection: IPlanConfig[] = [sampleWithRequiredData];
        expectedResult = service.addPlanConfigToCollectionIfMissing(planConfigCollection, ...planConfigArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const planConfig: IPlanConfig = sampleWithRequiredData;
        const planConfig2: IPlanConfig = sampleWithPartialData;
        expectedResult = service.addPlanConfigToCollectionIfMissing([], planConfig, planConfig2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(planConfig);
        expect(expectedResult).toContain(planConfig2);
      });

      it('should accept null and undefined values', () => {
        const planConfig: IPlanConfig = sampleWithRequiredData;
        expectedResult = service.addPlanConfigToCollectionIfMissing([], null, planConfig, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(planConfig);
      });

      it('should return initial array if no PlanConfig is added', () => {
        const planConfigCollection: IPlanConfig[] = [sampleWithRequiredData];
        expectedResult = service.addPlanConfigToCollectionIfMissing(planConfigCollection, undefined, null);
        expect(expectedResult).toEqual(planConfigCollection);
      });
    });

    describe('comparePlanConfig', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.comparePlanConfig(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.comparePlanConfig(entity1, entity2);
        const compareResult2 = service.comparePlanConfig(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.comparePlanConfig(entity1, entity2);
        const compareResult2 = service.comparePlanConfig(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.comparePlanConfig(entity1, entity2);
        const compareResult2 = service.comparePlanConfig(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
