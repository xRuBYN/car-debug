//package com.monitoring.usv.web.rest;
//
//import com.monitoring.usv.domain.OrderHistory;
//import com.monitoring.usv.repository.OrderHistoryRepository;
//import com.monitoring.usv.web.rest.errors.BadRequestAlertException;
//import jakarta.validation.Valid;
//import jakarta.validation.constraints.NotNull;
//import java.net.URI;
//import java.net.URISyntaxException;
//import java.util.List;
//import java.util.Objects;
//import java.util.Optional;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.http.ResponseEntity;
//import org.springframework.transaction.annotation.Transactional;
//import org.springframework.web.bind.annotation.*;
//import tech.jhipster.web.util.HeaderUtil;
//import tech.jhipster.web.util.ResponseUtil;
//
///**
// * REST controller for managing {@link com.monitoring.usv.domain.OrderHistory}.
// */
//@RestController
//@RequestMapping("/api/order-histories")
//@Transactional
//public class OrderHistoryResource {
//
//    private static final Logger LOG = LoggerFactory.getLogger(OrderHistoryResource.class);
//
//    private static final String ENTITY_NAME = "orderHistory";
//
//    @Value("${jhipster.clientApp.name}")
//    private String applicationName;
//
//    private final OrderHistoryRepository orderHistoryRepository;
//
//    public OrderHistoryResource(OrderHistoryRepository orderHistoryRepository) {
//        this.orderHistoryRepository = orderHistoryRepository;
//    }
//
//    /**
//     * {@code POST  /order-histories} : Create a new orderHistory.
//     *
//     * @param orderHistory the orderHistory to create.
//     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new orderHistory, or with status {@code 400 (Bad Request)} if the orderHistory has already an ID.
//     * @throws URISyntaxException if the Location URI syntax is incorrect.
//     */
//    @PostMapping("")
//    public ResponseEntity<OrderHistory> createOrderHistory(@Valid @RequestBody OrderHistory orderHistory) throws URISyntaxException {
//        LOG.debug("REST request to save OrderHistory : {}", orderHistory);
//        if (orderHistory.getId() != null) {
//            throw new BadRequestAlertException("A new orderHistory cannot already have an ID", ENTITY_NAME, "idexists");
//        }
//        orderHistory = orderHistoryRepository.save(orderHistory);
//        return ResponseEntity.created(new URI("/api/order-histories/" + orderHistory.getId()))
//            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, orderHistory.getId().toString()))
//            .body(orderHistory);
//    }
//
//    /**
//     * {@code PUT  /order-histories/:id} : Updates an existing orderHistory.
//     *
//     * @param id the id of the orderHistory to save.
//     * @param orderHistory the orderHistory to update.
//     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated orderHistory,
//     * or with status {@code 400 (Bad Request)} if the orderHistory is not valid,
//     * or with status {@code 500 (Internal Server Error)} if the orderHistory couldn't be updated.
//     * @throws URISyntaxException if the Location URI syntax is incorrect.
//     */
//    @PutMapping("/{id}")
//    public ResponseEntity<OrderHistory> updateOrderHistory(
//        @PathVariable(value = "id", required = false) final Long id,
//        @Valid @RequestBody OrderHistory orderHistory
//    ) throws URISyntaxException {
//        LOG.debug("REST request to update OrderHistory : {}, {}", id, orderHistory);
//        if (orderHistory.getId() == null) {
//            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
//        }
//        if (!Objects.equals(id, orderHistory.getId())) {
//            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
//        }
//
//        if (!orderHistoryRepository.existsById(id)) {
//            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
//        }
//
//        orderHistory = orderHistoryRepository.save(orderHistory);
//        return ResponseEntity.ok()
//            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, orderHistory.getId().toString()))
//            .body(orderHistory);
//    }
//
//    /**
//     * {@code PATCH  /order-histories/:id} : Partial updates given fields of an existing orderHistory, field will ignore if it is null
//     *
//     * @param id the id of the orderHistory to save.
//     * @param orderHistory the orderHistory to update.
//     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated orderHistory,
//     * or with status {@code 400 (Bad Request)} if the orderHistory is not valid,
//     * or with status {@code 404 (Not Found)} if the orderHistory is not found,
//     * or with status {@code 500 (Internal Server Error)} if the orderHistory couldn't be updated.
//     * @throws URISyntaxException if the Location URI syntax is incorrect.
//     */
//    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
//    public ResponseEntity<OrderHistory> partialUpdateOrderHistory(
//        @PathVariable(value = "id", required = false) final Long id,
//        @NotNull @RequestBody OrderHistory orderHistory
//    ) throws URISyntaxException {
//        LOG.debug("REST request to partial update OrderHistory partially : {}, {}", id, orderHistory);
//        if (orderHistory.getId() == null) {
//            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
//        }
//        if (!Objects.equals(id, orderHistory.getId())) {
//            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
//        }
//
//        if (!orderHistoryRepository.existsById(id)) {
//            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
//        }
//
//        Optional<OrderHistory> result = orderHistoryRepository
//            .findById(orderHistory.getId())
//            .map(existingOrderHistory -> {
//                if (orderHistory.getUserId() != null) {
//                    existingOrderHistory.setUserId(orderHistory.getUserId());
//                }
//                if (orderHistory.getPlanType() != null) {
//                    existingOrderHistory.setPlanType(orderHistory.getPlanType());
//                }
//                if (orderHistory.getAmount() != null) {
//                    existingOrderHistory.setAmount(orderHistory.getAmount());
//                }
//                if (orderHistory.getCreatedBy() != null) {
//                    existingOrderHistory.setCreatedBy(orderHistory.getCreatedBy());
//                }
//                if (orderHistory.getCreatedDate() != null) {
//                    existingOrderHistory.setCreatedDate(orderHistory.getCreatedDate());
//                }
//                if (orderHistory.getLastModifiedBy() != null) {
//                    existingOrderHistory.setLastModifiedBy(orderHistory.getLastModifiedBy());
//                }
//                if (orderHistory.getLastModifiedDate() != null) {
//                    existingOrderHistory.setLastModifiedDate(orderHistory.getLastModifiedDate());
//                }
//
//                return existingOrderHistory;
//            })
//            .map(orderHistoryRepository::save);
//
//        return ResponseUtil.wrapOrNotFound(
//            result,
//            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, orderHistory.getId().toString())
//        );
//    }
//
//    /**
//     * {@code GET  /order-histories} : get all the orderHistories.
//     *
//     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of orderHistories in body.
//     */
//    @GetMapping("")
//    public List<OrderHistory> getAllOrderHistories() {
//        LOG.debug("REST request to get all OrderHistories");
//        return orderHistoryRepository.findAll();
//    }
//
//    /**
//     * {@code GET  /order-histories/:id} : get the "id" orderHistory.
//     *
//     * @param id the id of the orderHistory to retrieve.
//     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the orderHistory, or with status {@code 404 (Not Found)}.
//     */
//    @GetMapping("/{id}")
//    public ResponseEntity<OrderHistory> getOrderHistory(@PathVariable("id") Long id) {
//        LOG.debug("REST request to get OrderHistory : {}", id);
//        Optional<OrderHistory> orderHistory = orderHistoryRepository.findById(id);
//        return ResponseUtil.wrapOrNotFound(orderHistory);
//    }
//
//    /**
//     * {@code DELETE  /order-histories/:id} : delete the "id" orderHistory.
//     *
//     * @param id the id of the orderHistory to delete.
//     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
//     */
//    @DeleteMapping("/{id}")
//    public ResponseEntity<Void> deleteOrderHistory(@PathVariable("id") Long id) {
//        LOG.debug("REST request to delete OrderHistory : {}", id);
//        orderHistoryRepository.deleteById(id);
//        return ResponseEntity.noContent()
//            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
//            .build();
//    }
//}
