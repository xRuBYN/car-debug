package com.monitoring.usv.web.rest;

import com.monitoring.usv.domain.BankCard;
import com.monitoring.usv.repository.BankCardRepository;
import com.monitoring.usv.web.rest.errors.BadRequestAlertException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.monitoring.usv.domain.BankCard}.
 */
@RestController
@RequestMapping("/api/bank-cards")
@Transactional
public class BankCardResource {

    private static final Logger LOG = LoggerFactory.getLogger(BankCardResource.class);

    private static final String ENTITY_NAME = "bankCard";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final BankCardRepository bankCardRepository;

    public BankCardResource(BankCardRepository bankCardRepository) {
        this.bankCardRepository = bankCardRepository;
    }

    /**
     * {@code POST  /bank-cards} : Create a new bankCard.
     *
     * @param bankCard the bankCard to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new bankCard, or with status {@code 400 (Bad Request)} if the bankCard has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<BankCard> createBankCard(@Valid @RequestBody BankCard bankCard) throws URISyntaxException {
        LOG.debug("REST request to save BankCard : {}", bankCard);
        if (bankCard.getId() != null) {
            throw new BadRequestAlertException("A new bankCard cannot already have an ID", ENTITY_NAME, "idexists");
        }
        bankCard = bankCardRepository.save(bankCard);
        return ResponseEntity.created(new URI("/api/bank-cards/" + bankCard.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, bankCard.getId().toString()))
            .body(bankCard);
    }

    /**
     * {@code PUT  /bank-cards/:id} : Updates an existing bankCard.
     *
     * @param id the id of the bankCard to save.
     * @param bankCard the bankCard to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated bankCard,
     * or with status {@code 400 (Bad Request)} if the bankCard is not valid,
     * or with status {@code 500 (Internal Server Error)} if the bankCard couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<BankCard> updateBankCard(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody BankCard bankCard
    ) throws URISyntaxException {
        LOG.debug("REST request to update BankCard : {}, {}", id, bankCard);
        if (bankCard.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, bankCard.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!bankCardRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        bankCard = bankCardRepository.save(bankCard);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, bankCard.getId().toString()))
            .body(bankCard);
    }

    /**
     * {@code PATCH  /bank-cards/:id} : Partial updates given fields of an existing bankCard, field will ignore if it is null
     *
     * @param id the id of the bankCard to save.
     * @param bankCard the bankCard to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated bankCard,
     * or with status {@code 400 (Bad Request)} if the bankCard is not valid,
     * or with status {@code 404 (Not Found)} if the bankCard is not found,
     * or with status {@code 500 (Internal Server Error)} if the bankCard couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<BankCard> partialUpdateBankCard(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody BankCard bankCard
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update BankCard partially : {}, {}", id, bankCard);
        if (bankCard.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, bankCard.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!bankCardRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<BankCard> result = bankCardRepository
            .findById(bankCard.getId())
            .map(existingBankCard -> {
                if (bankCard.getCardCode() != null) {
                    existingBankCard.setCardCode(bankCard.getCardCode());
                }
                if (bankCard.getFirstName() != null) {
                    existingBankCard.setFirstName(bankCard.getFirstName());
                }
                if (bankCard.getLastName() != null) {
                    existingBankCard.setLastName(bankCard.getLastName());
                }
                if (bankCard.getCvv() != null) {
                    existingBankCard.setCvv(bankCard.getCvv());
                }

                return existingBankCard;
            })
            .map(bankCardRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, bankCard.getId().toString())
        );
    }

    /**
     * {@code GET  /bank-cards} : get all the bankCards.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of bankCards in body.
     */
    @GetMapping("")
    public List<BankCard> getAllBankCards() {
        LOG.debug("REST request to get all BankCards");
        return bankCardRepository.findAll();
    }

    /**
     * {@code GET  /bank-cards/:id} : get the "id" bankCard.
     *
     * @param id the id of the bankCard to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the bankCard, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<BankCard> getBankCard(@PathVariable("id") Long id) {
        LOG.debug("REST request to get BankCard : {}", id);
        Optional<BankCard> bankCard = bankCardRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(bankCard);
    }

    /**
     * {@code DELETE  /bank-cards/:id} : delete the "id" bankCard.
     *
     * @param id the id of the bankCard to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBankCard(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete BankCard : {}", id);
        bankCardRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
