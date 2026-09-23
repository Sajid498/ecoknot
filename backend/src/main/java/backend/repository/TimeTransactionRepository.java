package backend.repository;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import backend.entity.TimeTransaction;



@Repository
public interface TimeTransactionRepository 
        extends JpaRepository<TimeTransaction, Long> {



    // Get all transactions of a provider
    List<TimeTransaction> findByProviderIdOrderByCreatedAtDesc(
            Long providerId
    );



    // Get all transactions of a requester
    List<TimeTransaction> findByRequesterIdOrderByCreatedAtDesc(
            Long requesterId
    );



    // Count earned hours by provider
    Integer countByProviderId(
            Long providerId
    );



}