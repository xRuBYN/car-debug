package com.monitoring.usv.domain;

import static com.monitoring.usv.domain.PlanConfigTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.monitoring.usv.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class PlanConfigTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(PlanConfig.class);
        PlanConfig planConfig1 = getPlanConfigSample1();
        PlanConfig planConfig2 = new PlanConfig();
        assertThat(planConfig1).isNotEqualTo(planConfig2);

        planConfig2.setId(planConfig1.getId());
        assertThat(planConfig1).isEqualTo(planConfig2);

        planConfig2 = getPlanConfigSample2();
        assertThat(planConfig1).isNotEqualTo(planConfig2);
    }
}
