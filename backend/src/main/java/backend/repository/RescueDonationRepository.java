package backend.repository;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import backend.entity.RescueDonation;



@Repository
public interface RescueDonationRepository

        extends JpaRepository<RescueDonation, Long>{



    List<RescueDonation> findByUserId(

            Long userId

    );


}