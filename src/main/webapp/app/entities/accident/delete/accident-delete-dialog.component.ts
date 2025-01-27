import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IAccident } from '../accident.model';
import { AccidentService } from '../service/accident.service';

@Component({
  standalone: true,
  templateUrl: './accident-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class AccidentDeleteDialogComponent {
  accident?: IAccident;

  protected accidentService = inject(AccidentService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.accidentService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
