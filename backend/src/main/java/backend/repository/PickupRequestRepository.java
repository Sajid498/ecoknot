package backend.repository;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import backend.entity.PickupRequest;
import backend.entity.PickupStatus;
import backend.entity.User;



public interface PickupRequestRepository

        extends JpaRepository<PickupRequest, Long> {





    // Get pickup requests created by a volunteer

    List<PickupRequest> findByVolunteer(

            User volunteer

    );








    // Get requests for a specific relief post

    List<PickupRequest> findByRescueDonationId(

            Long rescueId

    );








    // Get all pickup requests
    // from relief posts owned by a user

    List<PickupRequest> findByRescueDonationUserId(

            Long userId

    );








    // Count pickup requests by status

    long countByStatus(

            PickupStatus status

    );



}