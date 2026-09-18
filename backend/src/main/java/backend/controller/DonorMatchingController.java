package backend.controller;


import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import backend.dto.RecommendedDonorDTO;
import backend.service.DonorMatchingService;



@RestController
@RequestMapping("/api/donor-matching")
@CrossOrigin("*")
public class DonorMatchingController {



    private final DonorMatchingService donorMatchingService;





    public DonorMatchingController(
            DonorMatchingService donorMatchingService
    ){

        this.donorMatchingService =
                donorMatchingService;

    }








    // Get recommended donors for a blood request

    @GetMapping("/{requestId}/recommended-donors")
    public List<RecommendedDonorDTO> getRecommendedDonors(
            @PathVariable Long requestId
    ){


        return donorMatchingService
                .findRecommendedDonors(
                        requestId
                );


    }



}