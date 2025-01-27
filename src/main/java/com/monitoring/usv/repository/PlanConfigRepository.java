package com.monitoring.usv.repository;

import com.monitoring.usv.domain.PlanConfig;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the PlanConfig entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PlanConfigRepository extends JpaRepository<PlanConfig, Long> {}
