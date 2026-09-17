package backend.service;


import java.util.List;

import org.springframework.stereotype.Service;

import backend.dto.DonationHistoryDTO;
import backend.dto.DonationResponseDTO;
import backend.entity.BloodRequest;
import backend.entity.DonationResponse;
import backend.entity.DonationStatus;
import backend.exception.ResourceNotFoundException;
import backend.repository.BloodRequestRepository;
import backend.repository.DonationResponseRepository;



@Service
public class DonationResponseService {



    private final DonationResponseRepository donationResponseRepository;

    private final BloodRequestRepository bloodRequestRepository;

    private final BloodRequestService bloodRequestService;





    public DonationResponseService(
            DonationResponseRepository donationResponseRepository,
            BloodRequestRepository bloodRequestRepository,
            BloodRequestService bloodRequestService
    ){

        this.donationResponseRepository = donationResponseRepository;

        this.bloodRequestRepository = bloodRequestRepository;

        this.bloodRequestService = bloodRequestService;

    }









    // Create donor response

    public DonationResponse createResponse(
            DonationResponse response
    ){



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



        return donationResponseRepository.save(response);


    }









    // Get donations made by a donor

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


                            response.getStatus() != null
                                    ? response.getStatus().toString()
                                    : null,


                            request.getUser().getId(),

                            request.getUser().getName()

                    );


                })
                .toList();


    }









    // Get donation history of donor

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

                            request.getBloodGroup() != null
                                    ? request.getBloodGroup().toString()
                                    : null,


                            request.getHospital(),

                            request.getLocation(),

                            response.getStatus().toString(),

                            request.getCreatedAt()

                    );


                })
                .toList();


    }









    // Get all donors for a blood request

    public List<DonationResponse> getDonorsByRequestId(
            Long requestId
    ){

        return donationResponseRepository
                .findByRequestId(requestId);

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






        // Prevent multiple accepted donors

        if(status == DonationStatus.ACCEPTED){


            List<DonationResponse> existingDonors =
                    donationResponseRepository
                            .findByRequestId(
                                    response.getRequestId()
                            );



            boolean alreadyAccepted =
                    existingDonors
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


        }







        response.setStatus(status);



        DonationResponse savedResponse =
                donationResponseRepository.save(response);








        // Update blood request status

        if(status == DonationStatus.ACCEPTED){


            bloodRequestService
                    .markDonorFound(
                            response.getRequestId()
                    );

        }







        if(status == DonationStatus.COMPLETED){


            bloodRequestService
                    .markFulfilled(
                            response.getRequestId()
                    );

        }







        return savedResponse;

    }









    // Delete response

    public void deleteResponse(Long id){

        donationResponseRepository.deleteById(id);

    }


}