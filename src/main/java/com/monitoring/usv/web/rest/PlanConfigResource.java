package com.monitoring.usv.web.rest;

import com.monitoring.usv.domain.PlanConfig;
import com.monitoring.usv.repository.PlanConfigRepository;
import com.monitoring.usv.service.PurchasePlanService;
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
 * REST controller for managing {@link com.monitoring.usv.domain.PlanConfig}.
 */
@RestController
@RequestMapping("/api/plan-configs")
@Transactional
public class PlanConfigResource {

    private static final Logger LOG = LoggerFactory.getLogger(PlanConfigResource.class);

    private static final String ENTITY_NAME = "planConfig";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final PlanConfigRepository planConfigRepository;

    private final PurchasePlanService purchasePlanService;

    public PlanConfigResource(PlanConfigRepository planConfigRepository, PurchasePlanService purchasePlanService) {
        this.planConfigRepository = planConfigRepository;
        this.purchasePlanService = purchasePlanService;
    }

    /**
     * {@code POST  /plan-configs} : Create a new planConfig.
     *
     * @param planConfig the planConfig to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new planConfig, or with status {@code 400 (Bad Request)} if the planConfig has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<PlanConfig> createPlanConfig(@Valid @RequestBody PlanConfig planConfig) throws URISyntaxException {
        LOG.debug("REST request to save PlanConfig : {}", planConfig);
        if (planConfig.getId() != null) {
            throw new BadRequestAlertException("A new planConfig cannot already have an ID", ENTITY_NAME, "idexists");
        }
        planConfig = planConfigRepository.save(planConfig);
        return ResponseEntity.created(new URI("/api/plan-configs/" + planConfig.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, planConfig.getId().toString()))
            .body(planConfig);
    }

    /**
     * {@code PUT  /plan-configs/:id} : Updates an existing planConfig.
     *
     * @param id the id of the planConfig to save.
     * @param planConfig the planConfig to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated planConfig,
     * or with status {@code 400 (Bad Request)} if the planConfig is not valid,
     * or with status {@code 500 (Internal Server Error)} if the planConfig couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<PlanConfig> updatePlanConfig(
        @PathVariable(value = "id", required = false) final UUID id,
        @Valid @RequestBody PlanConfig planConfig
    ) throws URISyntaxException {
        LOG.debug("REST request to update PlanConfig : {}, {}", id, planConfig);
        if (planConfig.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, planConfig.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!planConfigRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        planConfig = planConfigRepository.save(planConfig);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, planConfig.getId().toString()))
            .body(planConfig);
    }

    /**
     * {@code GET  /plan-configs} : get all the planConfigs.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of planConfigs in body.
     */
    @GetMapping("")
    public List<PlanConfig> getAllPlanConfigs() {
        LOG.debug("REST request to get all PlanConfigs");
        return planConfigRepository.findAll();
    }

    /**
     * {@code GET  /plan-configs/:id} : get the "id" planConfig.
     *
     * @param id the id of the planConfig to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the planConfig, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<PlanConfig> getPlanConfig(@PathVariable("id") UUID id) {
        LOG.debug("REST request to get PlanConfig : {}", id);
        Optional<PlanConfig> planConfig = planConfigRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(planConfig);
    }

    @PostMapping("/purchase/{id}")
    public ResponseEntity<Void> purchasePlanConfig(@PathVariable("id") UUID id) {
        LOG.debug("REST request to purchase PlanConfig : {}", id);
        PlanConfig planConfig = purchasePlanService.buyPlan(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, planConfig.getPlanType().toString()))
            .build();
    }

    /**
     * {@code DELETE  /plan-configs/:id} : delete the "id" vehicle.
     *
     * @param id the id of the plan-configs to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVehicle(@PathVariable("id") UUID id) {
        LOG.debug("REST request to delete PlanConfig : {}", id);
        planConfigRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
