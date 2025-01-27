import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IVehicle } from 'app/entities/vehicle/vehicle.model';
import { VehicleService } from 'app/entities/vehicle/service/vehicle.service';
import { IInspection } from 'app/entities/inspection/inspection.model';
import { InspectionService } from 'app/entities/inspection/service/inspection.service';
import { IAccident } from 'app/entities/accident/accident.model';
import { AccidentService } from 'app/entities/accident/service/accident.service';
import { IService } from 'app/entities/service/service.model';
import { ServiceService } from 'app/entities/service/service/service.service';
import { PhotoService } from '../service/photo.service';
import { IPhoto } from '../photo.model';
import { PhotoFormGroup, PhotoFormService } from './photo-form.service';

@Component({
  standalone: true,
  selector: 'jhi-photo-update',
  templateUrl: './photo-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class PhotoUpdateComponent implements OnInit {
  isSaving = false;
  photo: IPhoto | null = null;

  vehiclesSharedCollection: IVehicle[] = [];
  inspectionsSharedCollection: IInspection[] = [];
  accidentsSharedCollection: IAccident[] = [];
  servicesSharedCollection: IService[] = [];

  protected photoService = inject(PhotoService);
  protected photoFormService = inject(PhotoFormService);
  protected vehicleService = inject(VehicleService);
  protected inspectionService = inject(InspectionService);
  protected accidentService = inject(AccidentService);
  protected serviceService = inject(ServiceService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: PhotoFormGroup = this.photoFormService.createPhotoFormGroup();

  compareVehicle = (o1: IVehicle | null, o2: IVehicle | null): boolean => this.vehicleService.compareVehicle(o1, o2);

  compareInspection = (o1: IInspection | null, o2: IInspection | null): boolean => this.inspectionService.compareInspection(o1, o2);

  compareAccident = (o1: IAccident | null, o2: IAccident | null): boolean => this.accidentService.compareAccident(o1, o2);

  compareService = (o1: IService | null, o2: IService | null): boolean => this.serviceService.compareService(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ photo }) => {
      this.photo = photo;
      if (photo) {
        this.updateForm(photo);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const photo = this.photoFormService.getPhoto(this.editForm);
    if (photo.id !== null) {
      this.subscribeToSaveResponse(this.photoService.update(photo));
    } else {
      this.subscribeToSaveResponse(this.photoService.create(photo));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPhoto>>): void {
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

  protected updateForm(photo: IPhoto): void {
    this.photo = photo;
    this.photoFormService.resetForm(this.editForm, photo);

    this.vehiclesSharedCollection = this.vehicleService.addVehicleToCollectionIfMissing<IVehicle>(
      this.vehiclesSharedCollection,
      photo.vehicle,
    );
    this.inspectionsSharedCollection = this.inspectionService.addInspectionToCollectionIfMissing<IInspection>(
      this.inspectionsSharedCollection,
      photo.inspection,
    );
    this.accidentsSharedCollection = this.accidentService.addAccidentToCollectionIfMissing<IAccident>(
      this.accidentsSharedCollection,
      photo.accident,
    );
    this.servicesSharedCollection = this.serviceService.addServiceToCollectionIfMissing<IService>(
      this.servicesSharedCollection,
      photo.service,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.vehicleService
      .query()
      .pipe(map((res: HttpResponse<IVehicle[]>) => res.body ?? []))
      .pipe(map((vehicles: IVehicle[]) => this.vehicleService.addVehicleToCollectionIfMissing<IVehicle>(vehicles, this.photo?.vehicle)))
      .subscribe((vehicles: IVehicle[]) => (this.vehiclesSharedCollection = vehicles));

    this.inspectionService
      .query()
      .pipe(map((res: HttpResponse<IInspection[]>) => res.body ?? []))
      .pipe(
        map((inspections: IInspection[]) =>
          this.inspectionService.addInspectionToCollectionIfMissing<IInspection>(inspections, this.photo?.inspection),
        ),
      )
      .subscribe((inspections: IInspection[]) => (this.inspectionsSharedCollection = inspections));

    this.accidentService
      .query()
      .pipe(map((res: HttpResponse<IAccident[]>) => res.body ?? []))
      .pipe(
        map((accidents: IAccident[]) => this.accidentService.addAccidentToCollectionIfMissing<IAccident>(accidents, this.photo?.accident)),
      )
      .subscribe((accidents: IAccident[]) => (this.accidentsSharedCollection = accidents));

    this.serviceService
      .query()
      .pipe(map((res: HttpResponse<IService[]>) => res.body ?? []))
      .pipe(map((services: IService[]) => this.serviceService.addServiceToCollectionIfMissing<IService>(services, this.photo?.service)))
      .subscribe((services: IService[]) => (this.servicesSharedCollection = services));
  }
}
