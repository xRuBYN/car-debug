package com.monitoring.usv.repository;

import com.monitoring.usv.domain.PlanConfig;
import com.monitoring.usv.domain.enumeration.PlanType;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.UUID;

/**
 * Spring Data JPA repository for the PlanConfig entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PlanConfigRepository extends JpaRepository<PlanConfig, UUID> {
    boolean existsByPlanType(PlanType planType);
}
