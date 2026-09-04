package backend.controller;


import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import backend.entity.BloodRequest;
import backend.service.BloodRequestService;



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
@PutMapping("/{requestId}/user/{userId}")
public BloodRequest updateRequest(
        @PathVariable Long requestId,
        @PathVariable Long userId,
        @RequestBody BloodRequest bloodRequest
){

    return bloodRequestService.updateBloodRequest(
            requestId,
            userId,
            bloodRequest
    );

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