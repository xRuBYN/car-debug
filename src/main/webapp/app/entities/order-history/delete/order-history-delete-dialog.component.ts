import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IOrderHistory } from '../order-history.model';
import { OrderHistoryService } from '../service/order-history.service';

@Component({
  standalone: true,
  templateUrl: './order-history-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class OrderHistoryDeleteDialogComponent {
  orderHistory?: IOrderHistory;

  protected orderHistoryService = inject(OrderHistoryService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.orderHistoryService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
