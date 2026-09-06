package backend.service;


import java.util.List;

import org.springframework.stereotype.Service;

import backend.dto.DonationResponseDTO;
import backend.entity.BloodRequest;
import backend.entity.DonationResponse;
import backend.repository.BloodRequestRepository;
import backend.repository.DonationResponseRepository;



@Service
public class DonationResponseService {



    private final DonationResponseRepository donationResponseRepository;

    private final BloodRequestRepository bloodRequestRepository;





    public DonationResponseService(
            DonationResponseRepository donationResponseRepository,
            BloodRequestRepository bloodRequestRepository
    ){

        this.donationResponseRepository = donationResponseRepository;
        this.bloodRequestRepository = bloodRequestRepository;

    }







    // Create donor response

    public DonationResponse createResponse(
            DonationResponse response
    ){

        response.setStatus("PENDING");

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

                            response.getStatus(),

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









    // Accept or Reject donor response

    public DonationResponse updateStatus(
            Long id,
            String status
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


        return donationResponseRepository.save(response);

    }









    // Delete response

    public void deleteResponse(Long id){

        donationResponseRepository.deleteById(id);

    }


}