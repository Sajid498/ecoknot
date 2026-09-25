package backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import backend.entity.TimeTransaction;

@Repository
public interface TimeTransactionRepository
        extends JpaRepository<TimeTransaction, Long> {

    // Get all transactions where user is provider
    List<TimeTransaction> findByProviderIdOrderByCreatedAtDesc(
            Long providerId
    );

    // Get all transactions where user is requester
    List<TimeTransaction> findByRequesterIdOrderByCreatedAtDesc(
            Long requesterId
    );

    // Get complete history of a user
    // User may be provider or requester
    List<TimeTransaction> findByProviderIdOrRequesterIdOrderByCreatedAtDesc(
            Long providerId,
            Long requesterId
    );

    // Count transactions by provider
    Integer countByProviderId(
            Long providerId
    );
}