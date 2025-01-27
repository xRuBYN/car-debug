import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IPlanConfig } from '../plan-config.model';
import { PlanConfigService } from '../service/plan-config.service';
import { PlanConfigFormGroup, PlanConfigFormService } from './plan-config-form.service';

@Component({
  standalone: true,
  selector: 'jhi-plan-config-update',
  templateUrl: './plan-config-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class PlanConfigUpdateComponent implements OnInit {
  isSaving = false;
  planConfig: IPlanConfig | null = null;

  protected planConfigService = inject(PlanConfigService);
  protected planConfigFormService = inject(PlanConfigFormService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: PlanConfigFormGroup = this.planConfigFormService.createPlanConfigFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ planConfig }) => {
      this.planConfig = planConfig;
      if (planConfig) {
        this.updateForm(planConfig);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const planConfig = this.planConfigFormService.getPlanConfig(this.editForm);
    if (planConfig.id !== null) {
      this.subscribeToSaveResponse(this.planConfigService.update(planConfig));
    } else {
      this.subscribeToSaveResponse(this.planConfigService.create(planConfig));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPlanConfig>>): void {
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

  protected updateForm(planConfig: IPlanConfig): void {
    this.planConfig = planConfig;
    this.planConfigFormService.resetForm(this.editForm, planConfig);
  }
}
