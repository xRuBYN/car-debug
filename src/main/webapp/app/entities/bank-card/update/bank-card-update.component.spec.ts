import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { BankCardService } from '../service/bank-card.service';
import { IBankCard } from '../bank-card.model';
import { BankCardFormService } from './bank-card-form.service';

import { BankCardUpdateComponent } from './bank-card-update.component';

describe('BankCard Management Update Component', () => {
  let comp: BankCardUpdateComponent;
  let fixture: ComponentFixture<BankCardUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let bankCardFormService: BankCardFormService;
  let bankCardService: BankCardService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BankCardUpdateComponent],
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
      .overrideTemplate(BankCardUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(BankCardUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    bankCardFormService = TestBed.inject(BankCardFormService);
    bankCardService = TestBed.inject(BankCardService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const bankCard: IBankCard = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };

      activatedRoute.data = of({ bankCard });
      comp.ngOnInit();

      expect(comp.bankCard).toEqual(bankCard);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBankCard>>();
      const bankCard = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
      jest.spyOn(bankCardFormService, 'getBankCard').mockReturnValue(bankCard);
      jest.spyOn(bankCardService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ bankCard });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: bankCard }));
      saveSubject.complete();

      // THEN
      expect(bankCardFormService.getBankCard).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(bankCardService.update).toHaveBeenCalledWith(expect.objectContaining(bankCard));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBankCard>>();
      const bankCard = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
      jest.spyOn(bankCardFormService, 'getBankCard').mockReturnValue({ id: null });
      jest.spyOn(bankCardService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ bankCard: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: bankCard }));
      saveSubject.complete();

      // THEN
      expect(bankCardFormService.getBankCard).toHaveBeenCalled();
      expect(bankCardService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBankCard>>();
      const bankCard = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
      jest.spyOn(bankCardService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ bankCard });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(bankCardService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
