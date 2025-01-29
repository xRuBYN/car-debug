import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from 'app/shared/date';
import { IVehicleDetail } from '../vehicle-detail.model';

@Component({
  standalone: true,
  selector: 'jhi-vehicle-detail-detail',
  templateUrl: './vehicle-detail-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class VehicleDetailDetailComponent {
  vehicleDetail = input<IVehicleDetail | null>(null);

  previousState(): void {
    window.history.back();
  }
}
