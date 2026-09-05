package backend.repository;

import backend.entity.DonationResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DonationResponseRepository
        extends JpaRepository<DonationResponse, Long> {

}