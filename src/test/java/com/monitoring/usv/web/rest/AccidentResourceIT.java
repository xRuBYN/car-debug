package com.monitoring.usv.web.rest;

import static com.monitoring.usv.domain.AccidentAsserts.*;
import static com.monitoring.usv.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.monitoring.usv.IntegrationTest;
import com.monitoring.usv.domain.Accident;
import com.monitoring.usv.repository.AccidentRepository;
import jakarta.persistence.EntityManager;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
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
 * Integration tests for the {@link AccidentResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class AccidentResourceIT {

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String DEFAULT_CREATED_BY = "AAAAAAAAAA";
    private static final String UPDATED_CREATED_BY = "BBBBBBBBBB";

    private static final Instant DEFAULT_CREATED_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_CREATED_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String DEFAULT_LAST_MODIFIED_BY = "AAAAAAAAAA";
    private static final String UPDATED_LAST_MODIFIED_BY = "BBBBBBBBBB";

    private static final Instant DEFAULT_LAST_MODIFIED_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_LAST_MODIFIED_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String ENTITY_API_URL = "/api/accidents";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private AccidentRepository accidentRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAccidentMockMvc;

    private Accident accident;

    private Accident insertedAccident;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Accident createEntity() {
        return new Accident()
            .description(DEFAULT_DESCRIPTION)
            .createdBy(DEFAULT_CREATED_BY)
            .createdDate(DEFAULT_CREATED_DATE)
            .lastModifiedBy(DEFAULT_LAST_MODIFIED_BY)
            .lastModifiedDate(DEFAULT_LAST_MODIFIED_DATE);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Accident createUpdatedEntity() {
        return new Accident()
            .description(UPDATED_DESCRIPTION)
            .createdBy(UPDATED_CREATED_BY)
            .createdDate(UPDATED_CREATED_DATE)
            .lastModifiedBy(UPDATED_LAST_MODIFIED_BY)
            .lastModifiedDate(UPDATED_LAST_MODIFIED_DATE);
    }

    @BeforeEach
    public void initTest() {
        accident = createEntity();
    }

    @AfterEach
    public void cleanup() {
        if (insertedAccident != null) {
            accidentRepository.delete(insertedAccident);
            insertedAccident = null;
        }
    }

    @Test
    @Transactional
    void createAccident() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Accident
        var returnedAccident = om.readValue(
            restAccidentMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(accident)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            Accident.class
        );

        // Validate the Accident in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertAccidentUpdatableFieldsEquals(returnedAccident, getPersistedAccident(returnedAccident));

        insertedAccident = returnedAccident;
    }

    @Test
    @Transactional
    void createAccidentWithExistingId() throws Exception {
        // Create the Accident with an existing ID
        accident.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAccidentMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(accident)))
            .andExpect(status().isBadRequest());

        // Validate the Accident in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkCreatedByIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        accident.setCreatedBy(null);

        // Create the Accident, which fails.

        restAccidentMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(accident)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkCreatedDateIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        accident.setCreatedDate(null);

        // Create the Accident, which fails.

        restAccidentMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(accident)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllAccidents() throws Exception {
        // Initialize the database
        insertedAccident = accidentRepository.saveAndFlush(accident);

        // Get all the accidentList
        restAccidentMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(accident.getId().intValue())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].createdBy").value(hasItem(DEFAULT_CREATED_BY)))
            .andExpect(jsonPath("$.[*].createdDate").value(hasItem(DEFAULT_CREATED_DATE.toString())))
            .andExpect(jsonPath("$.[*].lastModifiedBy").value(hasItem(DEFAULT_LAST_MODIFIED_BY)))
            .andExpect(jsonPath("$.[*].lastModifiedDate").value(hasItem(DEFAULT_LAST_MODIFIED_DATE.toString())));
    }

    @Test
    @Transactional
    void getAccident() throws Exception {
        // Initialize the database
        insertedAccident = accidentRepository.saveAndFlush(accident);

        // Get the accident
        restAccidentMockMvc
            .perform(get(ENTITY_API_URL_ID, accident.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(accident.getId().intValue()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.createdBy").value(DEFAULT_CREATED_BY))
            .andExpect(jsonPath("$.createdDate").value(DEFAULT_CREATED_DATE.toString()))
            .andExpect(jsonPath("$.lastModifiedBy").value(DEFAULT_LAST_MODIFIED_BY))
            .andExpect(jsonPath("$.lastModifiedDate").value(DEFAULT_LAST_MODIFIED_DATE.toString()));
    }

    @Test
    @Transactional
    void getNonExistingAccident() throws Exception {
        // Get the accident
        restAccidentMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingAccident() throws Exception {
        // Initialize the database
        insertedAccident = accidentRepository.saveAndFlush(accident);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the accident
        Accident updatedAccident = accidentRepository.findById(accident.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedAccident are not directly saved in db
        em.detach(updatedAccident);
        updatedAccident
            .description(UPDATED_DESCRIPTION)
            .createdBy(UPDATED_CREATED_BY)
            .createdDate(UPDATED_CREATED_DATE)
            .lastModifiedBy(UPDATED_LAST_MODIFIED_BY)
            .lastModifiedDate(UPDATED_LAST_MODIFIED_DATE);

        restAccidentMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAccident.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedAccident))
            )
            .andExpect(status().isOk());

        // Validate the Accident in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedAccidentToMatchAllProperties(updatedAccident);
    }

    @Test
    @Transactional
    void putNonExistingAccident() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        accident.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAccidentMockMvc
            .perform(
                put(ENTITY_API_URL_ID, accident.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(accident))
            )
            .andExpect(status().isBadRequest());

        // Validate the Accident in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAccident() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        accident.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAccidentMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(accident))
            )
            .andExpect(status().isBadRequest());

        // Validate the Accident in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAccident() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        accident.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAccidentMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(accident)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Accident in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAccidentWithPatch() throws Exception {
        // Initialize the database
        insertedAccident = accidentRepository.saveAndFlush(accident);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the accident using partial update
        Accident partialUpdatedAccident = new Accident();
        partialUpdatedAccident.setId(accident.getId());

        partialUpdatedAccident
            .description(UPDATED_DESCRIPTION)
            .createdDate(UPDATED_CREATED_DATE)
            .lastModifiedBy(UPDATED_LAST_MODIFIED_BY)
            .lastModifiedDate(UPDATED_LAST_MODIFIED_DATE);

        restAccidentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAccident.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedAccident))
            )
            .andExpect(status().isOk());

        // Validate the Accident in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertAccidentUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedAccident, accident), getPersistedAccident(accident));
    }

    @Test
    @Transactional
    void fullUpdateAccidentWithPatch() throws Exception {
        // Initialize the database
        insertedAccident = accidentRepository.saveAndFlush(accident);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the accident using partial update
        Accident partialUpdatedAccident = new Accident();
        partialUpdatedAccident.setId(accident.getId());

        partialUpdatedAccident
            .description(UPDATED_DESCRIPTION)
            .createdBy(UPDATED_CREATED_BY)
            .createdDate(UPDATED_CREATED_DATE)
            .lastModifiedBy(UPDATED_LAST_MODIFIED_BY)
            .lastModifiedDate(UPDATED_LAST_MODIFIED_DATE);

        restAccidentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAccident.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedAccident))
            )
            .andExpect(status().isOk());

        // Validate the Accident in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertAccidentUpdatableFieldsEquals(partialUpdatedAccident, getPersistedAccident(partialUpdatedAccident));
    }

    @Test
    @Transactional
    void patchNonExistingAccident() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        accident.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAccidentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, accident.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(accident))
            )
            .andExpect(status().isBadRequest());

        // Validate the Accident in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAccident() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        accident.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAccidentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(accident))
            )
            .andExpect(status().isBadRequest());

        // Validate the Accident in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAccident() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        accident.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAccidentMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(accident)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Accident in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAccident() throws Exception {
        // Initialize the database
        insertedAccident = accidentRepository.saveAndFlush(accident);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the accident
        restAccidentMockMvc
            .perform(delete(ENTITY_API_URL_ID, accident.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return accidentRepository.count();
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

    protected Accident getPersistedAccident(Accident accident) {
        return accidentRepository.findById(accident.getId()).orElseThrow();
    }

    protected void assertPersistedAccidentToMatchAllProperties(Accident expectedAccident) {
        assertAccidentAllPropertiesEquals(expectedAccident, getPersistedAccident(expectedAccident));
    }

    protected void assertPersistedAccidentToMatchUpdatableProperties(Accident expectedAccident) {
        assertAccidentAllUpdatablePropertiesEquals(expectedAccident, getPersistedAccident(expectedAccident));
    }
}
