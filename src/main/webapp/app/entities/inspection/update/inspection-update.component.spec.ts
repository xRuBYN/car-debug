import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { IVehicle } from 'app/entities/vehicle/vehicle.model';
import { VehicleService } from 'app/entities/vehicle/service/vehicle.service';
import { InspectionService } from '../service/inspection.service';
import { IInspection } from '../inspection.model';
import { InspectionFormService } from './inspection-form.service';

import { InspectionUpdateComponent } from './inspection-update.component';

describe('Inspection Management Update Component', () => {
  let comp: InspectionUpdateComponent;
  let fixture: ComponentFixture<InspectionUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let inspectionFormService: InspectionFormService;
  let inspectionService: InspectionService;
  let vehicleService: VehicleService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [InspectionUpdateComponent],
      providers: [
        provideHttpClient(),
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(InspectionUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(InspectionUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    inspectionFormService = TestBed.inject(InspectionFormService);
    inspectionService = TestBed.inject(InspectionService);
    vehicleService = TestBed.inject(VehicleService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Vehicle query and add missing value', () => {
      const inspection: IInspection = { id: 456 };
      const vehicle: IVehicle = { vin: '5ad0f83b-4f11-402c-9322-ec9896559b96' };
      inspection.vehicle = vehicle;

      const vehicleCollection: IVehicle[] = [{ vin: '62757063-d27c-4f2f-844f-453f997cfb3e' }];
      jest.spyOn(vehicleService, 'query').mockReturnValue(of(new HttpResponse({ body: vehicleCollection })));
      const additionalVehicles = [vehicle];
      const expectedCollection: IVehicle[] = [...additionalVehicles, ...vehicleCollection];
      jest.spyOn(vehicleService, 'addVehicleToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ inspection });
      comp.ngOnInit();

      expect(vehicleService.query).toHaveBeenCalled();
      expect(vehicleService.addVehicleToCollectionIfMissing).toHaveBeenCalledWith(
        vehicleCollection,
        ...additionalVehicles.map(expect.objectContaining),
      );
      expect(comp.vehiclesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const inspection: IInspection = { id: 456 };
      const vehicle: IVehicle = { vin: 'fa0bbc0a-bd91-4a9b-87cc-b84b55820388' };
      inspection.vehicle = vehicle;

      activatedRoute.data = of({ inspection });
      comp.ngOnInit();

      expect(comp.vehiclesSharedCollection).toContain(vehicle);
      expect(comp.inspection).toEqual(inspection);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IInspection>>();
      const inspection = { id: 123 };
      jest.spyOn(inspectionFormService, 'getInspection').mockReturnValue(inspection);
      jest.spyOn(inspectionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ inspection });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: inspection }));
      saveSubject.complete();

      // THEN
      expect(inspectionFormService.getInspection).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(inspectionService.update).toHaveBeenCalledWith(expect.objectContaining(inspection));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IInspection>>();
      const inspection = { id: 123 };
      jest.spyOn(inspectionFormService, 'getInspection').mockReturnValue({ id: null });
      jest.spyOn(inspectionService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ inspection: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: inspection }));
      saveSubject.complete();

      // THEN
      expect(inspectionFormService.getInspection).toHaveBeenCalled();
      expect(inspectionService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IInspection>>();
      const inspection = { id: 123 };
      jest.spyOn(inspectionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ inspection });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(inspectionService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareVehicle', () => {
      it('Should forward to vehicleService', () => {
        const entity = { vin: 'ABC' };
        const entity2 = { vin: 'CBA' };
        jest.spyOn(vehicleService, 'compareVehicle');
        comp.compareVehicle(entity, entity2);
        expect(vehicleService.compareVehicle).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
