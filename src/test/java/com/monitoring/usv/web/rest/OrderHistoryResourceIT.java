package com.monitoring.usv.web.rest;

import static com.monitoring.usv.domain.OrderHistoryAsserts.*;
import static com.monitoring.usv.web.rest.TestUtil.createUpdateProxyForBean;
import static com.monitoring.usv.web.rest.TestUtil.sameNumber;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.monitoring.usv.IntegrationTest;
import com.monitoring.usv.domain.OrderHistory;
import com.monitoring.usv.repository.OrderHistoryRepository;
import jakarta.persistence.EntityManager;
import java.math.BigDecimal;
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
 * Integration tests for the {@link OrderHistoryResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class OrderHistoryResourceIT {

    private static final Long DEFAULT_USER_ID = 1L;
    private static final Long UPDATED_USER_ID = 2L;

    private static final String DEFAULT_PLAN_TYPE = "AAAAAAAAAA";
    private static final String UPDATED_PLAN_TYPE = "BBBBBBBBBB";

    private static final BigDecimal DEFAULT_AMOUNT = new BigDecimal(1);
    private static final BigDecimal UPDATED_AMOUNT = new BigDecimal(2);

    private static final String DEFAULT_CREATED_BY = "AAAAAAAAAA";
    private static final String UPDATED_CREATED_BY = "BBBBBBBBBB";

    private static final Instant DEFAULT_CREATED_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_CREATED_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String DEFAULT_LAST_MODIFIED_BY = "AAAAAAAAAA";
    private static final String UPDATED_LAST_MODIFIED_BY = "BBBBBBBBBB";

    private static final Instant DEFAULT_LAST_MODIFIED_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_LAST_MODIFIED_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String ENTITY_API_URL = "/api/order-histories";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private OrderHistoryRepository orderHistoryRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restOrderHistoryMockMvc;

    private OrderHistory orderHistory;

    private OrderHistory insertedOrderHistory;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static OrderHistory createEntity() {
        return new OrderHistory()
            .userId(DEFAULT_USER_ID)
            .planType(DEFAULT_PLAN_TYPE)
            .amount(DEFAULT_AMOUNT)
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
    public static OrderHistory createUpdatedEntity() {
        return new OrderHistory()
            .userId(UPDATED_USER_ID)
            .planType(UPDATED_PLAN_TYPE)
            .amount(UPDATED_AMOUNT)
            .createdBy(UPDATED_CREATED_BY)
            .createdDate(UPDATED_CREATED_DATE)
            .lastModifiedBy(UPDATED_LAST_MODIFIED_BY)
            .lastModifiedDate(UPDATED_LAST_MODIFIED_DATE);
    }

    @BeforeEach
    public void initTest() {
        orderHistory = createEntity();
    }

    @AfterEach
    public void cleanup() {
        if (insertedOrderHistory != null) {
            orderHistoryRepository.delete(insertedOrderHistory);
            insertedOrderHistory = null;
        }
    }

    @Test
    @Transactional
    void createOrderHistory() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the OrderHistory
        var returnedOrderHistory = om.readValue(
            restOrderHistoryMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(orderHistory)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            OrderHistory.class
        );

        // Validate the OrderHistory in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertOrderHistoryUpdatableFieldsEquals(returnedOrderHistory, getPersistedOrderHistory(returnedOrderHistory));

        insertedOrderHistory = returnedOrderHistory;
    }

    @Test
    @Transactional
    void createOrderHistoryWithExistingId() throws Exception {
        // Create the OrderHistory with an existing ID
        orderHistory.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restOrderHistoryMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(orderHistory)))
            .andExpect(status().isBadRequest());

        // Validate the OrderHistory in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkUserIdIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        orderHistory.setUserId(null);

        // Create the OrderHistory, which fails.

        restOrderHistoryMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(orderHistory)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkPlanTypeIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        orderHistory.setPlanType(null);

        // Create the OrderHistory, which fails.

        restOrderHistoryMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(orderHistory)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkAmountIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        orderHistory.setAmount(null);

        // Create the OrderHistory, which fails.

        restOrderHistoryMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(orderHistory)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkCreatedByIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        orderHistory.setCreatedBy(null);

        // Create the OrderHistory, which fails.

        restOrderHistoryMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(orderHistory)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkCreatedDateIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        orderHistory.setCreatedDate(null);

        // Create the OrderHistory, which fails.

        restOrderHistoryMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(orderHistory)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllOrderHistories() throws Exception {
        // Initialize the database
        insertedOrderHistory = orderHistoryRepository.saveAndFlush(orderHistory);

        // Get all the orderHistoryList
        restOrderHistoryMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(orderHistory.getId().intValue())))
            .andExpect(jsonPath("$.[*].userId").value(hasItem(DEFAULT_USER_ID.intValue())))
            .andExpect(jsonPath("$.[*].planType").value(hasItem(DEFAULT_PLAN_TYPE)))
            .andExpect(jsonPath("$.[*].amount").value(hasItem(sameNumber(DEFAULT_AMOUNT))))
            .andExpect(jsonPath("$.[*].createdBy").value(hasItem(DEFAULT_CREATED_BY)))
            .andExpect(jsonPath("$.[*].createdDate").value(hasItem(DEFAULT_CREATED_DATE.toString())))
            .andExpect(jsonPath("$.[*].lastModifiedBy").value(hasItem(DEFAULT_LAST_MODIFIED_BY)))
            .andExpect(jsonPath("$.[*].lastModifiedDate").value(hasItem(DEFAULT_LAST_MODIFIED_DATE.toString())));
    }

    @Test
    @Transactional
    void getOrderHistory() throws Exception {
        // Initialize the database
        insertedOrderHistory = orderHistoryRepository.saveAndFlush(orderHistory);

        // Get the orderHistory
        restOrderHistoryMockMvc
            .perform(get(ENTITY_API_URL_ID, orderHistory.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(orderHistory.getId().intValue()))
            .andExpect(jsonPath("$.userId").value(DEFAULT_USER_ID.intValue()))
            .andExpect(jsonPath("$.planType").value(DEFAULT_PLAN_TYPE))
            .andExpect(jsonPath("$.amount").value(sameNumber(DEFAULT_AMOUNT)))
            .andExpect(jsonPath("$.createdBy").value(DEFAULT_CREATED_BY))
            .andExpect(jsonPath("$.createdDate").value(DEFAULT_CREATED_DATE.toString()))
            .andExpect(jsonPath("$.lastModifiedBy").value(DEFAULT_LAST_MODIFIED_BY))
            .andExpect(jsonPath("$.lastModifiedDate").value(DEFAULT_LAST_MODIFIED_DATE.toString()));
    }

    @Test
    @Transactional
    void getNonExistingOrderHistory() throws Exception {
        // Get the orderHistory
        restOrderHistoryMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingOrderHistory() throws Exception {
        // Initialize the database
        insertedOrderHistory = orderHistoryRepository.saveAndFlush(orderHistory);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the orderHistory
        OrderHistory updatedOrderHistory = orderHistoryRepository.findById(orderHistory.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedOrderHistory are not directly saved in db
        em.detach(updatedOrderHistory);
        updatedOrderHistory
            .userId(UPDATED_USER_ID)
            .planType(UPDATED_PLAN_TYPE)
            .amount(UPDATED_AMOUNT)
            .createdBy(UPDATED_CREATED_BY)
            .createdDate(UPDATED_CREATED_DATE)
            .lastModifiedBy(UPDATED_LAST_MODIFIED_BY)
            .lastModifiedDate(UPDATED_LAST_MODIFIED_DATE);

        restOrderHistoryMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedOrderHistory.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedOrderHistory))
            )
            .andExpect(status().isOk());

        // Validate the OrderHistory in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedOrderHistoryToMatchAllProperties(updatedOrderHistory);
    }

    @Test
    @Transactional
    void putNonExistingOrderHistory() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        orderHistory.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restOrderHistoryMockMvc
            .perform(
                put(ENTITY_API_URL_ID, orderHistory.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(orderHistory))
            )
            .andExpect(status().isBadRequest());

        // Validate the OrderHistory in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchOrderHistory() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        orderHistory.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOrderHistoryMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(orderHistory))
            )
            .andExpect(status().isBadRequest());

        // Validate the OrderHistory in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamOrderHistory() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        orderHistory.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOrderHistoryMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(orderHistory)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the OrderHistory in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateOrderHistoryWithPatch() throws Exception {
        // Initialize the database
        insertedOrderHistory = orderHistoryRepository.saveAndFlush(orderHistory);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the orderHistory using partial update
        OrderHistory partialUpdatedOrderHistory = new OrderHistory();
        partialUpdatedOrderHistory.setId(orderHistory.getId());

        restOrderHistoryMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedOrderHistory.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedOrderHistory))
            )
            .andExpect(status().isOk());

        // Validate the OrderHistory in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertOrderHistoryUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedOrderHistory, orderHistory),
            getPersistedOrderHistory(orderHistory)
        );
    }

    @Test
    @Transactional
    void fullUpdateOrderHistoryWithPatch() throws Exception {
        // Initialize the database
        insertedOrderHistory = orderHistoryRepository.saveAndFlush(orderHistory);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the orderHistory using partial update
        OrderHistory partialUpdatedOrderHistory = new OrderHistory();
        partialUpdatedOrderHistory.setId(orderHistory.getId());

        partialUpdatedOrderHistory
            .userId(UPDATED_USER_ID)
            .planType(UPDATED_PLAN_TYPE)
            .amount(UPDATED_AMOUNT)
            .createdBy(UPDATED_CREATED_BY)
            .createdDate(UPDATED_CREATED_DATE)
            .lastModifiedBy(UPDATED_LAST_MODIFIED_BY)
            .lastModifiedDate(UPDATED_LAST_MODIFIED_DATE);

        restOrderHistoryMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedOrderHistory.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedOrderHistory))
            )
            .andExpect(status().isOk());

        // Validate the OrderHistory in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertOrderHistoryUpdatableFieldsEquals(partialUpdatedOrderHistory, getPersistedOrderHistory(partialUpdatedOrderHistory));
    }

    @Test
    @Transactional
    void patchNonExistingOrderHistory() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        orderHistory.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restOrderHistoryMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, orderHistory.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(orderHistory))
            )
            .andExpect(status().isBadRequest());

        // Validate the OrderHistory in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchOrderHistory() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        orderHistory.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOrderHistoryMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(orderHistory))
            )
            .andExpect(status().isBadRequest());

        // Validate the OrderHistory in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamOrderHistory() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        orderHistory.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOrderHistoryMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(orderHistory)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the OrderHistory in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteOrderHistory() throws Exception {
        // Initialize the database
        insertedOrderHistory = orderHistoryRepository.saveAndFlush(orderHistory);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the orderHistory
        restOrderHistoryMockMvc
            .perform(delete(ENTITY_API_URL_ID, orderHistory.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return orderHistoryRepository.count();
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

    protected OrderHistory getPersistedOrderHistory(OrderHistory orderHistory) {
        return orderHistoryRepository.findById(orderHistory.getId()).orElseThrow();
    }

    protected void assertPersistedOrderHistoryToMatchAllProperties(OrderHistory expectedOrderHistory) {
        assertOrderHistoryAllPropertiesEquals(expectedOrderHistory, getPersistedOrderHistory(expectedOrderHistory));
    }

    protected void assertPersistedOrderHistoryToMatchUpdatableProperties(OrderHistory expectedOrderHistory) {
        assertOrderHistoryAllUpdatablePropertiesEquals(expectedOrderHistory, getPersistedOrderHistory(expectedOrderHistory));
    }
}
