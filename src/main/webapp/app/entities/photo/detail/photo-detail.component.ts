import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from 'app/shared/date';
import { IPhoto } from '../photo.model';

@Component({
  standalone: true,
  selector: 'jhi-photo-detail',
  templateUrl: './photo-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class PhotoDetailComponent {
  photo = input<IPhoto | null>(null);

  previousState(): void {
    window.history.back();
  }
}
