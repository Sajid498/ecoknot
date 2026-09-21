package backend.controller;


import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import backend.entity.PickupRequest;
import backend.service.PickupRequestService;





@RestController
@RequestMapping("/api/pickups")
@CrossOrigin("*")
public class PickupRequestController {





    private final PickupRequestService pickupRequestService;







    public PickupRequestController(

            PickupRequestService pickupRequestService

    ){

        this.pickupRequestService = pickupRequestService;

    }









    // Volunteer request pickup

    @PostMapping

    public PickupRequest createPickup(

            @RequestParam Long rescueId,

            @RequestParam Long volunteerId

    ){


        return pickupRequestService

                .createPickupRequest(

                        rescueId,

                        volunteerId

                );


    }









    // Get volunteer requests

    @GetMapping("/volunteer/{id}")

    public List<PickupRequest> getVolunteerRequests(

            @PathVariable Long id

    ){


        return pickupRequestService

                .getVolunteerRequests(id);


    }









    // Get requests for a relief post

    @GetMapping("/relief/{id}")

    public List<PickupRequest> getReliefRequests(

            @PathVariable Long id

    ){


        return pickupRequestService

                .getReliefRequests(id);


    }









    // Approve pickup request

    @PutMapping("/{id}/approve")

    public PickupRequest approveRequest(

            @PathVariable Long id

    ){


        return pickupRequestService

                .approveRequest(id);


    }









    // Reject pickup request

    @PutMapping("/{id}/reject")

    public PickupRequest rejectRequest(

            @PathVariable Long id

    ){


        return pickupRequestService

                .rejectRequest(id);


    }









    // Volunteer picked up item

    @PutMapping("/{id}/pickup")

    public PickupRequest markPickedUp(

            @PathVariable Long id

    ){


        return pickupRequestService

                .markPickedUp(id);


    }









    // Delivery completed

    @PutMapping("/{id}/deliver")

    public PickupRequest markDelivered(

            @PathVariable Long id

    ){


        return pickupRequestService

                .markDelivered(id);


    }



}