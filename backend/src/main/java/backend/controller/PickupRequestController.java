package backend.controller;


import java.util.List;


import org.springframework.web.bind.annotation.*;


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









    // Volunteer requests pickup

    @PostMapping

    public PickupRequest createPickupRequest(

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









    // Approve request

    @PutMapping("/{id}/approve")

    public PickupRequest approveRequest(

            @PathVariable Long id

    ){


        return pickupRequestService

                .approveRequest(id);


    }









    // Mark picked up

    @PutMapping("/{id}/pickup")

    public PickupRequest markPickedUp(

            @PathVariable Long id

    ){


        return pickupRequestService

                .markPickedUp(id);


    }









    // Mark delivered

    @PutMapping("/{id}/deliver")

    public PickupRequest markDelivered(

            @PathVariable Long id

    ){


        return pickupRequestService

                .markDelivered(id);


    }





}