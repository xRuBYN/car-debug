package com.monitoring.usv.web.rest;

import static com.monitoring.usv.domain.PlanConfigAsserts.*;
import static com.monitoring.usv.web.rest.TestUtil.createUpdateProxyForBean;
import static com.monitoring.usv.web.rest.TestUtil.sameNumber;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.monitoring.usv.IntegrationTest;
import com.monitoring.usv.domain.PlanConfig;
import com.monitoring.usv.repository.PlanConfigRepository;
import jakarta.persistence.EntityManager;
import java.math.BigDecimal;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link PlanConfigResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class PlanConfigResourceIT {

    private static final BigDecimal DEFAULT_PRICE = new BigDecimal(1);
    private static final BigDecimal UPDATED_PRICE = new BigDecimal(2);

    private static final Long DEFAULT_ATTEMPTS = 1L;
    private static final Long UPDATED_ATTEMPTS = 2L;

    private static final String ENTITY_API_URL = "/api/plan-configs";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private PlanConfigRepository planConfigRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restPlanConfigMockMvc;

    private PlanConfig planConfig;

    private PlanConfig insertedPlanConfig;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static PlanConfig createEntity() {
        return new PlanConfig().price(DEFAULT_PRICE).attempts(DEFAULT_ATTEMPTS);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static PlanConfig createUpdatedEntity() {
        return new PlanConfig().price(UPDATED_PRICE).attempts(UPDATED_ATTEMPTS);
    }

    @BeforeEach
    public void initTest() {
        planConfig = createEntity();
    }

    @AfterEach
    public void cleanup() {
        if (insertedPlanConfig != null) {
            planConfigRepository.delete(insertedPlanConfig);
            insertedPlanConfig = null;
        }
    }

    @Test
    @Transactional
    void createPlanConfig() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the PlanConfig
        var returnedPlanConfig = om.readValue(
            restPlanConfigMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(planConfig)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            PlanConfig.class
        );

        // Validate the PlanConfig in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertPlanConfigUpdatableFieldsEquals(returnedPlanConfig, getPersistedPlanConfig(returnedPlanConfig));

        insertedPlanConfig = returnedPlanConfig;
    }

    @Test
    @Transactional
    void createPlanConfigWithExistingId() throws Exception {
        // Create the PlanConfig with an existing ID
        planConfig.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restPlanConfigMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(planConfig)))
            .andExpect(status().isBadRequest());

        // Validate the PlanConfig in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkPriceIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        planConfig.setPrice(null);

        // Create the PlanConfig, which fails.

        restPlanConfigMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(planConfig)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkAttemptsIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        planConfig.setAttempts(null);

        // Create the PlanConfig, which fails.

        restPlanConfigMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(planConfig)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllPlanConfigs() throws Exception {
        // Initialize the database
        insertedPlanConfig = planConfigRepository.saveAndFlush(planConfig);

        // Get all the planConfigList
        restPlanConfigMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(planConfig.getId().intValue())))
            .andExpect(jsonPath("$.[*].price").value(hasItem(sameNumber(DEFAULT_PRICE))))
            .andExpect(jsonPath("$.[*].attempts").value(hasItem(DEFAULT_ATTEMPTS.intValue())));
    }

    @Test
    @Transactional
    void getPlanConfig() throws Exception {
        // Initialize the database
        insertedPlanConfig = planConfigRepository.saveAndFlush(planConfig);

        // Get the planConfig
        restPlanConfigMockMvc
            .perform(get(ENTITY_API_URL_ID, planConfig.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(planConfig.getId().intValue()))
            .andExpect(jsonPath("$.price").value(sameNumber(DEFAULT_PRICE)))
            .andExpect(jsonPath("$.attempts").value(DEFAULT_ATTEMPTS.intValue()));
    }

    @Test
    @Transactional
    void getNonExistingPlanConfig() throws Exception {
        // Get the planConfig
        restPlanConfigMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingPlanConfig() throws Exception {
        // Initialize the database
        insertedPlanConfig = planConfigRepository.saveAndFlush(planConfig);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the planConfig
        PlanConfig updatedPlanConfig = planConfigRepository.findById(planConfig.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedPlanConfig are not directly saved in db
        em.detach(updatedPlanConfig);
        updatedPlanConfig.price(UPDATED_PRICE).attempts(UPDATED_ATTEMPTS);

        restPlanConfigMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedPlanConfig.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedPlanConfig))
            )
            .andExpect(status().isOk());

        // Validate the PlanConfig in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedPlanConfigToMatchAllProperties(updatedPlanConfig);
    }

    @Test
    @Transactional
    void putNonExistingPlanConfig() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        planConfig.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPlanConfigMockMvc
            .perform(
                put(ENTITY_API_URL_ID, planConfig.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(planConfig))
            )
            .andExpect(status().isBadRequest());

        // Validate the PlanConfig in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchPlanConfig() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        planConfig.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPlanConfigMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(planConfig))
            )
            .andExpect(status().isBadRequest());

        // Validate the PlanConfig in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamPlanConfig() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        planConfig.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPlanConfigMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(planConfig)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the PlanConfig in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdatePlanConfigWithPatch() throws Exception {
        // Initialize the database
        insertedPlanConfig = planConfigRepository.saveAndFlush(planConfig);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the planConfig using partial update
        PlanConfig partialUpdatedPlanConfig = new PlanConfig();
        partialUpdatedPlanConfig.setId(planConfig.getId());

        partialUpdatedPlanConfig.price(UPDATED_PRICE);

        restPlanConfigMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPlanConfig.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedPlanConfig))
            )
            .andExpect(status().isOk());

        // Validate the PlanConfig in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPlanConfigUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedPlanConfig, planConfig),
            getPersistedPlanConfig(planConfig)
        );
    }

    @Test
    @Transactional
    void fullUpdatePlanConfigWithPatch() throws Exception {
        // Initialize the database
        insertedPlanConfig = planConfigRepository.saveAndFlush(planConfig);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the planConfig using partial update
        PlanConfig partialUpdatedPlanConfig = new PlanConfig();
        partialUpdatedPlanConfig.setId(planConfig.getId());

        partialUpdatedPlanConfig.price(UPDATED_PRICE).attempts(UPDATED_ATTEMPTS);

        restPlanConfigMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPlanConfig.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedPlanConfig))
            )
            .andExpect(status().isOk());

        // Validate the PlanConfig in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPlanConfigUpdatableFieldsEquals(partialUpdatedPlanConfig, getPersistedPlanConfig(partialUpdatedPlanConfig));
    }

    @Test
    @Transactional
    void patchNonExistingPlanConfig() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        planConfig.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPlanConfigMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, planConfig.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(planConfig))
            )
            .andExpect(status().isBadRequest());

        // Validate the PlanConfig in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchPlanConfig() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        planConfig.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPlanConfigMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(planConfig))
            )
            .andExpect(status().isBadRequest());

        // Validate the PlanConfig in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamPlanConfig() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        planConfig.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPlanConfigMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(planConfig)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the PlanConfig in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deletePlanConfig() throws Exception {
        // Initialize the database
        insertedPlanConfig = planConfigRepository.saveAndFlush(planConfig);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the planConfig
        restPlanConfigMockMvc
            .perform(delete(ENTITY_API_URL_ID, planConfig.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return planConfigRepository.count();
    }

    protected void assertIncrementedRepositoryCount(long countBefore) {
        assertThat(countBefore + 1).isEqualTo(getRepositoryCount());
    }

    protected void assertDecrementedRepositoryCount(long countBefore) {
        assertThat(countBefore - 1).isEqualTo(getRepositoryCount());
    }

    protected void assertSameRepositoryCount(long countBefore) {
        assertThat(countBefore).isEqualTo(getRepositoryCount());
    }

    protected PlanConfig getPersistedPlanConfig(PlanConfig planConfig) {
        return planConfigRepository.findById(planConfig.getId()).orElseThrow();
    }

    protected void assertPersistedPlanConfigToMatchAllProperties(PlanConfig expectedPlanConfig) {
        assertPlanConfigAllPropertiesEquals(expectedPlanConfig, getPersistedPlanConfig(expectedPlanConfig));
    }

    protected void assertPersistedPlanConfigToMatchUpdatableProperties(PlanConfig expectedPlanConfig) {
        assertPlanConfigAllUpdatablePropertiesEquals(expectedPlanConfig, getPersistedPlanConfig(expectedPlanConfig));
    }
}
