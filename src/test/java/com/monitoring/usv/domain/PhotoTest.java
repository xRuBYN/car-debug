package com.monitoring.usv.domain;

import static com.monitoring.usv.domain.AccidentTestSamples.*;
import static com.monitoring.usv.domain.InspectionTestSamples.*;
import static com.monitoring.usv.domain.PhotoTestSamples.*;
import static com.monitoring.usv.domain.ServiceTestSamples.*;
import static com.monitoring.usv.domain.VehicleTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.monitoring.usv.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class PhotoTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Photo.class);
        Photo photo1 = getPhotoSample1();
        Photo photo2 = new Photo();
        assertThat(photo1).isNotEqualTo(photo2);

        photo2.setId(photo1.getId());
        assertThat(photo1).isEqualTo(photo2);

        photo2 = getPhotoSample2();
        assertThat(photo1).isNotEqualTo(photo2);
    }

    @Test
    void vehicleTest() {
        Photo photo = getPhotoRandomSampleGenerator();
        Vehicle vehicleBack = getVehicleRandomSampleGenerator();

        photo.setVehicle(vehicleBack);
        assertThat(photo.getVehicle()).isEqualTo(vehicleBack);

        photo.vehicle(null);
        assertThat(photo.getVehicle()).isNull();
    }

    @Test
    void inspectionTest() {
        Photo photo = getPhotoRandomSampleGenerator();
        Inspection inspectionBack = getInspectionRandomSampleGenerator();

        photo.setInspection(inspectionBack);
        assertThat(photo.getInspection()).isEqualTo(inspectionBack);

        photo.inspection(null);
        assertThat(photo.getInspection()).isNull();
    }

    @Test
    void accidentTest() {
        Photo photo = getPhotoRandomSampleGenerator();
        Accident accidentBack = getAccidentRandomSampleGenerator();

        photo.setAccident(accidentBack);
        assertThat(photo.getAccident()).isEqualTo(accidentBack);

        photo.accident(null);
        assertThat(photo.getAccident()).isNull();
    }

    @Test
    void serviceTest() {
        Photo photo = getPhotoRandomSampleGenerator();
        Service serviceBack = getServiceRandomSampleGenerator();

        photo.setService(serviceBack);
        assertThat(photo.getService()).isEqualTo(serviceBack);

        photo.service(null);
        assertThat(photo.getService()).isNull();
    }
}
