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

import backend.dto.PickupRequestDTO;
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

    public PickupRequestDTO createPickup(

            @RequestParam Long rescueId,

            @RequestParam Long volunteerId

    ){


        return pickupRequestService

                .createPickupRequest(

                        rescueId,

                        volunteerId

                );


    }









    // Get volunteer pickup requests

    @GetMapping("/volunteer/{id}")

    public List<PickupRequestDTO> getVolunteerRequests(

            @PathVariable Long id

    ){


        return pickupRequestService

                .getVolunteerRequests(id);


    }









    // Get pickup requests for a relief post

    @GetMapping("/relief/{id}")

    public List<PickupRequestDTO> getReliefRequests(

            @PathVariable Long id

    ){


        return pickupRequestService

                .getReliefRequests(id);


    }









    // Approve pickup request (Only donor)

    @PutMapping("/{id}/approve")

    public PickupRequestDTO approveRequest(

            @PathVariable Long id,

            @RequestParam Long userId

    ){


        return pickupRequestService

                .approveRequest(

                        id,

                        userId

                );


    }









    // Reject pickup request (Only donor)

    @PutMapping("/{id}/reject")

    public PickupRequestDTO rejectRequest(

            @PathVariable Long id,

            @RequestParam Long userId

    ){


        return pickupRequestService

                .rejectRequest(

                        id,

                        userId

                );


    }









    // Volunteer picked up item

    @PutMapping("/{id}/pickup")

    public PickupRequestDTO markPickedUp(

            @PathVariable Long id

    ){


        return pickupRequestService

                .markPickedUp(id);


    }









    // Delivery completed

    @PutMapping("/{id}/deliver")

    public PickupRequestDTO markDelivered(

            @PathVariable Long id

    ){


        return pickupRequestService

                .markDelivered(id);


    }



}