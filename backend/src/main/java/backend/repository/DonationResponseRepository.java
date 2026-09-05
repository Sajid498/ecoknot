package backend.repository;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import backend.entity.DonationResponse;



@Repository
public interface DonationResponseRepository
        extends JpaRepository<DonationResponse, Long> {


    List<DonationResponse> findByRequestId(Long requestId);


}