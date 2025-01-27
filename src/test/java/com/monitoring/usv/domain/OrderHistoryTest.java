package com.monitoring.usv.domain;

import static com.monitoring.usv.domain.OrderHistoryTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.monitoring.usv.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class OrderHistoryTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(OrderHistory.class);
        OrderHistory orderHistory1 = getOrderHistorySample1();
        OrderHistory orderHistory2 = new OrderHistory();
        assertThat(orderHistory1).isNotEqualTo(orderHistory2);

        orderHistory2.setId(orderHistory1.getId());
        assertThat(orderHistory1).isEqualTo(orderHistory2);

        orderHistory2 = getOrderHistorySample2();
        assertThat(orderHistory1).isNotEqualTo(orderHistory2);
    }
}
