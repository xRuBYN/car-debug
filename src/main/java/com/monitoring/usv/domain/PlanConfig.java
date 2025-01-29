package com.monitoring.usv.domain;

import com.monitoring.usv.domain.enumeration.PlanType;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.UUID;

/**
 * A PlanConfig.
 */
@Entity
@Table(name = "plan_config")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class PlanConfig implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue
    @Column(name = "id")
    private UUID id;

    @Enumerated(EnumType.STRING)
    @Column(name = "plan_type")
    private PlanType planType = PlanType.FREE;

    @NotNull
    @Column(name = "price", precision = 21, scale = 2, nullable = false)
    private BigDecimal price;

    @NotNull
    @Column(name = "attempts", nullable = false)
    private Long attempts;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public UUID getId() {
        return this.id;
    }

    public PlanConfig id(UUID id) {
        this.setId(id);
        return this;
    }

    public PlanType getPlanType() {
        return planType;
    }

    public void setPlanType(PlanType planType) {
        this.planType = planType;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public BigDecimal getPrice() {
        return this.price;
    }

    public PlanConfig price(BigDecimal price) {
        this.setPrice(price);
        return this;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public Long getAttempts() {
        return this.attempts;
    }

    public PlanConfig attempts(Long attempts) {
        this.setAttempts(attempts);
        return this;
    }

    public void setAttempts(Long attempts) {
        this.attempts = attempts;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof PlanConfig)) {
            return false;
        }
        return getId() != null && getId().equals(((PlanConfig) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    @Override
    public String toString() {
        return "PlanConfig{" +
                "id=" + id +
                ", planType=" + planType +
                ", price=" + price +
                ", attempts=" + attempts +
                '}';
    }
}
