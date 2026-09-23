package backend.repository;


import java.util.List;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


import backend.entity.TimeOffer;
import backend.entity.TimeOfferStatus;



@Repository
public interface TimeOfferRepository

        extends JpaRepository<TimeOffer, Long> {






    // Get all offers created by a user

    List<TimeOffer> findByUserId(

            Long userId

    );








    // Get offers by status

    List<TimeOffer> findByStatus(

            TimeOfferStatus status

    );








    // Get available offers

    List<TimeOffer> findByStatusOrderByCreatedAtDesc(

            TimeOfferStatus status

    );



}