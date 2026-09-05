package backend.service;


import java.util.List;

import org.springframework.stereotype.Service;

import backend.entity.DonationResponse;
import backend.repository.DonationResponseRepository;



@Service
public class DonationResponseService {



    private final DonationResponseRepository donationResponseRepository;



    public DonationResponseService(
            DonationResponseRepository donationResponseRepository
    ){

        this.donationResponseRepository = donationResponseRepository;

    }




    // Create donor response

    public DonationResponse createResponse(
            DonationResponse response
    ){

        response.setStatus("Interested");

        return donationResponseRepository.save(response);

    }





    // Get all donors for a blood request

    public List<DonationResponse> getDonorsByRequestId(
            Long requestId
    ){

        return donationResponseRepository
                .findAll()
                .stream()
                .filter(
                    response -> 
                    response.getRequestId().equals(requestId)
                )
                .toList();

    }





    // Update donor response status

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