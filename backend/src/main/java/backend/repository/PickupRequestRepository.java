package backend.repository;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import backend.entity.PickupRequest;
import backend.entity.PickupStatus;
import backend.entity.User;



public interface PickupRequestRepository

        extends JpaRepository<PickupRequest, Long> {




    List<PickupRequest> findByVolunteer(

            User volunteer

    );






    List<PickupRequest> findByRescueDonationId(

            Long rescueId

    );






    long countByStatus(

            PickupStatus status

    );



}