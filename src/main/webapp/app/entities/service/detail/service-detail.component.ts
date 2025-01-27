import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from 'app/shared/date';
import { IService } from '../service.model';

@Component({
  standalone: true,
  selector: 'jhi-service-detail',
  templateUrl: './service-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class ServiceDetailComponent {
  service = input<IService | null>(null);

  previousState(): void {
    window.history.back();
  }
}
