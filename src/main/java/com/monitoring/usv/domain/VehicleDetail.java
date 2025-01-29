package com.monitoring.usv.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.monitoring.usv.service.dto.VehicleDTO;
import jakarta.persistence.*;
import java.io.Serializable;

/**
 * A VehicleDetail.
 */
@Entity
@Table(name = "vehicle_detail")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class VehicleDetail implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "color")
    private String color;

    @Column(name = "engine_description")
    private String engineDescription;

    @Column(name = "fuel_type")
    private String fuelType;

    @OneToOne
    @JoinColumn(name = "vehicle_vin", referencedColumnName = "vin")
    @JsonIgnore
    private Vehicle vehicle;

    public VehicleDetail() {
    }

    public VehicleDetail(VehicleDTO vehicleDTO, Vehicle vehicle) {
        this.color = vehicleDTO.getColor();
        this.engineDescription = vehicleDTO.getEngineDescription();
        this.fuelType = vehicleDTO.getFuelType();
        this.vehicle = vehicle;
    }

    public Vehicle getVehicle() {
        return vehicle;
    }

    public void setVehicle(Vehicle vehicle) {
        this.vehicle = vehicle;
    }

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public VehicleDetail id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getColor() {
        return this.color;
    }

    public VehicleDetail color(String color) {
        this.setColor(color);
        return this;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public String getEngineDescription() {
        return this.engineDescription;
    }

    public VehicleDetail engineDescription(String engineDescription) {
        this.setEngineDescription(engineDescription);
        return this;
    }

    public void setEngineDescription(String engineDescription) {
        this.engineDescription = engineDescription;
    }

    public String getFuelType() {
        return this.fuelType;
    }

    public VehicleDetail fuelType(String fuelType) {
        this.setFuelType(fuelType);
        return this;
    }

    public void setFuelType(String fuelType) {
        this.fuelType = fuelType;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof VehicleDetail)) {
            return false;
        }
        return getId() != null && getId().equals(((VehicleDetail) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "VehicleDetail{" +
            "id=" + getId() +
            ", color='" + getColor() + "'" +
            ", engineDescription='" + getEngineDescription() + "'" +
            ", fuelType='" + getFuelType() + "'" +
            "}";
    }
}
