package com.monitoring.usv.web.rest;

import com.monitoring.usv.domain.Accident;
import com.monitoring.usv.repository.AccidentRepository;
import com.monitoring.usv.web.rest.errors.BadRequestAlertException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.monitoring.usv.domain.Accident}.
 */
@RestController
@RequestMapping("/api/accidents")
@Transactional
public class AccidentResource {

    private static final Logger LOG = LoggerFactory.getLogger(AccidentResource.class);

    private static final String ENTITY_NAME = "accident";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final AccidentRepository accidentRepository;

    public AccidentResource(AccidentRepository accidentRepository) {
        this.accidentRepository = accidentRepository;
    }

    /**
     * {@code POST  /accidents} : Create a new accident.
     *
     * @param accident the accident to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new accident, or with status {@code 400 (Bad Request)} if the accident has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<Accident> createAccident(@Valid @RequestBody Accident accident) throws URISyntaxException {
        LOG.debug("REST request to save Accident : {}", accident);
        if (accident.getId() != null) {
            throw new BadRequestAlertException("A new accident cannot already have an ID", ENTITY_NAME, "idexists");
        }
        accident = accidentRepository.save(accident);
        return ResponseEntity.created(new URI("/api/accidents/" + accident.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, accident.getId().toString()))
            .body(accident);
    }

    /**
     * {@code PUT  /accidents/:id} : Updates an existing accident.
     *
     * @param id the id of the accident to save.
     * @param accident the accident to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated accident,
     * or with status {@code 400 (Bad Request)} if the accident is not valid,
     * or with status {@code 500 (Internal Server Error)} if the accident couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Accident> updateAccident(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Accident accident
    ) throws URISyntaxException {
        LOG.debug("REST request to update Accident : {}, {}", id, accident);
        if (accident.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, accident.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!accidentRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        accident = accidentRepository.save(accident);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, accident.getId().toString()))
            .body(accident);
    }

    /**
     * {@code PATCH  /accidents/:id} : Partial updates given fields of an existing accident, field will ignore if it is null
     *
     * @param id the id of the accident to save.
     * @param accident the accident to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated accident,
     * or with status {@code 400 (Bad Request)} if the accident is not valid,
     * or with status {@code 404 (Not Found)} if the accident is not found,
     * or with status {@code 500 (Internal Server Error)} if the accident couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Accident> partialUpdateAccident(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Accident accident
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update Accident partially : {}, {}", id, accident);
        if (accident.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, accident.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!accidentRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Accident> result = accidentRepository
            .findById(accident.getId())
            .map(existingAccident -> {
                if (accident.getDescription() != null) {
                    existingAccident.setDescription(accident.getDescription());
                }
                if (accident.getCreatedBy() != null) {
                    existingAccident.setCreatedBy(accident.getCreatedBy());
                }
                if (accident.getCreatedDate() != null) {
                    existingAccident.setCreatedDate(accident.getCreatedDate());
                }
                if (accident.getLastModifiedBy() != null) {
                    existingAccident.setLastModifiedBy(accident.getLastModifiedBy());
                }
                if (accident.getLastModifiedDate() != null) {
                    existingAccident.setLastModifiedDate(accident.getLastModifiedDate());
                }

                return existingAccident;
            })
            .map(accidentRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, accident.getId().toString())
        );
    }

    /**
     * {@code GET  /accidents} : get all the accidents.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of accidents in body.
     */
    @GetMapping("")
    public List<Accident> getAllAccidents() {
        LOG.debug("REST request to get all Accidents");
        return accidentRepository.findAll();
    }

    /**
     * {@code GET  /accidents/:id} : get the "id" accident.
     *
     * @param id the id of the accident to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the accident, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Accident> getAccident(@PathVariable("id") Long id) {
        LOG.debug("REST request to get Accident : {}", id);
        Optional<Accident> accident = accidentRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(accident);
    }

    /**
     * {@code DELETE  /accidents/:id} : delete the "id" accident.
     *
     * @param id the id of the accident to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAccident(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete Accident : {}", id);
        accidentRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
