package backend.service;

import backend.entity.BloodRequest;
import backend.entity.User;
import backend.repository.BloodRequestRepository;
import backend.repository.UserRepository;

import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class BloodRequestService {


    private final BloodRequestRepository bloodRequestRepository;

    private final UserRepository userRepository;


    public BloodRequestService(
            BloodRequestRepository bloodRequestRepository,
            UserRepository userRepository
    ) {
        this.bloodRequestRepository = bloodRequestRepository;
        this.userRepository = userRepository;
    }



    // Create blood request for a user
    public BloodRequest createBloodRequest(
            Long userId,
            BloodRequest bloodRequest
    ) {


        User user = userRepository
                .findById(userId)
                .orElseThrow(
                        () -> new RuntimeException(
                                "User not found"
                        )
                );


        bloodRequest.setUser(user);


        return bloodRequestRepository
                .save(bloodRequest);
    }



    // Get all requests
    public List<BloodRequest> getAllRequests(){

        return bloodRequestRepository.findAll();

    }
    public List<BloodRequest> getRequestsByUser(
        Long userId
){

    return bloodRequestRepository
            .findByUserId(userId);

}


}