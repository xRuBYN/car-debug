package com.monitoring.usv.web.rest;

import static com.monitoring.usv.domain.BankCardAsserts.*;
import static com.monitoring.usv.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.monitoring.usv.IntegrationTest;
import com.monitoring.usv.domain.BankCard;
import com.monitoring.usv.repository.BankCardRepository;
import jakarta.persistence.EntityManager;
import java.util.UUID;
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
 * Integration tests for the {@link BankCardResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class BankCardResourceIT {

    private static final String DEFAULT_CARD_CODE = "AAAAAAAAAA";
    private static final String UPDATED_CARD_CODE = "BBBBBBBBBB";

    private static final String DEFAULT_FIRST_NAME = "AAAAAAAAAA";
    private static final String UPDATED_FIRST_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_LAST_NAME = "AAAAAAAAAA";
    private static final String UPDATED_LAST_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_CVV = "AAA";
    private static final String UPDATED_CVV = "BBB";

    private static final String ENTITY_API_URL = "/api/bank-cards";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    @Autowired
    private ObjectMapper om;

    @Autowired
    private BankCardRepository bankCardRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restBankCardMockMvc;

    private BankCard bankCard;

    private BankCard insertedBankCard;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static BankCard createEntity() {
        return new BankCard().cardCode(DEFAULT_CARD_CODE).firstName(DEFAULT_FIRST_NAME).lastName(DEFAULT_LAST_NAME).cvv(DEFAULT_CVV);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static BankCard createUpdatedEntity() {
        return new BankCard().cardCode(UPDATED_CARD_CODE).firstName(UPDATED_FIRST_NAME).lastName(UPDATED_LAST_NAME).cvv(UPDATED_CVV);
    }

    @BeforeEach
    public void initTest() {
        bankCard = createEntity();
    }

    @AfterEach
    public void cleanup() {
        if (insertedBankCard != null) {
            bankCardRepository.delete(insertedBankCard);
            insertedBankCard = null;
        }
    }

    @Test
    @Transactional
    void createBankCard() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the BankCard
        var returnedBankCard = om.readValue(
            restBankCardMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(bankCard)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            BankCard.class
        );

        // Validate the BankCard in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertBankCardUpdatableFieldsEquals(returnedBankCard, getPersistedBankCard(returnedBankCard));

        insertedBankCard = returnedBankCard;
    }

    @Test
    @Transactional
    void createBankCardWithExistingId() throws Exception {
        // Create the BankCard with an existing ID
        insertedBankCard = bankCardRepository.saveAndFlush(bankCard);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restBankCardMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(bankCard)))
            .andExpect(status().isBadRequest());

        // Validate the BankCard in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkCardCodeIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        bankCard.setCardCode(null);

        // Create the BankCard, which fails.

        restBankCardMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(bankCard)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkFirstNameIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        bankCard.setFirstName(null);

        // Create the BankCard, which fails.

        restBankCardMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(bankCard)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkLastNameIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        bankCard.setLastName(null);

        // Create the BankCard, which fails.

        restBankCardMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(bankCard)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkCvvIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        bankCard.setCvv(null);

        // Create the BankCard, which fails.

        restBankCardMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(bankCard)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllBankCards() throws Exception {
        // Initialize the database
        insertedBankCard = bankCardRepository.saveAndFlush(bankCard);

        // Get all the bankCardList
        restBankCardMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(bankCard.getId().toString())))
            .andExpect(jsonPath("$.[*].cardCode").value(hasItem(DEFAULT_CARD_CODE)))
            .andExpect(jsonPath("$.[*].firstName").value(hasItem(DEFAULT_FIRST_NAME)))
            .andExpect(jsonPath("$.[*].lastName").value(hasItem(DEFAULT_LAST_NAME)))
            .andExpect(jsonPath("$.[*].cvv").value(hasItem(DEFAULT_CVV)));
    }

    @Test
    @Transactional
    void getBankCard() throws Exception {
        // Initialize the database
        insertedBankCard = bankCardRepository.saveAndFlush(bankCard);

        // Get the bankCard
        restBankCardMockMvc
            .perform(get(ENTITY_API_URL_ID, bankCard.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(bankCard.getId().toString()))
            .andExpect(jsonPath("$.cardCode").value(DEFAULT_CARD_CODE))
            .andExpect(jsonPath("$.firstName").value(DEFAULT_FIRST_NAME))
            .andExpect(jsonPath("$.lastName").value(DEFAULT_LAST_NAME))
            .andExpect(jsonPath("$.cvv").value(DEFAULT_CVV));
    }

    @Test
    @Transactional
    void getNonExistingBankCard() throws Exception {
        // Get the bankCard
        restBankCardMockMvc.perform(get(ENTITY_API_URL_ID, UUID.randomUUID().toString())).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingBankCard() throws Exception {
        // Initialize the database
        insertedBankCard = bankCardRepository.saveAndFlush(bankCard);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the bankCard
        BankCard updatedBankCard = bankCardRepository.findById(bankCard.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedBankCard are not directly saved in db
        em.detach(updatedBankCard);
        updatedBankCard.cardCode(UPDATED_CARD_CODE).firstName(UPDATED_FIRST_NAME).lastName(UPDATED_LAST_NAME).cvv(UPDATED_CVV);

        restBankCardMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedBankCard.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedBankCard))
            )
            .andExpect(status().isOk());

        // Validate the BankCard in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedBankCardToMatchAllProperties(updatedBankCard);
    }

    @Test
    @Transactional
    void putNonExistingBankCard() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        bankCard.setId(UUID.randomUUID());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBankCardMockMvc
            .perform(
                put(ENTITY_API_URL_ID, bankCard.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(bankCard))
            )
            .andExpect(status().isBadRequest());

        // Validate the BankCard in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchBankCard() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        bankCard.setId(UUID.randomUUID());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBankCardMockMvc
            .perform(
                put(ENTITY_API_URL_ID, UUID.randomUUID()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(bankCard))
            )
            .andExpect(status().isBadRequest());

        // Validate the BankCard in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamBankCard() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        bankCard.setId(UUID.randomUUID());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBankCardMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(bankCard)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the BankCard in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateBankCardWithPatch() throws Exception {
        // Initialize the database
        insertedBankCard = bankCardRepository.saveAndFlush(bankCard);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the bankCard using partial update
        BankCard partialUpdatedBankCard = new BankCard();
        partialUpdatedBankCard.setId(bankCard.getId());

        partialUpdatedBankCard.cardCode(UPDATED_CARD_CODE).firstName(UPDATED_FIRST_NAME).cvv(UPDATED_CVV);

        restBankCardMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedBankCard.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedBankCard))
            )
            .andExpect(status().isOk());

        // Validate the BankCard in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertBankCardUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedBankCard, bankCard), getPersistedBankCard(bankCard));
    }

    @Test
    @Transactional
    void fullUpdateBankCardWithPatch() throws Exception {
        // Initialize the database
        insertedBankCard = bankCardRepository.saveAndFlush(bankCard);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the bankCard using partial update
        BankCard partialUpdatedBankCard = new BankCard();
        partialUpdatedBankCard.setId(bankCard.getId());

        partialUpdatedBankCard.cardCode(UPDATED_CARD_CODE).firstName(UPDATED_FIRST_NAME).lastName(UPDATED_LAST_NAME).cvv(UPDATED_CVV);

        restBankCardMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedBankCard.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedBankCard))
            )
            .andExpect(status().isOk());

        // Validate the BankCard in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertBankCardUpdatableFieldsEquals(partialUpdatedBankCard, getPersistedBankCard(partialUpdatedBankCard));
    }

    @Test
    @Transactional
    void patchNonExistingBankCard() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        bankCard.setId(UUID.randomUUID());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBankCardMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, bankCard.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(bankCard))
            )
            .andExpect(status().isBadRequest());

        // Validate the BankCard in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchBankCard() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        bankCard.setId(UUID.randomUUID());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBankCardMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, UUID.randomUUID())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(bankCard))
            )
            .andExpect(status().isBadRequest());

        // Validate the BankCard in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamBankCard() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        bankCard.setId(UUID.randomUUID());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBankCardMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(bankCard)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the BankCard in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteBankCard() throws Exception {
        // Initialize the database
        insertedBankCard = bankCardRepository.saveAndFlush(bankCard);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the bankCard
        restBankCardMockMvc
            .perform(delete(ENTITY_API_URL_ID, bankCard.getId().toString()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return bankCardRepository.count();
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

    protected BankCard getPersistedBankCard(BankCard bankCard) {
        return bankCardRepository.findById(bankCard.getId()).orElseThrow();
    }

    protected void assertPersistedBankCardToMatchAllProperties(BankCard expectedBankCard) {
        assertBankCardAllPropertiesEquals(expectedBankCard, getPersistedBankCard(expectedBankCard));
    }

    protected void assertPersistedBankCardToMatchUpdatableProperties(BankCard expectedBankCard) {
        assertBankCardAllUpdatablePropertiesEquals(expectedBankCard, getPersistedBankCard(expectedBankCard));
    }
}
