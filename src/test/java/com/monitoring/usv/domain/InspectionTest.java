package com.monitoring.usv.domain;

import static com.monitoring.usv.domain.InspectionTestSamples.*;
import static com.monitoring.usv.domain.PhotoTestSamples.*;
import static com.monitoring.usv.domain.VehicleTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.monitoring.usv.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class InspectionTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Inspection.class);
        Inspection inspection1 = getInspectionSample1();
        Inspection inspection2 = new Inspection();
        assertThat(inspection1).isNotEqualTo(inspection2);

        inspection2.setId(inspection1.getId());
        assertThat(inspection1).isEqualTo(inspection2);

        inspection2 = getInspectionSample2();
        assertThat(inspection1).isNotEqualTo(inspection2);
    }

    @Test
    void photosTest() {
        Inspection inspection = getInspectionRandomSampleGenerator();
        Photo photoBack = getPhotoRandomSampleGenerator();

        inspection.addPhotos(photoBack);
        assertThat(inspection.getPhotos()).containsOnly(photoBack);
        assertThat(photoBack.getInspection()).isEqualTo(inspection);

        inspection.removePhotos(photoBack);
        assertThat(inspection.getPhotos()).doesNotContain(photoBack);
        assertThat(photoBack.getInspection()).isNull();

        inspection.photos(new HashSet<>(Set.of(photoBack)));
        assertThat(inspection.getPhotos()).containsOnly(photoBack);
        assertThat(photoBack.getInspection()).isEqualTo(inspection);

        inspection.setPhotos(new HashSet<>());
        assertThat(inspection.getPhotos()).doesNotContain(photoBack);
        assertThat(photoBack.getInspection()).isNull();
    }

    @Test
    void vehicleTest() {
        Inspection inspection = getInspectionRandomSampleGenerator();
        Vehicle vehicleBack = getVehicleRandomSampleGenerator();

        inspection.setVehicle(vehicleBack);
        assertThat(inspection.getVehicle()).isEqualTo(vehicleBack);

        inspection.vehicle(null);
        assertThat(inspection.getVehicle()).isNull();
    }
}
