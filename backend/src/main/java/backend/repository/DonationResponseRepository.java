package backend.repository;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import backend.entity.DonationResponse;


public interface DonationResponseRepository 
        extends JpaRepository<DonationResponse, Long> {


    List<DonationResponse> findByDonorId(Long donorId);

List<DonationResponse> findByRequestId(Long requestId);
}