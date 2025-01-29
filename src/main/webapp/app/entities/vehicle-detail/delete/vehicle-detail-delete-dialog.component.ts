import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IVehicleDetail } from '../vehicle-detail.model';
import { VehicleDetailService } from '../service/vehicle-detail.service';

@Component({
  standalone: true,
  templateUrl: './vehicle-detail-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class VehicleDetailDeleteDialogComponent {
  vehicleDetail?: IVehicleDetail;

  protected vehicleDetailService = inject(VehicleDetailService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.vehicleDetailService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
