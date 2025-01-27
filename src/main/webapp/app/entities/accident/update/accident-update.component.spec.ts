import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { IVehicle } from 'app/entities/vehicle/vehicle.model';
import { VehicleService } from 'app/entities/vehicle/service/vehicle.service';
import { AccidentService } from '../service/accident.service';
import { IAccident } from '../accident.model';
import { AccidentFormService } from './accident-form.service';

import { AccidentUpdateComponent } from './accident-update.component';

describe('Accident Management Update Component', () => {
  let comp: AccidentUpdateComponent;
  let fixture: ComponentFixture<AccidentUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let accidentFormService: AccidentFormService;
  let accidentService: AccidentService;
  let vehicleService: VehicleService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AccidentUpdateComponent],
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
      .overrideTemplate(AccidentUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AccidentUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    accidentFormService = TestBed.inject(AccidentFormService);
    accidentService = TestBed.inject(AccidentService);
    vehicleService = TestBed.inject(VehicleService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Vehicle query and add missing value', () => {
      const accident: IAccident = { id: 456 };
      const vehicle: IVehicle = { vin: '012745df-db0f-440b-aa4e-7589045feb77' };
      accident.vehicle = vehicle;

      const vehicleCollection: IVehicle[] = [{ vin: '9d153674-24ac-46f3-a44a-02fd9a443184' }];
      jest.spyOn(vehicleService, 'query').mockReturnValue(of(new HttpResponse({ body: vehicleCollection })));
      const additionalVehicles = [vehicle];
      const expectedCollection: IVehicle[] = [...additionalVehicles, ...vehicleCollection];
      jest.spyOn(vehicleService, 'addVehicleToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ accident });
      comp.ngOnInit();

      expect(vehicleService.query).toHaveBeenCalled();
      expect(vehicleService.addVehicleToCollectionIfMissing).toHaveBeenCalledWith(
        vehicleCollection,
        ...additionalVehicles.map(expect.objectContaining),
      );
      expect(comp.vehiclesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const accident: IAccident = { id: 456 };
      const vehicle: IVehicle = { vin: '84815465-2cd6-4739-87c8-064b349b87bd' };
      accident.vehicle = vehicle;

      activatedRoute.data = of({ accident });
      comp.ngOnInit();

      expect(comp.vehiclesSharedCollection).toContain(vehicle);
      expect(comp.accident).toEqual(accident);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAccident>>();
      const accident = { id: 123 };
      jest.spyOn(accidentFormService, 'getAccident').mockReturnValue(accident);
      jest.spyOn(accidentService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ accident });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: accident }));
      saveSubject.complete();

      // THEN
      expect(accidentFormService.getAccident).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(accidentService.update).toHaveBeenCalledWith(expect.objectContaining(accident));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAccident>>();
      const accident = { id: 123 };
      jest.spyOn(accidentFormService, 'getAccident').mockReturnValue({ id: null });
      jest.spyOn(accidentService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ accident: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: accident }));
      saveSubject.complete();

      // THEN
      expect(accidentFormService.getAccident).toHaveBeenCalled();
      expect(accidentService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAccident>>();
      const accident = { id: 123 };
      jest.spyOn(accidentService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ accident });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(accidentService.update).toHaveBeenCalled();
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
