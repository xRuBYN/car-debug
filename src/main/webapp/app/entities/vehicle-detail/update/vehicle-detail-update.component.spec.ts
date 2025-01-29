import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { VehicleDetailService } from '../service/vehicle-detail.service';
import { IVehicleDetail } from '../vehicle-detail.model';
import { VehicleDetailFormService } from './vehicle-detail-form.service';

import { VehicleDetailUpdateComponent } from './vehicle-detail-update.component';

describe('VehicleDetail Management Update Component', () => {
  let comp: VehicleDetailUpdateComponent;
  let fixture: ComponentFixture<VehicleDetailUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let vehicleDetailFormService: VehicleDetailFormService;
  let vehicleDetailService: VehicleDetailService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [VehicleDetailUpdateComponent],
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
      .overrideTemplate(VehicleDetailUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(VehicleDetailUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    vehicleDetailFormService = TestBed.inject(VehicleDetailFormService);
    vehicleDetailService = TestBed.inject(VehicleDetailService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const vehicleDetail: IVehicleDetail = { id: 456 };

      activatedRoute.data = of({ vehicleDetail });
      comp.ngOnInit();

      expect(comp.vehicleDetail).toEqual(vehicleDetail);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IVehicleDetail>>();
      const vehicleDetail = { id: 123 };
      jest.spyOn(vehicleDetailFormService, 'getVehicleDetail').mockReturnValue(vehicleDetail);
      jest.spyOn(vehicleDetailService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ vehicleDetail });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: vehicleDetail }));
      saveSubject.complete();

      // THEN
      expect(vehicleDetailFormService.getVehicleDetail).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(vehicleDetailService.update).toHaveBeenCalledWith(expect.objectContaining(vehicleDetail));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IVehicleDetail>>();
      const vehicleDetail = { id: 123 };
      jest.spyOn(vehicleDetailFormService, 'getVehicleDetail').mockReturnValue({ id: null });
      jest.spyOn(vehicleDetailService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ vehicleDetail: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: vehicleDetail }));
      saveSubject.complete();

      // THEN
      expect(vehicleDetailFormService.getVehicleDetail).toHaveBeenCalled();
      expect(vehicleDetailService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IVehicleDetail>>();
      const vehicleDetail = { id: 123 };
      jest.spyOn(vehicleDetailService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ vehicleDetail });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(vehicleDetailService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
