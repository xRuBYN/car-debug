package com.monitoring.usv.domain;

import static com.monitoring.usv.domain.AccidentTestSamples.*;
import static com.monitoring.usv.domain.InspectionTestSamples.*;
import static com.monitoring.usv.domain.PhotoTestSamples.*;
import static com.monitoring.usv.domain.ServiceTestSamples.*;
import static com.monitoring.usv.domain.VehicleTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.monitoring.usv.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class VehicleTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Vehicle.class);
        Vehicle vehicle1 = getVehicleSample1();
        Vehicle vehicle2 = new Vehicle();
        assertThat(vehicle1).isNotEqualTo(vehicle2);

        vehicle2.setId(vehicle1.getId());
        assertThat(vehicle1).isEqualTo(vehicle2);

        vehicle2 = getVehicleSample2();
        assertThat(vehicle1).isNotEqualTo(vehicle2);
    }

    @Test
    void inspectionsTest() {
        Vehicle vehicle = getVehicleRandomSampleGenerator();
        Inspection inspectionBack = getInspectionRandomSampleGenerator();

        vehicle.addInspections(inspectionBack);
        assertThat(vehicle.getInspections()).containsOnly(inspectionBack);
        assertThat(inspectionBack.getVehicle()).isEqualTo(vehicle);

        vehicle.removeInspections(inspectionBack);
        assertThat(vehicle.getInspections()).doesNotContain(inspectionBack);
        assertThat(inspectionBack.getVehicle()).isNull();

        vehicle.inspections(new HashSet<>(Set.of(inspectionBack)));
        assertThat(vehicle.getInspections()).containsOnly(inspectionBack);
        assertThat(inspectionBack.getVehicle()).isEqualTo(vehicle);

        vehicle.setInspections(new HashSet<>());
        assertThat(vehicle.getInspections()).doesNotContain(inspectionBack);
        assertThat(inspectionBack.getVehicle()).isNull();
    }

    @Test
    void accidentsTest() {
        Vehicle vehicle = getVehicleRandomSampleGenerator();
        Accident accidentBack = getAccidentRandomSampleGenerator();

        vehicle.addAccidents(accidentBack);
        assertThat(vehicle.getAccidents()).containsOnly(accidentBack);
        assertThat(accidentBack.getVehicle()).isEqualTo(vehicle);

        vehicle.removeAccidents(accidentBack);
        assertThat(vehicle.getAccidents()).doesNotContain(accidentBack);
        assertThat(accidentBack.getVehicle()).isNull();

        vehicle.accidents(new HashSet<>(Set.of(accidentBack)));
        assertThat(vehicle.getAccidents()).containsOnly(accidentBack);
        assertThat(accidentBack.getVehicle()).isEqualTo(vehicle);

        vehicle.setAccidents(new HashSet<>());
        assertThat(vehicle.getAccidents()).doesNotContain(accidentBack);
        assertThat(accidentBack.getVehicle()).isNull();
    }

    @Test
    void servicesTest() {
        Vehicle vehicle = getVehicleRandomSampleGenerator();
        Service serviceBack = getServiceRandomSampleGenerator();

        vehicle.addServices(serviceBack);
        assertThat(vehicle.getServices()).containsOnly(serviceBack);
        assertThat(serviceBack.getVehicle()).isEqualTo(vehicle);

        vehicle.removeServices(serviceBack);
        assertThat(vehicle.getServices()).doesNotContain(serviceBack);
        assertThat(serviceBack.getVehicle()).isNull();

        vehicle.services(new HashSet<>(Set.of(serviceBack)));
        assertThat(vehicle.getServices()).containsOnly(serviceBack);
        assertThat(serviceBack.getVehicle()).isEqualTo(vehicle);

        vehicle.setServices(new HashSet<>());
        assertThat(vehicle.getServices()).doesNotContain(serviceBack);
        assertThat(serviceBack.getVehicle()).isNull();
    }

    @Test
    void photosTest() {
        Vehicle vehicle = getVehicleRandomSampleGenerator();
        Photo photoBack = getPhotoRandomSampleGenerator();

        vehicle.addPhotos(photoBack);
        assertThat(vehicle.getPhotos()).containsOnly(photoBack);
        assertThat(photoBack.getVehicle()).isEqualTo(vehicle);

        vehicle.removePhotos(photoBack);
        assertThat(vehicle.getPhotos()).doesNotContain(photoBack);
        assertThat(photoBack.getVehicle()).isNull();

        vehicle.photos(new HashSet<>(Set.of(photoBack)));
        assertThat(vehicle.getPhotos()).containsOnly(photoBack);
        assertThat(photoBack.getVehicle()).isEqualTo(vehicle);

        vehicle.setPhotos(new HashSet<>());
        assertThat(vehicle.getPhotos()).doesNotContain(photoBack);
        assertThat(photoBack.getVehicle()).isNull();
    }
}
