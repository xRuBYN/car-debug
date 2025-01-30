package com.monitoring.usv.repository;

import com.monitoring.usv.domain.User;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the {@link User} entity.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findOneByActivationKey(String activationKey);
    List<User> findAllByActivatedIsFalseAndActivationKeyIsNotNullAndCreatedDateBefore(Instant dateTime);
    Optional<User> findOneByResetKey(String resetKey);
    Optional<User> findOneByEmailIgnoreCase(String email);
    Optional<User> findOneByLogin(String login);

    @EntityGraph(attributePaths = "authorities")
    Optional<User> findOneWithAuthoritiesByLogin(String login);

    @EntityGraph(attributePaths = "authorities")
    Optional<User> findOneWithAuthoritiesByEmailIgnoreCase(String email);

    Page<User> findAllByIdNotNullAndActivatedIsTrue(Pageable pageable);

    @Modifying
    @Query(value = "UPDATE public.user u SET attempts_purchased = :attempts WHERE u.id = :userId", nativeQuery = true)
    void updatePurchasedAttemptsByUserId(@Param("userId") Long userId, @Param("attempts") Long attempts);

    @Modifying
    @Query(value = "UPDATE public.user u SET attempts_used = :attempts WHERE u.id = :userId", nativeQuery = true)
    void updateUsedAttemptsByUserId(@Param("userId") Long userId, @Param("attempts") Long attempts);
}
