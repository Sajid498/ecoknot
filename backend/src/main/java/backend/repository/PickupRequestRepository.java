package backend.repository;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import backend.entity.PickupRequest;
import backend.entity.User;





public interface PickupRequestRepository

        extends JpaRepository<PickupRequest, Long> {






    // Find all pickup requests by volunteer

    List<PickupRequest> findByVolunteer(

            User volunteer

    );








    // Find pickup requests for a specific relief post

    List<PickupRequest> findByRescueDonationId(

            Long rescueId

    );






}