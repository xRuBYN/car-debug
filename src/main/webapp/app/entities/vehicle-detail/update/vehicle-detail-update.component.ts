import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IVehicleDetail } from '../vehicle-detail.model';
import { VehicleDetailService } from '../service/vehicle-detail.service';
import { VehicleDetailFormGroup, VehicleDetailFormService } from './vehicle-detail-form.service';

@Component({
  standalone: true,
  selector: 'jhi-vehicle-detail-update',
  templateUrl: './vehicle-detail-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class VehicleDetailUpdateComponent implements OnInit {
  isSaving = false;
  vehicleDetail: IVehicleDetail | null = null;

  protected vehicleDetailService = inject(VehicleDetailService);
  protected vehicleDetailFormService = inject(VehicleDetailFormService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: VehicleDetailFormGroup = this.vehicleDetailFormService.createVehicleDetailFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ vehicleDetail }) => {
      this.vehicleDetail = vehicleDetail;
      if (vehicleDetail) {
        this.updateForm(vehicleDetail);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const vehicleDetail = this.vehicleDetailFormService.getVehicleDetail(this.editForm);
    if (vehicleDetail.id !== null) {
      this.subscribeToSaveResponse(this.vehicleDetailService.update(vehicleDetail));
    } else {
      this.subscribeToSaveResponse(this.vehicleDetailService.create(vehicleDetail));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IVehicleDetail>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(vehicleDetail: IVehicleDetail): void {
    this.vehicleDetail = vehicleDetail;
    this.vehicleDetailFormService.resetForm(this.editForm, vehicleDetail);
  }
}
