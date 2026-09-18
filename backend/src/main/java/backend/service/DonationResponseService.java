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








    public DonationResponseService(

            DonationResponseRepository donationResponseRepository,

            BloodRequestRepository bloodRequestRepository,

            BloodRequestService bloodRequestService,

            UserRepository userRepository,

            NotificationService notificationService

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

                request.getUser() != null

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









        // Validate donor exists


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









        // Reject other pending donors


        rejectOtherDonors(

                response

        );









        // Send notifications


        sendAcceptanceNotifications(

                response

        );









        // Update blood request with accepted donor


        bloodRequestService

                .markDonorFound(

                        response.getRequestId(),

                        response.getDonorId()

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













    // Get completed donation history


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
        // Get donors for specific blood request


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

            DonationStatus status

    ){



        DonationResponse response =


                donationResponseRepository

                        .findById(id)

                        .orElseThrow(

                                () -> new ResourceNotFoundException(

                                        "Donation response not found"

                                )

                        );









        response.setStatus(

                status

        );









        DonationResponse savedResponse =


                donationResponseRepository.save(

                        response

                );









        // When requester accepts donor

        if(

                status == DonationStatus.ACCEPTED

        ){



            bloodRequestService

                    .markDonorFound(

                            response.getRequestId(),

                            response.getDonorId()

                    );







            sendAcceptanceNotifications(

                    response

            );



        }









        // When donation completed

        if(

                status == DonationStatus.COMPLETED

        ){



            bloodRequestService

                    .markFulfilled(

                            response.getRequestId()

                    );


        }









        return savedResponse;


    }












    // Reject other donors after accepting one donor


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













    // Send notification after acceptance


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









        // Notify donor


        notificationService.createNotification(

                response.getDonorId(),

                "Your blood donation request has been accepted.",

                "DONATION_ACCEPTED"

        );









        // Notify requester


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