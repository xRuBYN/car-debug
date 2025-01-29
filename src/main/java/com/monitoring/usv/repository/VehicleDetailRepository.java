package com.monitoring.usv.repository;

import com.monitoring.usv.domain.VehicleDetail;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the VehicleDetail entity.
 */
@SuppressWarnings("unused")
@Repository
public interface VehicleDetailRepository extends JpaRepository<VehicleDetail, Long> {}
