package com.monitoring.usv.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class VehicleDetailTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static VehicleDetail getVehicleDetailSample1() {
        return new VehicleDetail().id(1L).color("color1").engineDescription("engineDescription1").fuelType("fuelType1");
    }

    public static VehicleDetail getVehicleDetailSample2() {
        return new VehicleDetail().id(2L).color("color2").engineDescription("engineDescription2").fuelType("fuelType2");
    }

    public static VehicleDetail getVehicleDetailRandomSampleGenerator() {
        return new VehicleDetail()
            .id(longCount.incrementAndGet())
            .color(UUID.randomUUID().toString())
            .engineDescription(UUID.randomUUID().toString())
            .fuelType(UUID.randomUUID().toString());
    }
}
