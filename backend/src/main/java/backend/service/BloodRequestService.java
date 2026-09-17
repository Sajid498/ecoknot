package backend.service;


import java.util.List;

import org.springframework.stereotype.Service;

import backend.dto.BloodRequestResponseDTO;
import backend.entity.BloodGroup;
import backend.entity.BloodRequest;
import backend.entity.RequestStatus;
import backend.entity.User;
import backend.exception.ResourceNotFoundException;
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








    // CREATE BLOOD REQUEST

    public BloodRequest createBloodRequest(
            Long userId,
            BloodRequest bloodRequest
    ) {


        User user = userRepository
                .findById(userId)
                .orElseThrow(
                        () -> new ResourceNotFoundException(
                                "User not found"
                        )
                );


        bloodRequest.setUser(user);


        return bloodRequestRepository.save(bloodRequest);

    }









    // UPDATE BLOOD REQUEST

    public BloodRequest updateBloodRequest(
            Long requestId,
            Long userId,
            BloodRequest updatedRequest
    ) {


        BloodRequest existingRequest =
                bloodRequestRepository
                        .findById(requestId)
                        .orElseThrow(
                                () -> new ResourceNotFoundException(
                                        "Request not found"
                                )
                        );



        if(existingRequest.getUser() == null ||
                !existingRequest.getUser()
                        .getId()
                        .equals(userId)
        ) {

            throw new RuntimeException(
                    "You cannot edit another user's request"
            );

        }



        existingRequest.setPatientName(
                updatedRequest.getPatientName()
        );

        existingRequest.setBloodGroup(
                updatedRequest.getBloodGroup()
        );

        existingRequest.setHospital(
                updatedRequest.getHospital()
        );

        existingRequest.setLocation(
                updatedRequest.getLocation()
        );

        existingRequest.setContactNumber(
                updatedRequest.getContactNumber()
        );

        existingRequest.setRequiredDate(
                updatedRequest.getRequiredDate()
        );

        existingRequest.setUnitsNeeded(
                updatedRequest.getUnitsNeeded()
        );

        existingRequest.setUrgency(
                updatedRequest.getUrgency()
        );

        existingRequest.setDescription(
                updatedRequest.getDescription()
        );


        return bloodRequestRepository.save(existingRequest);

    }









    // CANCEL BLOOD REQUEST

    public BloodRequest cancelBloodRequest(
            Long requestId,
            Long userId
    ) {


        BloodRequest request =
                bloodRequestRepository
                        .findById(requestId)
                        .orElseThrow(
                                () -> new ResourceNotFoundException(
                                        "Request not found"
                                )
                        );



        if(request.getUser() == null){

            throw new RuntimeException(
                    "Request has no owner"
            );

        }



        if(!request.getUser()
                .getId()
                .equals(userId)
        ) {

            throw new RuntimeException(
                    "You cannot cancel another user's request"
            );

        }




        validateStatusTransition(
                request.getStatus(),
                RequestStatus.CANCELLED
        );



        request.setStatus(
                RequestStatus.CANCELLED
        );


        return bloodRequestRepository.save(request);

    }









    // GET ALL REQUESTS WITH USER ID

    public List<BloodRequestResponseDTO> getAllRequestDTO(){


        return bloodRequestRepository
                .findAll()
                .stream()
                .map(request ->

                    new BloodRequestResponseDTO(

                            request.getId(),

                            request.getPatientName(),

                            request.getBloodGroup() != null
                                    ? request.getBloodGroup().toString()
                                    : null,

                            request.getHospital(),

                            request.getLocation(),

                            request.getContactNumber(),

                            request.getRequiredDate(),

                            request.getUnitsNeeded(),

                            request.getUrgency() != null
                                    ? request.getUrgency().toString()
                                    : null,

                            request.getDescription(),

                            request.getStatus() != null
                                    ? request.getStatus().toString()
                                    : null,

                            request.getUser() != null
                                    ? request.getUser().getId()
                                    : null

                    )
                )
                .toList();

    }









    // GET ALL REQUESTS

    public List<BloodRequest> getAllRequests(){

        return bloodRequestRepository.findAll();

    }









    // GET REQUESTS BY BLOOD GROUP

    public List<BloodRequest> getRequestsByBloodGroup(
            BloodGroup bloodGroup
    ){

        return bloodRequestRepository
                .findByBloodGroup(bloodGroup);

    }









    // GET USER REQUESTS

    public List<BloodRequest> getRequestsByUser(
            Long userId
    ){

        return bloodRequestRepository
                .findByUserId(userId);

    }









    // UPDATE STATUS WHEN DONOR ACCEPTED

    public BloodRequest markDonorFound(
            Long requestId
    ){


        BloodRequest request =
                bloodRequestRepository
                        .findById(requestId)
                        .orElseThrow(
                                () -> new ResourceNotFoundException(
                                        "Blood request not found"
                                )
                        );




        validateStatusTransition(
                request.getStatus(),
                RequestStatus.DONOR_FOUND
        );



        request.setStatus(
                RequestStatus.DONOR_FOUND
        );


        return bloodRequestRepository.save(request);

    }









    // GET SINGLE REQUEST

    public BloodRequest getRequestById(
            Long requestId
    ){

        return bloodRequestRepository
                .findById(requestId)
                .orElseThrow(
                        () -> new ResourceNotFoundException(
                                "Blood request not found"
                        )
                );

    }









    // UPDATE STATUS WHEN DONATION COMPLETED

    public BloodRequest markFulfilled(
            Long requestId
    ){

        BloodRequest request =
                bloodRequestRepository
                        .findById(requestId)
                        .orElseThrow(
                                () -> new ResourceNotFoundException(
                                        "Blood request not found"
                                )
                        );




        validateStatusTransition(
                request.getStatus(),
                RequestStatus.FULFILLED
        );



        request.setStatus(
                RequestStatus.FULFILLED
        );


        return bloodRequestRepository.save(request);

    }









    // STATUS TRANSITION VALIDATION

    private void validateStatusTransition(
            RequestStatus currentStatus,
            RequestStatus newStatus
    ){


        boolean allowed = false;



        if(currentStatus == RequestStatus.OPEN
                && newStatus == RequestStatus.DONOR_FOUND){

            allowed = true;

        }



        if(currentStatus == RequestStatus.OPEN
                && newStatus == RequestStatus.CANCELLED){

            allowed = true;

        }



        if(currentStatus == RequestStatus.DONOR_FOUND
                && newStatus == RequestStatus.FULFILLED){

            allowed = true;

        }



        if(currentStatus == RequestStatus.DONOR_FOUND
                && newStatus == RequestStatus.CANCELLED){

            allowed = true;

        }




        if(!allowed){

            throw new RuntimeException(

                    "Invalid status transition from "
                    + currentStatus
                    + " to "
                    + newStatus

            );

        }


    }


}