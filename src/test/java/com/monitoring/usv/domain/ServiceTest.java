package com.monitoring.usv.domain;

import static com.monitoring.usv.domain.PhotoTestSamples.*;
import static com.monitoring.usv.domain.ServiceTestSamples.*;
import static com.monitoring.usv.domain.VehicleTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.monitoring.usv.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class ServiceTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Service.class);
        Service service1 = getServiceSample1();
        Service service2 = new Service();
        assertThat(service1).isNotEqualTo(service2);

        service2.setId(service1.getId());
        assertThat(service1).isEqualTo(service2);

        service2 = getServiceSample2();
        assertThat(service1).isNotEqualTo(service2);
    }

    @Test
    void photosTest() {
        Service service = getServiceRandomSampleGenerator();
        Photo photoBack = getPhotoRandomSampleGenerator();

        service.addPhotos(photoBack);
        assertThat(service.getPhotos()).containsOnly(photoBack);
        assertThat(photoBack.getService()).isEqualTo(service);

        service.removePhotos(photoBack);
        assertThat(service.getPhotos()).doesNotContain(photoBack);
        assertThat(photoBack.getService()).isNull();

        service.photos(new HashSet<>(Set.of(photoBack)));
        assertThat(service.getPhotos()).containsOnly(photoBack);
        assertThat(photoBack.getService()).isEqualTo(service);

        service.setPhotos(new HashSet<>());
        assertThat(service.getPhotos()).doesNotContain(photoBack);
        assertThat(photoBack.getService()).isNull();
    }

    @Test
    void vehicleTest() {
        Service service = getServiceRandomSampleGenerator();
        Vehicle vehicleBack = getVehicleRandomSampleGenerator();

        service.setVehicle(vehicleBack);
        assertThat(service.getVehicle()).isEqualTo(vehicleBack);

        service.vehicle(null);
        assertThat(service.getVehicle()).isNull();
    }
}
