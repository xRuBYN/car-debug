import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from 'app/shared/date';
import { IAccident } from '../accident.model';

@Component({
  standalone: true,
  selector: 'jhi-accident-detail',
  templateUrl: './accident-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class AccidentDetailComponent {
  accident = input<IAccident | null>(null);

  previousState(): void {
    window.history.back();
  }
}
