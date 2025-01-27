import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IOrderHistory } from '../order-history.model';
import { OrderHistoryService } from '../service/order-history.service';
import { OrderHistoryFormGroup, OrderHistoryFormService } from './order-history-form.service';

@Component({
  standalone: true,
  selector: 'jhi-order-history-update',
  templateUrl: './order-history-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class OrderHistoryUpdateComponent implements OnInit {
  isSaving = false;
  orderHistory: IOrderHistory | null = null;

  protected orderHistoryService = inject(OrderHistoryService);
  protected orderHistoryFormService = inject(OrderHistoryFormService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: OrderHistoryFormGroup = this.orderHistoryFormService.createOrderHistoryFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ orderHistory }) => {
      this.orderHistory = orderHistory;
      if (orderHistory) {
        this.updateForm(orderHistory);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const orderHistory = this.orderHistoryFormService.getOrderHistory(this.editForm);
    if (orderHistory.id !== null) {
      this.subscribeToSaveResponse(this.orderHistoryService.update(orderHistory));
    } else {
      this.subscribeToSaveResponse(this.orderHistoryService.create(orderHistory));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IOrderHistory>>): void {
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

  protected updateForm(orderHistory: IOrderHistory): void {
    this.orderHistory = orderHistory;
    this.orderHistoryFormService.resetForm(this.editForm, orderHistory);
  }
}
