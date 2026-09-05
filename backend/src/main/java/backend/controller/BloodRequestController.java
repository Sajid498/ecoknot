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

import backend.dto.BloodRequestResponseDTO;
import backend.entity.BloodGroup;
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

        this.bloodRequestService = bloodRequestService;

    }






    // Update blood request (only owner)
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








    // Cancel blood request (only owner)
    @DeleteMapping("/{requestId}/user/{userId}")
    public BloodRequest cancelRequest(
            @PathVariable Long requestId,
            @PathVariable Long userId
    ){

        return bloodRequestService.cancelBloodRequest(
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

        return bloodRequestService.createBloodRequest(
                userId,
                bloodRequest
        );

    }








    // Get all requests with owner information
    @GetMapping
    public List<BloodRequestResponseDTO> getAllRequests(){

        return bloodRequestService.getAllRequestDTO();

    }








    // Filter requests by blood group
    @GetMapping("/blood-group/{bloodGroup}")
    public List<BloodRequest> getByBloodGroup(
            @PathVariable BloodGroup bloodGroup
    ){

        return bloodRequestService
                .getRequestsByBloodGroup(bloodGroup);

    }



}