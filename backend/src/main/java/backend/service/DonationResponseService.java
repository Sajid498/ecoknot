package backend.service;


import java.util.List;

import org.springframework.stereotype.Service;

import backend.dto.DonationResponseDTO;
import backend.entity.BloodRequest;
import backend.entity.DonationResponse;
import backend.entity.DonationStatus;
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
                                        () -> new RuntimeException(
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
                                () -> new RuntimeException(
                                        "Donation response not found"
                                )
                        );



        response.setStatus(status);



        DonationResponse savedResponse =
                donationResponseRepository.save(response);






        // When donor accepts request

        if(status == DonationStatus.ACCEPTED){


            bloodRequestService
                    .markDonorFound(
                            response.getRequestId()
                    );

        }






        // When donation is completed

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