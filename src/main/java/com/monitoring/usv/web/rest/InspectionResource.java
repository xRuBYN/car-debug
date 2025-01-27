package com.monitoring.usv.web.rest;

import com.monitoring.usv.domain.Inspection;
import com.monitoring.usv.repository.InspectionRepository;
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
 * REST controller for managing {@link com.monitoring.usv.domain.Inspection}.
 */
@RestController
@RequestMapping("/api/inspections")
@Transactional
public class InspectionResource {

    private static final Logger LOG = LoggerFactory.getLogger(InspectionResource.class);

    private static final String ENTITY_NAME = "inspection";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final InspectionRepository inspectionRepository;

    public InspectionResource(InspectionRepository inspectionRepository) {
        this.inspectionRepository = inspectionRepository;
    }

    /**
     * {@code POST  /inspections} : Create a new inspection.
     *
     * @param inspection the inspection to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new inspection, or with status {@code 400 (Bad Request)} if the inspection has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<Inspection> createInspection(@Valid @RequestBody Inspection inspection) throws URISyntaxException {
        LOG.debug("REST request to save Inspection : {}", inspection);
        if (inspection.getId() != null) {
            throw new BadRequestAlertException("A new inspection cannot already have an ID", ENTITY_NAME, "idexists");
        }
        inspection = inspectionRepository.save(inspection);
        return ResponseEntity.created(new URI("/api/inspections/" + inspection.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, inspection.getId().toString()))
            .body(inspection);
    }

    /**
     * {@code PUT  /inspections/:id} : Updates an existing inspection.
     *
     * @param id the id of the inspection to save.
     * @param inspection the inspection to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated inspection,
     * or with status {@code 400 (Bad Request)} if the inspection is not valid,
     * or with status {@code 500 (Internal Server Error)} if the inspection couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Inspection> updateInspection(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Inspection inspection
    ) throws URISyntaxException {
        LOG.debug("REST request to update Inspection : {}, {}", id, inspection);
        if (inspection.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, inspection.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!inspectionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        inspection = inspectionRepository.save(inspection);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, inspection.getId().toString()))
            .body(inspection);
    }

    /**
     * {@code PATCH  /inspections/:id} : Partial updates given fields of an existing inspection, field will ignore if it is null
     *
     * @param id the id of the inspection to save.
     * @param inspection the inspection to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated inspection,
     * or with status {@code 400 (Bad Request)} if the inspection is not valid,
     * or with status {@code 404 (Not Found)} if the inspection is not found,
     * or with status {@code 500 (Internal Server Error)} if the inspection couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Inspection> partialUpdateInspection(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Inspection inspection
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update Inspection partially : {}, {}", id, inspection);
        if (inspection.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, inspection.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!inspectionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Inspection> result = inspectionRepository
            .findById(inspection.getId())
            .map(existingInspection -> {
                if (inspection.getDescription() != null) {
                    existingInspection.setDescription(inspection.getDescription());
                }
                if (inspection.getCreatedBy() != null) {
                    existingInspection.setCreatedBy(inspection.getCreatedBy());
                }
                if (inspection.getCreatedDate() != null) {
                    existingInspection.setCreatedDate(inspection.getCreatedDate());
                }
                if (inspection.getLastModifiedBy() != null) {
                    existingInspection.setLastModifiedBy(inspection.getLastModifiedBy());
                }
                if (inspection.getLastModifiedDate() != null) {
                    existingInspection.setLastModifiedDate(inspection.getLastModifiedDate());
                }

                return existingInspection;
            })
            .map(inspectionRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, inspection.getId().toString())
        );
    }

    /**
     * {@code GET  /inspections} : get all the inspections.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of inspections in body.
     */
    @GetMapping("")
    public List<Inspection> getAllInspections() {
        LOG.debug("REST request to get all Inspections");
        return inspectionRepository.findAll();
    }

    /**
     * {@code GET  /inspections/:id} : get the "id" inspection.
     *
     * @param id the id of the inspection to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the inspection, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Inspection> getInspection(@PathVariable("id") Long id) {
        LOG.debug("REST request to get Inspection : {}", id);
        Optional<Inspection> inspection = inspectionRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(inspection);
    }

    /**
     * {@code DELETE  /inspections/:id} : delete the "id" inspection.
     *
     * @param id the id of the inspection to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInspection(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete Inspection : {}", id);
        inspectionRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
