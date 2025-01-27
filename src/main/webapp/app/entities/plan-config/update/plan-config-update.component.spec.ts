import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { PlanConfigService } from '../service/plan-config.service';
import { IPlanConfig } from '../plan-config.model';
import { PlanConfigFormService } from './plan-config-form.service';

import { PlanConfigUpdateComponent } from './plan-config-update.component';

describe('PlanConfig Management Update Component', () => {
  let comp: PlanConfigUpdateComponent;
  let fixture: ComponentFixture<PlanConfigUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let planConfigFormService: PlanConfigFormService;
  let planConfigService: PlanConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PlanConfigUpdateComponent],
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
      .overrideTemplate(PlanConfigUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PlanConfigUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    planConfigFormService = TestBed.inject(PlanConfigFormService);
    planConfigService = TestBed.inject(PlanConfigService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const planConfig: IPlanConfig = { id: 456 };

      activatedRoute.data = of({ planConfig });
      comp.ngOnInit();

      expect(comp.planConfig).toEqual(planConfig);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPlanConfig>>();
      const planConfig = { id: 123 };
      jest.spyOn(planConfigFormService, 'getPlanConfig').mockReturnValue(planConfig);
      jest.spyOn(planConfigService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ planConfig });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: planConfig }));
      saveSubject.complete();

      // THEN
      expect(planConfigFormService.getPlanConfig).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(planConfigService.update).toHaveBeenCalledWith(expect.objectContaining(planConfig));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPlanConfig>>();
      const planConfig = { id: 123 };
      jest.spyOn(planConfigFormService, 'getPlanConfig').mockReturnValue({ id: null });
      jest.spyOn(planConfigService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ planConfig: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: planConfig }));
      saveSubject.complete();

      // THEN
      expect(planConfigFormService.getPlanConfig).toHaveBeenCalled();
      expect(planConfigService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPlanConfig>>();
      const planConfig = { id: 123 };
      jest.spyOn(planConfigService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ planConfig });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(planConfigService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
