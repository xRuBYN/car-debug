import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from 'app/shared/date';
import { IVehicle } from '../vehicle.model';

@Component({
  standalone: true,
  selector: 'jhi-vehicle-detail',
  templateUrl: './vehicle-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class VehicleDetailComponent {
  vehicle = input<IVehicle | null>(null);

  previousState(): void {
    window.history.back();
  }
}
