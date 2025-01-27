import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IVehicle } from 'app/entities/vehicle/vehicle.model';
import { VehicleService } from 'app/entities/vehicle/service/vehicle.service';
import { IInspection } from '../inspection.model';
import { InspectionService } from '../service/inspection.service';
import { InspectionFormGroup, InspectionFormService } from './inspection-form.service';

@Component({
  standalone: true,
  selector: 'jhi-inspection-update',
  templateUrl: './inspection-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class InspectionUpdateComponent implements OnInit {
  isSaving = false;
  inspection: IInspection | null = null;

  vehiclesSharedCollection: IVehicle[] = [];

  protected inspectionService = inject(InspectionService);
  protected inspectionFormService = inject(InspectionFormService);
  protected vehicleService = inject(VehicleService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: InspectionFormGroup = this.inspectionFormService.createInspectionFormGroup();

  compareVehicle = (o1: IVehicle | null, o2: IVehicle | null): boolean => this.vehicleService.compareVehicle(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ inspection }) => {
      this.inspection = inspection;
      if (inspection) {
        this.updateForm(inspection);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const inspection = this.inspectionFormService.getInspection(this.editForm);
    if (inspection.id !== null) {
      this.subscribeToSaveResponse(this.inspectionService.update(inspection));
    } else {
      this.subscribeToSaveResponse(this.inspectionService.create(inspection));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IInspection>>): void {
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

  protected updateForm(inspection: IInspection): void {
    this.inspection = inspection;
    this.inspectionFormService.resetForm(this.editForm, inspection);

    this.vehiclesSharedCollection = this.vehicleService.addVehicleToCollectionIfMissing<IVehicle>(
      this.vehiclesSharedCollection,
      inspection.vehicle,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.vehicleService
      .query()
      .pipe(map((res: HttpResponse<IVehicle[]>) => res.body ?? []))
      .pipe(
        map((vehicles: IVehicle[]) => this.vehicleService.addVehicleToCollectionIfMissing<IVehicle>(vehicles, this.inspection?.vehicle)),
      )
      .subscribe((vehicles: IVehicle[]) => (this.vehiclesSharedCollection = vehicles));
  }
}
