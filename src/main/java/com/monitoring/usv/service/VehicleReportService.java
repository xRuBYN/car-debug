package com.monitoring.usv.service;

import com.monitoring.usv.domain.User;
import com.monitoring.usv.web.rest.errors.BadRequestAlertException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class VehicleReportService {

    private static final Logger LOG = LoggerFactory.getLogger(PurchasePlanService.class);

    private final UserService userService;

    public VehicleReportService(UserService userService) {
        this.userService = userService;
    }

    public void generateVehicleReport(String id) {
        User user = userService.getUserWithAuthorities().orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        if (user.getAttemptsPurchased() > user.getAttemptsUsed()) {
            LOG.info("Generating report for vehicle with id: {}", id);
            userService.useAttempt(user.getId(), user.getAttemptsUsed() + 1);
        } else {
            throw new BadRequestAlertException("", "", "attemptsNotFound");
        }
    }
}
