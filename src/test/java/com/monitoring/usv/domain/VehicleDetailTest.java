package com.monitoring.usv.domain;

import static com.monitoring.usv.domain.VehicleDetailTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.monitoring.usv.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class VehicleDetailTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(VehicleDetail.class);
        VehicleDetail vehicleDetail1 = getVehicleDetailSample1();
        VehicleDetail vehicleDetail2 = new VehicleDetail();
        assertThat(vehicleDetail1).isNotEqualTo(vehicleDetail2);

        vehicleDetail2.setId(vehicleDetail1.getId());
        assertThat(vehicleDetail1).isEqualTo(vehicleDetail2);

        vehicleDetail2 = getVehicleDetailSample2();
        assertThat(vehicleDetail1).isNotEqualTo(vehicleDetail2);
    }
}
