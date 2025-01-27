import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { IVehicle } from 'app/entities/vehicle/vehicle.model';
import { VehicleService } from 'app/entities/vehicle/service/vehicle.service';
import { IInspection } from 'app/entities/inspection/inspection.model';
import { InspectionService } from 'app/entities/inspection/service/inspection.service';
import { IAccident } from 'app/entities/accident/accident.model';
import { AccidentService } from 'app/entities/accident/service/accident.service';
import { IService } from 'app/entities/service/service.model';
import { ServiceService } from 'app/entities/service/service/service.service';
import { IPhoto } from '../photo.model';
import { PhotoService } from '../service/photo.service';
import { PhotoFormService } from './photo-form.service';

import { PhotoUpdateComponent } from './photo-update.component';

describe('Photo Management Update Component', () => {
  let comp: PhotoUpdateComponent;
  let fixture: ComponentFixture<PhotoUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let photoFormService: PhotoFormService;
  let photoService: PhotoService;
  let vehicleService: VehicleService;
  let inspectionService: InspectionService;
  let accidentService: AccidentService;
  let serviceService: ServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PhotoUpdateComponent],
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
      .overrideTemplate(PhotoUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PhotoUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    photoFormService = TestBed.inject(PhotoFormService);
    photoService = TestBed.inject(PhotoService);
    vehicleService = TestBed.inject(VehicleService);
    inspectionService = TestBed.inject(InspectionService);
    accidentService = TestBed.inject(AccidentService);
    serviceService = TestBed.inject(ServiceService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Vehicle query and add missing value', () => {
      const photo: IPhoto = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };
      const vehicle: IVehicle = { vin: '87c71342-94e6-47a4-bb56-05c7001b19c1' };
      photo.vehicle = vehicle;

      const vehicleCollection: IVehicle[] = [{ vin: '35d506be-ac0a-4f27-9389-e5a3341322ce' }];
      jest.spyOn(vehicleService, 'query').mockReturnValue(of(new HttpResponse({ body: vehicleCollection })));
      const additionalVehicles = [vehicle];
      const expectedCollection: IVehicle[] = [...additionalVehicles, ...vehicleCollection];
      jest.spyOn(vehicleService, 'addVehicleToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ photo });
      comp.ngOnInit();

      expect(vehicleService.query).toHaveBeenCalled();
      expect(vehicleService.addVehicleToCollectionIfMissing).toHaveBeenCalledWith(
        vehicleCollection,
        ...additionalVehicles.map(expect.objectContaining),
      );
      expect(comp.vehiclesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Inspection query and add missing value', () => {
      const photo: IPhoto = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };
      const inspection: IInspection = { id: 196 };
      photo.inspection = inspection;

      const inspectionCollection: IInspection[] = [{ id: 5653 }];
      jest.spyOn(inspectionService, 'query').mockReturnValue(of(new HttpResponse({ body: inspectionCollection })));
      const additionalInspections = [inspection];
      const expectedCollection: IInspection[] = [...additionalInspections, ...inspectionCollection];
      jest.spyOn(inspectionService, 'addInspectionToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ photo });
      comp.ngOnInit();

      expect(inspectionService.query).toHaveBeenCalled();
      expect(inspectionService.addInspectionToCollectionIfMissing).toHaveBeenCalledWith(
        inspectionCollection,
        ...additionalInspections.map(expect.objectContaining),
      );
      expect(comp.inspectionsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Accident query and add missing value', () => {
      const photo: IPhoto = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };
      const accident: IAccident = { id: 12399 };
      photo.accident = accident;

      const accidentCollection: IAccident[] = [{ id: 10749 }];
      jest.spyOn(accidentService, 'query').mockReturnValue(of(new HttpResponse({ body: accidentCollection })));
      const additionalAccidents = [accident];
      const expectedCollection: IAccident[] = [...additionalAccidents, ...accidentCollection];
      jest.spyOn(accidentService, 'addAccidentToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ photo });
      comp.ngOnInit();

      expect(accidentService.query).toHaveBeenCalled();
      expect(accidentService.addAccidentToCollectionIfMissing).toHaveBeenCalledWith(
        accidentCollection,
        ...additionalAccidents.map(expect.objectContaining),
      );
      expect(comp.accidentsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Service query and add missing value', () => {
      const photo: IPhoto = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };
      const service: IService = { id: 24596 };
      photo.service = service;

      const serviceCollection: IService[] = [{ id: 7094 }];
      jest.spyOn(serviceService, 'query').mockReturnValue(of(new HttpResponse({ body: serviceCollection })));
      const additionalServices = [service];
      const expectedCollection: IService[] = [...additionalServices, ...serviceCollection];
      jest.spyOn(serviceService, 'addServiceToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ photo });
      comp.ngOnInit();

      expect(serviceService.query).toHaveBeenCalled();
      expect(serviceService.addServiceToCollectionIfMissing).toHaveBeenCalledWith(
        serviceCollection,
        ...additionalServices.map(expect.objectContaining),
      );
      expect(comp.servicesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const photo: IPhoto = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };
      const vehicle: IVehicle = { vin: '722258d4-5b16-4623-8fdf-3f24e10914fd' };
      photo.vehicle = vehicle;
      const inspection: IInspection = { id: 28559 };
      photo.inspection = inspection;
      const accident: IAccident = { id: 5687 };
      photo.accident = accident;
      const service: IService = { id: 30475 };
      photo.service = service;

      activatedRoute.data = of({ photo });
      comp.ngOnInit();

      expect(comp.vehiclesSharedCollection).toContain(vehicle);
      expect(comp.inspectionsSharedCollection).toContain(inspection);
      expect(comp.accidentsSharedCollection).toContain(accident);
      expect(comp.servicesSharedCollection).toContain(service);
      expect(comp.photo).toEqual(photo);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPhoto>>();
      const photo = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
      jest.spyOn(photoFormService, 'getPhoto').mockReturnValue(photo);
      jest.spyOn(photoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ photo });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: photo }));
      saveSubject.complete();

      // THEN
      expect(photoFormService.getPhoto).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(photoService.update).toHaveBeenCalledWith(expect.objectContaining(photo));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPhoto>>();
      const photo = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
      jest.spyOn(photoFormService, 'getPhoto').mockReturnValue({ id: null });
      jest.spyOn(photoService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ photo: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: photo }));
      saveSubject.complete();

      // THEN
      expect(photoFormService.getPhoto).toHaveBeenCalled();
      expect(photoService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPhoto>>();
      const photo = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
      jest.spyOn(photoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ photo });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(photoService.update).toHaveBeenCalled();
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

    describe('compareInspection', () => {
      it('Should forward to inspectionService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(inspectionService, 'compareInspection');
        comp.compareInspection(entity, entity2);
        expect(inspectionService.compareInspection).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareAccident', () => {
      it('Should forward to accidentService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(accidentService, 'compareAccident');
        comp.compareAccident(entity, entity2);
        expect(accidentService.compareAccident).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareService', () => {
      it('Should forward to serviceService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(serviceService, 'compareService');
        comp.compareService(entity, entity2);
        expect(serviceService.compareService).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
