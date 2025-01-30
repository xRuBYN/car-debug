package com.monitoring.usv.repository;

import com.monitoring.usv.domain.BankCard;
import java.util.UUID;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the BankCard entity.
 */
@SuppressWarnings("unused")
@Repository
public interface BankCardRepository extends JpaRepository<BankCard, Long> {}
