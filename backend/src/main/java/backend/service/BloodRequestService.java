package backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import backend.entity.BloodRequest;
import backend.entity.RequestStatus;
import backend.entity.User;
import backend.repository.BloodRequestRepository;
import backend.repository.UserRepository;


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

public BloodRequest cancelBloodRequest(Long requestId, Long userId){

    BloodRequest request = bloodRequestRepository
            .findById(requestId)
            .orElseThrow(
                    () -> new RuntimeException("Request not found")
            );


    if(request.getUser().getId().equals(userId)){

        request.setStatus(RequestStatus.CANCELLED);

        return bloodRequestRepository.save(request);

    }
    else{

        throw new RuntimeException(
                "You cannot cancel another user's request"
        );

    }

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