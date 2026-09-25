package backend.service;


import java.util.List;

import org.springframework.stereotype.Service;

import backend.dto.DonationHistoryDTO;
import backend.dto.DonationResponseDTO;
import backend.entity.BloodRequest;
import backend.entity.DonationResponse;
import backend.entity.DonationStatus;
import backend.entity.RequestStatus;
import backend.exception.ResourceNotFoundException;
import backend.repository.BloodRequestRepository;
import backend.repository.DonationResponseRepository;
import backend.repository.UserRepository;



@Service
public class DonationResponseService {



    private final DonationResponseRepository donationResponseRepository;


    private final BloodRequestRepository bloodRequestRepository;


    private final BloodRequestService bloodRequestService;


    private final UserRepository userRepository;


    private final NotificationService notificationService;


    private final EligibilityService eligibilityService;





    public DonationResponseService(

            DonationResponseRepository donationResponseRepository,

            BloodRequestRepository bloodRequestRepository,

            BloodRequestService bloodRequestService,

            UserRepository userRepository,

            NotificationService notificationService,

            EligibilityService eligibilityService

    ){


        this.donationResponseRepository =
                donationResponseRepository;


        this.bloodRequestRepository =
                bloodRequestRepository;


        this.bloodRequestService =
                bloodRequestService;


        this.userRepository =
                userRepository;


        this.notificationService =
                notificationService;


        this.eligibilityService =
                eligibilityService;


    }









    // Create donor response


    public DonationResponse createResponse(

            DonationResponse response

    ){


        BloodRequest request =

                bloodRequestRepository

                        .findById(
                                response.getRequestId()
                        )

                        .orElseThrow(

                                () -> new ResourceNotFoundException(
                                        "Blood request not found"
                                )

                        );






        if(

                request.getStatus()
                != RequestStatus.OPEN

        ){


            throw new RuntimeException(

                    "This blood request is not available"

            );


        }







        if(

                request.getUser()!=null

                &&

                request.getUser()
                        .getId()
                        .equals(
                                response.getDonorId()
                        )

        ){


            throw new RuntimeException(

                    "You cannot donate to your own request"

            );


        }



        userRepository

                .findById(

                        response.getDonorId()

                )

                .orElseThrow(

                        () -> new ResourceNotFoundException(

                                "Donor not found"

                        )

                );





        if(

                !eligibilityService

                        .isEligible(

                                response.getDonorId()

                        )

        ){


            throw new RuntimeException(

                    eligibilityService

                            .getEligibilityMessage(

                                    response.getDonorId()

                            )

            );


        }








        boolean alreadyApplied =


                donationResponseRepository

                        .existsByRequestIdAndDonorId(

                                response.getRequestId(),

                                response.getDonorId()

                        );







        if(alreadyApplied){


            throw new RuntimeException(

                    "You already applied for this blood request"

            );


        }








        response.setStatus(

                DonationStatus.PENDING

        );






        return donationResponseRepository.save(

                response

        );


    }












    // Accept recommended donor directly


    public DonationResponse acceptRecommendedDonor(

            DonationResponse response

    ){



        BloodRequest request =

                bloodRequestRepository

                        .findById(

                                response.getRequestId()

                        )

                        .orElseThrow(

                                () -> new ResourceNotFoundException(

                                        "Blood request not found"

                                )

                        );









        if(

                request.getStatus()

                != RequestStatus.OPEN

        ){


            throw new RuntimeException(

                    "Blood request is not available"

            );


        }








        userRepository

                .findById(

                        response.getDonorId()

                )

                .orElseThrow(

                        () -> new ResourceNotFoundException(

                                "Donor not found"

                        )

                );









        boolean alreadyAccepted =


                donationResponseRepository

                        .findByRequestId(

                                response.getRequestId()

                        )

                        .stream()

                        .anyMatch(

                                donor ->

                                donor.getStatus()

                                == DonationStatus.ACCEPTED

                        );









        if(alreadyAccepted){


            throw new RuntimeException(

                    "A donor is already accepted for this request"

            );


        }









        response.setStatus(

                DonationStatus.ACCEPTED

        );








        DonationResponse savedResponse =


                donationResponseRepository.save(

                        response

                );









        rejectOtherDonors(

                response

        );








        sendAcceptanceNotifications(

                response

        );









        bloodRequestService

                .markDonorFound(

                        response.getRequestId(),

                        response.getDonorId()

                );








        return savedResponse;


    }
    // ==================================================
    // PHASE 4.1
    // Requester confirms donation completion
    // ==================================================

    public DonationResponse confirmDonationCompletion(

            Long donationId,

            Long requesterId

    ){



        DonationResponse response =

                donationResponseRepository

                        .findById(donationId)

                        .orElseThrow(

                                () -> new ResourceNotFoundException(

                                        "Donation response not found"

                                )

                        );









        BloodRequest request =

                bloodRequestRepository

                        .findById(

                                response.getRequestId()

                        )

                        .orElseThrow(

                                () -> new ResourceNotFoundException(

                                        "Blood request not found"

                                )

                        );









        // Only requester can confirm completion

        if(

                request.getUser() == null

                ||

                !request.getUser()

                        .getId()

                        .equals(requesterId)

        ){


            throw new RuntimeException(

                    "Only request owner can confirm donation"

            );


        }









        // Donation must be accepted first

        if(

                response.getStatus()

                != DonationStatus.ACCEPTED

        ){


            throw new RuntimeException(

                    "Only accepted donation can be completed"

            );


        }









        response.setStatus(

                DonationStatus.COMPLETED

        );









        DonationResponse savedResponse =

                donationResponseRepository.save(

                        response

                );









        // Update blood request

        bloodRequestService

                .markFulfilled(

                        request.getId()

                );









        // Notify donor

        notificationService.createNotification(

                response.getDonorId(),

                "Your blood donation has been confirmed completed.",

                "DONATION_COMPLETED"

        );









        // Notify requester

        notificationService.createNotification(

                requesterId,

                "Donation completed successfully.",

                "DONATION_COMPLETED"

        );









        return savedResponse;


    }













    // Get donations made by donor


    public List<DonationResponseDTO> getDonationsByDonor(

            Long donorId

    ){



        return donationResponseRepository

                .findByDonorId(donorId)

                .stream()

                .map(response -> {


                    BloodRequest request =


                            bloodRequestRepository

                                    .findById(

                                            response.getRequestId()

                                    )

                                    .orElseThrow(

                                            () -> new ResourceNotFoundException(

                                                    "Blood request not found"

                                            )

                                    );






                    return new DonationResponseDTO(


                            response.getId(),


                            response.getRequestId(),


                            response.getDonorId(),



                            response.getStatus()!=null

                            ?

                            response.getStatus().toString()

                            :

                            null,



                            request.getUser().getId(),



                            request.getUser().getName()


                    );


                })

                .toList();


    }












    // Donation History


    public List<DonationHistoryDTO> getDonationHistory(

            Long donorId

    ){



        return donationResponseRepository

                .findByDonorId(donorId)

                .stream()

                .filter(

                        response ->

                        response.getStatus()

                        == DonationStatus.COMPLETED

                )

                .map(response -> {



                    BloodRequest request =


                            bloodRequestRepository

                                    .findById(

                                            response.getRequestId()

                                    )

                                    .orElseThrow(

                                            () -> new ResourceNotFoundException(

                                                    "Blood request not found"

                                            )

                                    );







                    return new DonationHistoryDTO(


                            response.getId(),


                            request.getId(),


                            request.getPatientName(),



                            request.getBloodGroup()!=null

                            ?

                            request.getBloodGroup().toString()

                            :

                            null,



                            request.getHospital(),



                            request.getLocation(),



                            response.getStatus().toString(),



                            request.getCreatedAt()



                    );


                })

                .toList();


    }












    // Get donors for request


    public List<DonationResponse> getDonorsByRequestId(

            Long requestId

    ){


        return donationResponseRepository

                .findByRequestId(

                        requestId

                );


    }













    // Update donation status


    public DonationResponse updateStatus(

            Long id,

            DonationStatus status,

            Long requesterId

    ){



        DonationResponse response =

                donationResponseRepository

                        .findById(id)

                        .orElseThrow(

                                () -> new ResourceNotFoundException(

                                        "Donation response not found"

                                )

                        );





        BloodRequest request =

                bloodRequestRepository

                        .findById(

                                response.getRequestId()

                        )

                        .orElseThrow(

                                () -> new ResourceNotFoundException(

                                        "Blood request not found"

                                )

                        );





        // Only the blood request owner can accept/reject donors

        if(

                request.getUser() == null

                ||

                !request.getUser()

                        .getId()

                        .equals(requesterId)

        ){


            throw new RuntimeException(

                    "Only the request owner can update donor status"

            );


        }





        // COMPLETED must use the dedicated requester-confirmation endpoint

        if(

                status == DonationStatus.COMPLETED

        ){


            throw new RuntimeException(

                    "Use donation completion confirmation endpoint"

            );


        }





        // Accept/reject is only valid while this response is pending

        if(

                response.getStatus()

                != DonationStatus.PENDING

        ){


            throw new RuntimeException(

                    "Only pending donor responses can be accepted or rejected"

            );


        }





        if(

                status != DonationStatus.ACCEPTED

                &&

                status != DonationStatus.REJECTED

        ){


            throw new RuntimeException(

                    "Only ACCEPTED or REJECTED status is allowed here"

            );


        }





        if(

                status == DonationStatus.ACCEPTED

        ){


            boolean alreadyAccepted =

                    donationResponseRepository

                            .findByRequestId(

                                    response.getRequestId()

                            )

                            .stream()

                            .anyMatch(

                                    donor ->

                                            !donor.getId()

                                                    .equals(

                                                            response.getId()

                                                    )

                                            &&

                                            donor.getStatus()

                                                    == DonationStatus.ACCEPTED

                            );





            if(alreadyAccepted){


                throw new RuntimeException(

                        "A donor is already accepted for this request"

                );


            }


        }





        response.setStatus(

                status

        );





        DonationResponse savedResponse =

                donationResponseRepository.save(

                        response

                );





        if(

                status == DonationStatus.ACCEPTED

        ){


            bloodRequestService

                    .markDonorFound(

                            response.getRequestId(),

                            response.getDonorId()

                    );





            rejectOtherDonors(

                    response

            );





            sendAcceptanceNotifications(

                    response

            );


        }





        return savedResponse;


    }







    // Reject other donors


    private void rejectOtherDonors(

            DonationResponse acceptedResponse

    ){



        List<DonationResponse> donors =


                donationResponseRepository

                        .findByRequestId(

                                acceptedResponse.getRequestId()

                        );








        donors.forEach(

                donor -> {



                    if(

                            !donor.getId()

                                    .equals(

                                            acceptedResponse.getId()

                                    )

                            &&

                            donor.getStatus()

                                    == DonationStatus.PENDING

                    ){


                        donor.setStatus(

                                DonationStatus.REJECTED

                        );


                        donationResponseRepository.save(

                                donor

                        );


                    }


                }

        );


    }













    // Send acceptance notification


    private void sendAcceptanceNotifications(

            DonationResponse response

    ){



        BloodRequest request =


                bloodRequestRepository

                        .findById(

                                response.getRequestId()

                        )

                        .orElseThrow(

                                () -> new ResourceNotFoundException(

                                        "Blood request not found"

                                )

                        );









        notificationService.createNotification(

                response.getDonorId(),

                "Your blood donation request has been accepted.",

                "DONATION_ACCEPTED"

        );








        if(request.getUser()!=null){



            notificationService.createNotification(

                    request.getUser().getId(),

                    "A donor has been accepted for your blood request.",

                    "DONOR_FOUND"

            );


        }



    }













    // Delete donation response


    public void deleteResponse(

            Long id

    ){



        DonationResponse response =


                donationResponseRepository

                        .findById(id)

                        .orElseThrow(

                                () -> new ResourceNotFoundException(

                                        "Donation response not found"

                                )

                        );








        donationResponseRepository.delete(

                response

        );


    }


}