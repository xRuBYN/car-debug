package com.monitoring.usv.domain;

import io.undertow.security.idm.Account;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.util.UUID;

/**
 * A BankCard.
 */
@Entity
@Table(name = "bank_card")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class BankCard implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @NotNull
    @Size(max = 16)
    @Column(name = "card_code", length = 16, nullable = false)
    private String cardCode;

    @NotNull
    @Size(max = 50)
    @Column(name = "first_name", length = 50, nullable = false)
    private String firstName;

    @NotNull
    @Size(max = 50)
    @Column(name = "last_name", length = 50, nullable = false)
    private String lastName;

    @NotNull
    @Size(max = 3)
    @Column(name = "cvv", length = 3, nullable = false)
    private String cvv;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false )
    private User user;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public BankCard id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCardCode() {
        return this.cardCode;
    }

    public BankCard cardCode(String cardCode) {
        this.setCardCode(cardCode);
        return this;
    }

    public void setCardCode(String cardCode) {
        this.cardCode = cardCode;
    }

    public String getFirstName() {
        return this.firstName;
    }

    public BankCard firstName(String firstName) {
        this.setFirstName(firstName);
        return this;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return this.lastName;
    }

    public BankCard lastName(String lastName) {
        this.setLastName(lastName);
        return this;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getCvv() {
        return this.cvv;
    }

    public BankCard cvv(String cvv) {
        this.setCvv(cvv);
        return this;
    }

    public void setCvv(String cvv) {
        this.cvv = cvv;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof BankCard)) {
            return false;
        }
        return getId() != null && getId().equals(((BankCard) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "BankCard{" +
            "id=" + getId() +
            ", cardCode='" + getCardCode() + "'" +
            ", firstName='" + getFirstName() + "'" +
            ", lastName='" + getLastName() + "'" +
            ", cvv='" + getCvv() + "'" +
            "}";
    }
}
