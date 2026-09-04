package backend.controller;


import backend.entity.BloodRequest;
import backend.service.BloodRequestService;

import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/users")
@CrossOrigin("*")
public class UserBloodRequestController {


    private final BloodRequestService bloodRequestService;


    public UserBloodRequestController(
            BloodRequestService bloodRequestService
    ){

        this.bloodRequestService =
                bloodRequestService;

    }



    @GetMapping("/{userId}/blood-requests")
    public List<BloodRequest> getUserRequests(
            @PathVariable Long userId
    ){

        return bloodRequestService
                .getRequestsByUser(userId);

    }

}