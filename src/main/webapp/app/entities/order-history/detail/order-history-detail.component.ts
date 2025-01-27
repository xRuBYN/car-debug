import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from 'app/shared/date';
import { IOrderHistory } from '../order-history.model';

@Component({
  standalone: true,
  selector: 'jhi-order-history-detail',
  templateUrl: './order-history-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class OrderHistoryDetailComponent {
  orderHistory = input<IOrderHistory | null>(null);

  previousState(): void {
    window.history.back();
  }
}
