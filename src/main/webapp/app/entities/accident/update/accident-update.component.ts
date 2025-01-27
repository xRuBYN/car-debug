import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IVehicle } from 'app/entities/vehicle/vehicle.model';
import { VehicleService } from 'app/entities/vehicle/service/vehicle.service';
import { IAccident } from '../accident.model';
import { AccidentService } from '../service/accident.service';
import { AccidentFormGroup, AccidentFormService } from './accident-form.service';

@Component({
  standalone: true,
  selector: 'jhi-accident-update',
  templateUrl: './accident-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class AccidentUpdateComponent implements OnInit {
  isSaving = false;
  accident: IAccident | null = null;

  vehiclesSharedCollection: IVehicle[] = [];

  protected accidentService = inject(AccidentService);
  protected accidentFormService = inject(AccidentFormService);
  protected vehicleService = inject(VehicleService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: AccidentFormGroup = this.accidentFormService.createAccidentFormGroup();

  compareVehicle = (o1: IVehicle | null, o2: IVehicle | null): boolean => this.vehicleService.compareVehicle(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ accident }) => {
      this.accident = accident;
      if (accident) {
        this.updateForm(accident);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const accident = this.accidentFormService.getAccident(this.editForm);
    if (accident.id !== null) {
      this.subscribeToSaveResponse(this.accidentService.update(accident));
    } else {
      this.subscribeToSaveResponse(this.accidentService.create(accident));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAccident>>): void {
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

  protected updateForm(accident: IAccident): void {
    this.accident = accident;
    this.accidentFormService.resetForm(this.editForm, accident);

    this.vehiclesSharedCollection = this.vehicleService.addVehicleToCollectionIfMissing<IVehicle>(
      this.vehiclesSharedCollection,
      accident.vehicle,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.vehicleService
      .query()
      .pipe(map((res: HttpResponse<IVehicle[]>) => res.body ?? []))
      .pipe(map((vehicles: IVehicle[]) => this.vehicleService.addVehicleToCollectionIfMissing<IVehicle>(vehicles, this.accident?.vehicle)))
      .subscribe((vehicles: IVehicle[]) => (this.vehiclesSharedCollection = vehicles));
  }
}
