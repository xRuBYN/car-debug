import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from 'app/shared/date';
import { IPlanConfig } from '../plan-config.model';

@Component({
  standalone: true,
  selector: 'jhi-plan-config-detail',
  templateUrl: './plan-config-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class PlanConfigDetailComponent {
  planConfig = input<IPlanConfig | null>(null);

  previousState(): void {
    window.history.back();
  }
}
