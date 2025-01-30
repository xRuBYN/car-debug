package com.monitoring.usv.domain;

import java.util.UUID;

public class BankCardTestSamples {

    public static BankCard getBankCardSample1() {
        return new BankCard()
            .id(UUID.fromString("23d8dc04-a48b-45d9-a01d-4b728f0ad4aa"))
            .cardCode("cardCode1")
            .firstName("firstName1")
            .lastName("lastName1")
            .cvv("cvv1");
    }

    public static BankCard getBankCardSample2() {
        return new BankCard()
            .id(UUID.fromString("ad79f240-3727-46c3-b89f-2cf6ebd74367"))
            .cardCode("cardCode2")
            .firstName("firstName2")
            .lastName("lastName2")
            .cvv("cvv2");
    }

    public static BankCard getBankCardRandomSampleGenerator() {
        return new BankCard()
            .id(UUID.randomUUID())
            .cardCode(UUID.randomUUID().toString())
            .firstName(UUID.randomUUID().toString())
            .lastName(UUID.randomUUID().toString())
            .cvv(UUID.randomUUID().toString());
    }
}
