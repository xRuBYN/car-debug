package com.monitoring.usv.domain;

import static com.monitoring.usv.domain.BankCardTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.monitoring.usv.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class BankCardTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(BankCard.class);
        BankCard bankCard1 = getBankCardSample1();
        BankCard bankCard2 = new BankCard();
        assertThat(bankCard1).isNotEqualTo(bankCard2);

        bankCard2.setId(bankCard1.getId());
        assertThat(bankCard1).isEqualTo(bankCard2);

        bankCard2 = getBankCardSample2();
        assertThat(bankCard1).isNotEqualTo(bankCard2);
    }
}
