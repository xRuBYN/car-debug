package com.monitoring.usv.service;

import com.monitoring.usv.domain.OrderHistory;
import com.monitoring.usv.domain.PlanConfig;
import com.monitoring.usv.domain.User;
import com.monitoring.usv.repository.OrderHistoryRepository;
import com.monitoring.usv.repository.PlanConfigRepository;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class PurchasePlanService {

    private static final Logger LOG = LoggerFactory.getLogger(PurchasePlanService.class);

    private final OrderHistoryRepository orderHistoryRepository;

    private final PlanConfigRepository planConfigRepository;

    private final UserService userService;

    public PurchasePlanService(
        OrderHistoryRepository orderHistoryRepository,
        PlanConfigRepository planConfigRepository,
        UserService userService
    ) {
        this.orderHistoryRepository = orderHistoryRepository;
        this.planConfigRepository = planConfigRepository;
        this.userService = userService;
    }

    public PlanConfig buyPlan(UUID planId) {
        LOG.info("Buying plan with id: {}", planId);
        PlanConfig planConfig = planConfigRepository.findById(planId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        User user = userService.getUserWithAuthorities().orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        OrderHistory orderHistory = new OrderHistory();
        orderHistory.amount(planConfig.getPrice());
        orderHistory.setPlanType(planConfig.getPlanType());
        orderHistory.setAttempts(planConfig.getAttempts());
        orderHistory.setUser(user);
        orderHistoryRepository.save(orderHistory);
        userService.addUserAttempts(user.getId(), user.getAttemptsPurchased() + planConfig.getAttempts());
        return planConfig;
    }
}
