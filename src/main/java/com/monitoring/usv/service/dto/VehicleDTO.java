package com.monitoring.usv.service.dto;

import com.monitoring.usv.domain.Vehicle;


public class VehicleDTO {
    private Long id;
    private String vin;
    private String make;
    private String model;
    private Integer year;

    private Long detailsId;
    private String color;
    private String engineDescription;
    private String fuelType;

    public VehicleDTO() {
    }

    public VehicleDTO(Vehicle vehicle) {
        this.id = vehicle.getId();
        this.vin = vehicle.getVin();
        this.make = vehicle.getMake();
        this.model = vehicle.getModel();
        this.year = vehicle.getYear();
        this.detailsId = vehicle.getVehicleDetail().getId();
        this.color = vehicle.getVehicleDetail().getColor();
        this.engineDescription = vehicle.getVehicleDetail().getEngineDescription();
        this.fuelType = vehicle.getVehicleDetail().getFuelType();
    }

    public String getVin() {
        return vin;
    }

    public void setVin(String vin) {
        this.vin = vin;
    }

    public String getMake() {
        return make;
    }

    public void setMake(String make) {
        this.make = make;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public Integer getYear() {
        return year;
    }

    public void setYear(Integer year) {
        this.year = year;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getDetailsId() {
        return detailsId;
    }

    public void setDetailsId(Long detailsId) {
        this.detailsId = detailsId;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public String getEngineDescription() {
        return engineDescription;
    }

    public void setEngineDescription(String engineDescription) {
        this.engineDescription = engineDescription;
    }

    public String getFuelType() {
        return fuelType;
    }

    public void setFuelType(String fuelType) {
        this.fuelType = fuelType;
    }

    @Override
    public String toString() {
        return "VehicleDTO{" +
                "id=" + id +
                ", vin='" + vin + '\'' +
                ", make='" + make + '\'' +
                ", model='" + model + '\'' +
                ", year=" + year +
                ", detailsId=" + detailsId +
                ", color='" + color + '\'' +
                ", engineDescription='" + engineDescription + '\'' +
                ", fuelType='" + fuelType + '\'' +
                '}';
    }
}
