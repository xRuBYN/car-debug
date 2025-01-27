import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IBankCard } from '../bank-card.model';
import { BankCardService } from '../service/bank-card.service';
import { BankCardFormGroup, BankCardFormService } from './bank-card-form.service';

@Component({
  standalone: true,
  selector: 'jhi-bank-card-update',
  templateUrl: './bank-card-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class BankCardUpdateComponent implements OnInit {
  isSaving = false;
  bankCard: IBankCard | null = null;

  protected bankCardService = inject(BankCardService);
  protected bankCardFormService = inject(BankCardFormService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: BankCardFormGroup = this.bankCardFormService.createBankCardFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ bankCard }) => {
      this.bankCard = bankCard;
      if (bankCard) {
        this.updateForm(bankCard);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const bankCard = this.bankCardFormService.getBankCard(this.editForm);
    if (bankCard.id !== null) {
      this.subscribeToSaveResponse(this.bankCardService.update(bankCard));
    } else {
      this.subscribeToSaveResponse(this.bankCardService.create(bankCard));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IBankCard>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(bankCard: IBankCard): void {
    this.bankCard = bankCard;
    this.bankCardFormService.resetForm(this.editForm, bankCard);
  }
}
