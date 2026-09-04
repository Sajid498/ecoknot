package backend.controller;


import backend.entity.BloodRequest;
import backend.service.BloodRequestService;

import org.springframework.web.bind.annotation.*;

import java.util.List;



@RestController
@RequestMapping("/api/blood-requests")
@CrossOrigin("*")
public class BloodRequestController {



    private final BloodRequestService bloodRequestService;



    public BloodRequestController(
            BloodRequestService bloodRequestService
    ){

        this.bloodRequestService =
                bloodRequestService;

    }

@DeleteMapping("/{requestId}/user/{userId}")
public BloodRequest cancelRequest(
        @PathVariable Long requestId,
        @PathVariable Long userId
){

    return bloodRequestService
            .cancelBloodRequest(
                    requestId,
                    userId
            );

}

    // Create request for specific user
    @PostMapping("/user/{userId}")
    public BloodRequest createRequest(
            @PathVariable Long userId,
            @RequestBody BloodRequest bloodRequest
    ){

        return bloodRequestService
                .createBloodRequest(
                        userId,
                        bloodRequest
                );

    }



    // Get all requests
    @GetMapping
    public List<BloodRequest> getAllRequests(){

        return bloodRequestService
                .getAllRequests();

    }


}