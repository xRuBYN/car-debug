import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from 'app/shared/date';
import { IBankCard } from '../bank-card.model';

@Component({
  standalone: true,
  selector: 'jhi-bank-card-detail',
  templateUrl: './bank-card-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class BankCardDetailComponent {
  bankCard = input<IBankCard | null>(null);

  previousState(): void {
    window.history.back();
  }
}
