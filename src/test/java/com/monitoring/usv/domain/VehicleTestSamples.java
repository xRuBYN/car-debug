package com.monitoring.usv.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

public class VehicleTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));
    private static final AtomicInteger intCount = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    public static Vehicle getVehicleSample1() {
        return new Vehicle().id(1L).vin("vin1").make("make1").model("model1").year(1);
    }

    public static Vehicle getVehicleSample2() {
        return new Vehicle().id(2L).vin("vin2").make("make2").model("model2").year(2);
    }

    public static Vehicle getVehicleRandomSampleGenerator() {
        return new Vehicle()
            .id(longCount.incrementAndGet())
            .vin(UUID.randomUUID().toString())
            .make(UUID.randomUUID().toString())
            .model(UUID.randomUUID().toString())
            .year(intCount.incrementAndGet());
    }
}
