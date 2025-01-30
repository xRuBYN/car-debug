package com.monitoring.usv.domain;

import static com.monitoring.usv.domain.AccidentTestSamples.*;
import static com.monitoring.usv.domain.PhotoTestSamples.*;
import static com.monitoring.usv.domain.VehicleTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.monitoring.usv.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class AccidentTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Accident.class);
        Accident accident1 = getAccidentSample1();
        Accident accident2 = new Accident();
        assertThat(accident1).isNotEqualTo(accident2);

        accident2.setId(accident1.getId());
        assertThat(accident1).isEqualTo(accident2);

        accident2 = getAccidentSample2();
        assertThat(accident1).isNotEqualTo(accident2);
    }

    @Test
    void photosTest() {
        Accident accident = getAccidentRandomSampleGenerator();
        Photo photoBack = getPhotoRandomSampleGenerator();

        accident.addPhotos(photoBack);
        assertThat(accident.getPhotos()).containsOnly(photoBack);
        assertThat(photoBack.getAccident()).isEqualTo(accident);

        accident.removePhotos(photoBack);
        assertThat(accident.getPhotos()).doesNotContain(photoBack);
        assertThat(photoBack.getAccident()).isNull();

        accident.photos(new HashSet<>(Set.of(photoBack)));
        assertThat(accident.getPhotos()).containsOnly(photoBack);
        assertThat(photoBack.getAccident()).isEqualTo(accident);

        accident.setPhotos(new HashSet<>());
        assertThat(accident.getPhotos()).doesNotContain(photoBack);
        assertThat(photoBack.getAccident()).isNull();
    }

    @Test
    void vehicleTest() {
        Accident accident = getAccidentRandomSampleGenerator();
        Vehicle vehicleBack = getVehicleRandomSampleGenerator();

        accident.setVehicle(vehicleBack);
        assertThat(accident.getVehicle()).isEqualTo(vehicleBack);

        accident.vehicle(null);
        assertThat(accident.getVehicle()).isNull();
    }
}
