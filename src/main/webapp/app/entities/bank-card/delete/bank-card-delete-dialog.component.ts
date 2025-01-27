import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IBankCard } from '../bank-card.model';
import { BankCardService } from '../service/bank-card.service';

@Component({
  standalone: true,
  templateUrl: './bank-card-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class BankCardDeleteDialogComponent {
  bankCard?: IBankCard;

  protected bankCardService = inject(BankCardService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.bankCardService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
