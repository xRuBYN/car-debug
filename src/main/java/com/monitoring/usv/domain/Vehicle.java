package com.monitoring.usv.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.monitoring.usv.service.dto.VehicleDTO;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

/**
 * A Vehicle.
 */
@Entity
@Table(name = "vehicle")
@JsonIgnoreProperties(value = { "new", "id" })
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Vehicle implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "vin", nullable = false)
    private String vin;

    @NotNull
    @Column(name = "make", nullable = false)
    private String make;

    @NotNull
    @Column(name = "model", nullable = false)
    private String model;

    @NotNull
    @Column(name = "year", nullable = false)
    private Integer year;

    @OneToOne(mappedBy = "vehicle", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private VehicleDetail vehicleDetail;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "vehicle")
    @JsonIgnoreProperties(value = { "photos", "vehicle" }, allowSetters = true)
    private Set<Inspection> inspections = new HashSet<>();

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "vehicle")
    @JsonIgnoreProperties(value = { "photos", "vehicle" }, allowSetters = true)
    private Set<Accident> accidents = new HashSet<>();

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "vehicle")
    @JsonIgnoreProperties(value = { "photos", "vehicle" }, allowSetters = true)
    private Set<Service> services = new HashSet<>();

    public Vehicle() {
    }

    public Vehicle(VehicleDTO vehicleDTO) {
        this.vin = vehicleDTO.getVin();
        this.make = vehicleDTO.getMake();
        this.model = vehicleDTO.getModel();
        this.year = vehicleDTO.getYear();
    }

    public String getVin() {
        return this.vin;
    }

    public Vehicle vin(String vin) {
        this.setVin(vin);
        return this;
    }

    public void setVin(String vin) {
        this.vin = vin;
    }

    public String getMake() {
        return this.make;
    }

    public Vehicle make(String make) {
        this.setMake(make);
        return this;
    }

    public void setMake(String make) {
        this.make = make;
    }

    public String getModel() {
        return this.model;
    }

    public Vehicle model(String model) {
        this.setModel(model);
        return this;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public Integer getYear() {
        return this.year;
    }

    public Vehicle year(Integer year) {
        this.setYear(year);
        return this;
    }

    public void setYear(Integer year) {
        this.year = year;
    }

    public Set<Inspection> getInspections() {
        return this.inspections;
    }

    public void setInspections(Set<Inspection> inspections) {
        if (this.inspections != null) {
            this.inspections.forEach(i -> i.setVehicle(null));
        }
        if (inspections != null) {
            inspections.forEach(i -> i.setVehicle(this));
        }
        this.inspections = inspections;
    }

    public Vehicle inspections(Set<Inspection> inspections) {
        this.setInspections(inspections);
        return this;
    }

    public Vehicle addInspections(Inspection inspection) {
        this.inspections.add(inspection);
        inspection.setVehicle(this);
        return this;
    }

    public Vehicle removeInspections(Inspection inspection) {
        this.inspections.remove(inspection);
        inspection.setVehicle(null);
        return this;
    }

    public Set<Accident> getAccidents() {
        return this.accidents;
    }

    public void setAccidents(Set<Accident> accidents) {
        if (this.accidents != null) {
            this.accidents.forEach(i -> i.setVehicle(null));
        }
        if (accidents != null) {
            accidents.forEach(i -> i.setVehicle(this));
        }
        this.accidents = accidents;
    }

    public Vehicle accidents(Set<Accident> accidents) {
        this.setAccidents(accidents);
        return this;
    }

    public Vehicle addAccidents(Accident accident) {
        this.accidents.add(accident);
        accident.setVehicle(this);
        return this;
    }

    public Vehicle removeAccidents(Accident accident) {
        this.accidents.remove(accident);
        accident.setVehicle(null);
        return this;
    }

    public Set<Service> getServices() {
        return this.services;
    }

    public void setServices(Set<Service> services) {
        if (this.services != null) {
            this.services.forEach(i -> i.setVehicle(null));
        }
        if (services != null) {
            services.forEach(i -> i.setVehicle(this));
        }
        this.services = services;
    }

    public Vehicle services(Set<Service> services) {
        this.setServices(services);
        return this;
    }

    public Vehicle addServices(Service service) {
        this.services.add(service);
        service.setVehicle(this);
        return this;
    }

    public Vehicle removeServices(Service service) {
        this.services.remove(service);
        service.setVehicle(null);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }

    public VehicleDetail getVehicleDetail() {
        return vehicleDetail;
    }

    public void setVehicleDetail(VehicleDetail vehicleDetail) {
        this.vehicleDetail = vehicleDetail;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Vehicle)) {
            return false;
        }
        return getVin() != null && getVin().equals(((Vehicle) o).getVin());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Vehicle{" +
            "vin=" + getVin() +
            ", make='" + getMake() + "'" +
            ", model='" + getModel() + "'" +
            ", year=" + getYear() +
            "}";
    }
}
