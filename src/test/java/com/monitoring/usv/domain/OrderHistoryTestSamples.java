package com.monitoring.usv.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class OrderHistoryTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static OrderHistory getOrderHistorySample1() {
        return new OrderHistory().id(1L).userId(1L).planType("planType1").createdBy("createdBy1").lastModifiedBy("lastModifiedBy1");
    }

    public static OrderHistory getOrderHistorySample2() {
        return new OrderHistory().id(2L).userId(2L).planType("planType2").createdBy("createdBy2").lastModifiedBy("lastModifiedBy2");
    }

    public static OrderHistory getOrderHistoryRandomSampleGenerator() {
        return new OrderHistory()
            .id(longCount.incrementAndGet())
            .userId(longCount.incrementAndGet())
            .planType(UUID.randomUUID().toString())
            .createdBy(UUID.randomUUID().toString())
            .lastModifiedBy(UUID.randomUUID().toString());
    }
}
