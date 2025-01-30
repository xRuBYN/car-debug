package com.monitoring.usv.domain;

import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;

public class PlanConfigTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static PlanConfig getPlanConfigSample1() {
        return new PlanConfig().id(1L).attempts(1L);
    }

    public static PlanConfig getPlanConfigSample2() {
        return new PlanConfig().id(2L).attempts(2L);
    }

    public static PlanConfig getPlanConfigRandomSampleGenerator() {
        return new PlanConfig().id(longCount.incrementAndGet()).attempts(longCount.incrementAndGet());
    }
}
