package backend.controller;


import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import backend.entity.DonationResponse;
import backend.service.DonationResponseService;



@RestController
@RequestMapping("/api/donation-response")
@CrossOrigin("*")
public class DonationResponseController {



    private final DonationResponseService donationResponseService;



    public DonationResponseController(
            DonationResponseService donationResponseService
    ){

        this.donationResponseService = donationResponseService;

    }






    // Donor clicks "I Want To Donate"

    @PostMapping
    public DonationResponse createResponse(
            @RequestBody DonationResponse response
    ){

        return donationResponseService.createResponse(response);

    }







    // Get donors for a specific blood request

    @GetMapping("/request/{requestId}")
    public List<DonationResponse> getDonorsByRequest(
            @PathVariable Long requestId
    ){

        return donationResponseService
                .getDonorsByRequestId(requestId);

    }







    // Update donation status

    @PutMapping("/{id}")
    public DonationResponse updateStatus(
            @PathVariable Long id,
            @RequestParam String status
    ){

        return donationResponseService
                .updateStatus(id,status);

    }







    // Delete donation response

    @DeleteMapping("/{id}")
    public String deleteResponse(
            @PathVariable Long id
    ){

        donationResponseService.deleteResponse(id);

        return "Donation response deleted successfully";

    }


}