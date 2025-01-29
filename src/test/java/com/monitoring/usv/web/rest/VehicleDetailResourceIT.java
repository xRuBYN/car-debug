package com.monitoring.usv.web.rest;

import static com.monitoring.usv.domain.VehicleDetailAsserts.*;
import static com.monitoring.usv.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.monitoring.usv.IntegrationTest;
import com.monitoring.usv.domain.VehicleDetail;
import com.monitoring.usv.repository.VehicleDetailRepository;
import jakarta.persistence.EntityManager;
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
 * Integration tests for the {@link VehicleDetailResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class VehicleDetailResourceIT {

    private static final String DEFAULT_COLOR = "AAAAAAAAAA";
    private static final String UPDATED_COLOR = "BBBBBBBBBB";

    private static final String DEFAULT_ENGINE_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_ENGINE_DESCRIPTION = "BBBBBBBBBB";

    private static final String DEFAULT_FUEL_TYPE = "AAAAAAAAAA";
    private static final String UPDATED_FUEL_TYPE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/vehicle-details";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private VehicleDetailRepository vehicleDetailRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restVehicleDetailMockMvc;

    private VehicleDetail vehicleDetail;

    private VehicleDetail insertedVehicleDetail;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static VehicleDetail createEntity() {
        return new VehicleDetail().color(DEFAULT_COLOR).engineDescription(DEFAULT_ENGINE_DESCRIPTION).fuelType(DEFAULT_FUEL_TYPE);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static VehicleDetail createUpdatedEntity() {
        return new VehicleDetail().color(UPDATED_COLOR).engineDescription(UPDATED_ENGINE_DESCRIPTION).fuelType(UPDATED_FUEL_TYPE);
    }

    @BeforeEach
    public void initTest() {
        vehicleDetail = createEntity();
    }

    @AfterEach
    public void cleanup() {
        if (insertedVehicleDetail != null) {
            vehicleDetailRepository.delete(insertedVehicleDetail);
            insertedVehicleDetail = null;
        }
    }

    @Test
    @Transactional
    void createVehicleDetail() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the VehicleDetail
        var returnedVehicleDetail = om.readValue(
            restVehicleDetailMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(vehicleDetail)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            VehicleDetail.class
        );

        // Validate the VehicleDetail in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertVehicleDetailUpdatableFieldsEquals(returnedVehicleDetail, getPersistedVehicleDetail(returnedVehicleDetail));

        insertedVehicleDetail = returnedVehicleDetail;
    }

    @Test
    @Transactional
    void createVehicleDetailWithExistingId() throws Exception {
        // Create the VehicleDetail with an existing ID
        vehicleDetail.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restVehicleDetailMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(vehicleDetail)))
            .andExpect(status().isBadRequest());

        // Validate the VehicleDetail in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllVehicleDetails() throws Exception {
        // Initialize the database
        insertedVehicleDetail = vehicleDetailRepository.saveAndFlush(vehicleDetail);

        // Get all the vehicleDetailList
        restVehicleDetailMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(vehicleDetail.getId().intValue())))
            .andExpect(jsonPath("$.[*].color").value(hasItem(DEFAULT_COLOR)))
            .andExpect(jsonPath("$.[*].engineDescription").value(hasItem(DEFAULT_ENGINE_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].fuelType").value(hasItem(DEFAULT_FUEL_TYPE)));
    }

    @Test
    @Transactional
    void getVehicleDetail() throws Exception {
        // Initialize the database
        insertedVehicleDetail = vehicleDetailRepository.saveAndFlush(vehicleDetail);

        // Get the vehicleDetail
        restVehicleDetailMockMvc
            .perform(get(ENTITY_API_URL_ID, vehicleDetail.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(vehicleDetail.getId().intValue()))
            .andExpect(jsonPath("$.color").value(DEFAULT_COLOR))
            .andExpect(jsonPath("$.engineDescription").value(DEFAULT_ENGINE_DESCRIPTION))
            .andExpect(jsonPath("$.fuelType").value(DEFAULT_FUEL_TYPE));
    }

    @Test
    @Transactional
    void getNonExistingVehicleDetail() throws Exception {
        // Get the vehicleDetail
        restVehicleDetailMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingVehicleDetail() throws Exception {
        // Initialize the database
        insertedVehicleDetail = vehicleDetailRepository.saveAndFlush(vehicleDetail);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the vehicleDetail
        VehicleDetail updatedVehicleDetail = vehicleDetailRepository.findById(vehicleDetail.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedVehicleDetail are not directly saved in db
        em.detach(updatedVehicleDetail);
        updatedVehicleDetail.color(UPDATED_COLOR).engineDescription(UPDATED_ENGINE_DESCRIPTION).fuelType(UPDATED_FUEL_TYPE);

        restVehicleDetailMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedVehicleDetail.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedVehicleDetail))
            )
            .andExpect(status().isOk());

        // Validate the VehicleDetail in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedVehicleDetailToMatchAllProperties(updatedVehicleDetail);
    }

    @Test
    @Transactional
    void putNonExistingVehicleDetail() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        vehicleDetail.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restVehicleDetailMockMvc
            .perform(
                put(ENTITY_API_URL_ID, vehicleDetail.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(vehicleDetail))
            )
            .andExpect(status().isBadRequest());

        // Validate the VehicleDetail in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchVehicleDetail() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        vehicleDetail.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVehicleDetailMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(vehicleDetail))
            )
            .andExpect(status().isBadRequest());

        // Validate the VehicleDetail in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamVehicleDetail() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        vehicleDetail.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVehicleDetailMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(vehicleDetail)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the VehicleDetail in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateVehicleDetailWithPatch() throws Exception {
        // Initialize the database
        insertedVehicleDetail = vehicleDetailRepository.saveAndFlush(vehicleDetail);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the vehicleDetail using partial update
        VehicleDetail partialUpdatedVehicleDetail = new VehicleDetail();
        partialUpdatedVehicleDetail.setId(vehicleDetail.getId());

        partialUpdatedVehicleDetail.color(UPDATED_COLOR);

        restVehicleDetailMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedVehicleDetail.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedVehicleDetail))
            )
            .andExpect(status().isOk());

        // Validate the VehicleDetail in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertVehicleDetailUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedVehicleDetail, vehicleDetail),
            getPersistedVehicleDetail(vehicleDetail)
        );
    }

    @Test
    @Transactional
    void fullUpdateVehicleDetailWithPatch() throws Exception {
        // Initialize the database
        insertedVehicleDetail = vehicleDetailRepository.saveAndFlush(vehicleDetail);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the vehicleDetail using partial update
        VehicleDetail partialUpdatedVehicleDetail = new VehicleDetail();
        partialUpdatedVehicleDetail.setId(vehicleDetail.getId());

        partialUpdatedVehicleDetail.color(UPDATED_COLOR).engineDescription(UPDATED_ENGINE_DESCRIPTION).fuelType(UPDATED_FUEL_TYPE);

        restVehicleDetailMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedVehicleDetail.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedVehicleDetail))
            )
            .andExpect(status().isOk());

        // Validate the VehicleDetail in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertVehicleDetailUpdatableFieldsEquals(partialUpdatedVehicleDetail, getPersistedVehicleDetail(partialUpdatedVehicleDetail));
    }

    @Test
    @Transactional
    void patchNonExistingVehicleDetail() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        vehicleDetail.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restVehicleDetailMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, vehicleDetail.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(vehicleDetail))
            )
            .andExpect(status().isBadRequest());

        // Validate the VehicleDetail in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchVehicleDetail() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        vehicleDetail.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVehicleDetailMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(vehicleDetail))
            )
            .andExpect(status().isBadRequest());

        // Validate the VehicleDetail in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamVehicleDetail() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        vehicleDetail.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVehicleDetailMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(vehicleDetail)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the VehicleDetail in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteVehicleDetail() throws Exception {
        // Initialize the database
        insertedVehicleDetail = vehicleDetailRepository.saveAndFlush(vehicleDetail);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the vehicleDetail
        restVehicleDetailMockMvc
            .perform(delete(ENTITY_API_URL_ID, vehicleDetail.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return vehicleDetailRepository.count();
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

    protected VehicleDetail getPersistedVehicleDetail(VehicleDetail vehicleDetail) {
        return vehicleDetailRepository.findById(vehicleDetail.getId()).orElseThrow();
    }

    protected void assertPersistedVehicleDetailToMatchAllProperties(VehicleDetail expectedVehicleDetail) {
        assertVehicleDetailAllPropertiesEquals(expectedVehicleDetail, getPersistedVehicleDetail(expectedVehicleDetail));
    }

    protected void assertPersistedVehicleDetailToMatchUpdatableProperties(VehicleDetail expectedVehicleDetail) {
        assertVehicleDetailAllUpdatablePropertiesEquals(expectedVehicleDetail, getPersistedVehicleDetail(expectedVehicleDetail));
    }
}
