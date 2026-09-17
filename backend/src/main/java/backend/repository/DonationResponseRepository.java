package backend.repository;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import backend.entity.DonationResponse;



public interface DonationResponseRepository 
        extends JpaRepository<DonationResponse, Long> {



    // Get all donations made by a donor
    List<DonationResponse> findByDonorId(
            Long donorId
    );



    // Get all donors for a blood request
    List<DonationResponse> findByRequestId(
            Long requestId
    );



    // Check duplicate donation request
    boolean existsByRequestIdAndDonorId(
            Long requestId,
            Long donorId
    );


}