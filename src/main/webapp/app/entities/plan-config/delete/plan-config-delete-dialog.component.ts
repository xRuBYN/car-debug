import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IPlanConfig } from '../plan-config.model';
import { PlanConfigService } from '../service/plan-config.service';

@Component({
  standalone: true,
  templateUrl: './plan-config-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class PlanConfigDeleteDialogComponent {
  planConfig?: IPlanConfig;

  protected planConfigService = inject(PlanConfigService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.planConfigService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
