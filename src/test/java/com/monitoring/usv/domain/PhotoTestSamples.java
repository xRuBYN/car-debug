package com.monitoring.usv.domain;

import java.util.UUID;

public class PhotoTestSamples {

    public static Photo getPhotoSample1() {
        return new Photo()
            .id(UUID.fromString("23d8dc04-a48b-45d9-a01d-4b728f0ad4aa"))
            .path("path1")
            .createdBy("createdBy1")
            .lastModifiedBy("lastModifiedBy1");
    }

    public static Photo getPhotoSample2() {
        return new Photo()
            .id(UUID.fromString("ad79f240-3727-46c3-b89f-2cf6ebd74367"))
            .path("path2")
            .createdBy("createdBy2")
            .lastModifiedBy("lastModifiedBy2");
    }

    public static Photo getPhotoRandomSampleGenerator() {
        return new Photo()
            .id(UUID.randomUUID())
            .path(UUID.randomUUID().toString())
            .createdBy(UUID.randomUUID().toString())
            .lastModifiedBy(UUID.randomUUID().toString());
    }
}
