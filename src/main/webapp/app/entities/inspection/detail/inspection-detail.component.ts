import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from 'app/shared/date';
import { IInspection } from '../inspection.model';

@Component({
  standalone: true,
  selector: 'jhi-inspection-detail',
  templateUrl: './inspection-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class InspectionDetailComponent {
  inspection = input<IInspection | null>(null);

  previousState(): void {
    window.history.back();
  }
}
