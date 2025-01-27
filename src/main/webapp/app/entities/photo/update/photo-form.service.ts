import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IPhoto, NewPhoto } from '../photo.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IPhoto for edit and NewPhotoFormGroupInput for create.
 */
type PhotoFormGroupInput = IPhoto | PartialWithRequiredKeyOf<NewPhoto>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IPhoto | NewPhoto> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

type PhotoFormRawValue = FormValueOf<IPhoto>;

type NewPhotoFormRawValue = FormValueOf<NewPhoto>;

type PhotoFormDefaults = Pick<NewPhoto, 'id' | 'createdDate' | 'lastModifiedDate'>;

type PhotoFormGroupContent = {
  id: FormControl<PhotoFormRawValue['id'] | NewPhoto['id']>;
  path: FormControl<PhotoFormRawValue['path']>;
  createdBy: FormControl<PhotoFormRawValue['createdBy']>;
  createdDate: FormControl<PhotoFormRawValue['createdDate']>;
  lastModifiedBy: FormControl<PhotoFormRawValue['lastModifiedBy']>;
  lastModifiedDate: FormControl<PhotoFormRawValue['lastModifiedDate']>;
  vehicle: FormControl<PhotoFormRawValue['vehicle']>;
  inspection: FormControl<PhotoFormRawValue['inspection']>;
  accident: FormControl<PhotoFormRawValue['accident']>;
  service: FormControl<PhotoFormRawValue['service']>;
};

export type PhotoFormGroup = FormGroup<PhotoFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class PhotoFormService {
  createPhotoFormGroup(photo: PhotoFormGroupInput = { id: null }): PhotoFormGroup {
    const photoRawValue = this.convertPhotoToPhotoRawValue({
      ...this.getFormDefaults(),
      ...photo,
    });
    return new FormGroup<PhotoFormGroupContent>({
      id: new FormControl(
        { value: photoRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      path: new FormControl(photoRawValue.path),
      createdBy: new FormControl(photoRawValue.createdBy, {
        validators: [Validators.required, Validators.maxLength(50)],
      }),
      createdDate: new FormControl(photoRawValue.createdDate, {
        validators: [Validators.required],
      }),
      lastModifiedBy: new FormControl(photoRawValue.lastModifiedBy, {
        validators: [Validators.maxLength(50)],
      }),
      lastModifiedDate: new FormControl(photoRawValue.lastModifiedDate),
      vehicle: new FormControl(photoRawValue.vehicle),
      inspection: new FormControl(photoRawValue.inspection),
      accident: new FormControl(photoRawValue.accident),
      service: new FormControl(photoRawValue.service),
    });
  }

  getPhoto(form: PhotoFormGroup): IPhoto | NewPhoto {
    return this.convertPhotoRawValueToPhoto(form.getRawValue() as PhotoFormRawValue | NewPhotoFormRawValue);
  }

  resetForm(form: PhotoFormGroup, photo: PhotoFormGroupInput): void {
    const photoRawValue = this.convertPhotoToPhotoRawValue({ ...this.getFormDefaults(), ...photo });
    form.reset(
      {
        ...photoRawValue,
        id: { value: photoRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): PhotoFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      createdDate: currentTime,
      lastModifiedDate: currentTime,
    };
  }

  private convertPhotoRawValueToPhoto(rawPhoto: PhotoFormRawValue | NewPhotoFormRawValue): IPhoto | NewPhoto {
    return {
      ...rawPhoto,
      createdDate: dayjs(rawPhoto.createdDate, DATE_TIME_FORMAT),
      lastModifiedDate: dayjs(rawPhoto.lastModifiedDate, DATE_TIME_FORMAT),
    };
  }

  private convertPhotoToPhotoRawValue(
    photo: IPhoto | (Partial<NewPhoto> & PhotoFormDefaults),
  ): PhotoFormRawValue | PartialWithRequiredKeyOf<NewPhotoFormRawValue> {
    return {
      ...photo,
      createdDate: photo.createdDate ? photo.createdDate.format(DATE_TIME_FORMAT) : undefined,
      lastModifiedDate: photo.lastModifiedDate ? photo.lastModifiedDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
