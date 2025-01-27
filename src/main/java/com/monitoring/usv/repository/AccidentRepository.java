package com.monitoring.usv.repository;

import com.monitoring.usv.domain.Accident;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Accident entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AccidentRepository extends JpaRepository<Accident, Long> {}
