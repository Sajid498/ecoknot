package backend.controller;



import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import backend.dto.RescueDonationDTO;
import backend.entity.RescueDonation;
import backend.entity.User;
import backend.repository.UserRepository;
import backend.service.RescueDonationService;



@RestController
@RequestMapping("/api/rescues")
public class RescueDonationController {




    private final RescueDonationService rescueDonationService;


    private final UserRepository userRepository;






    public RescueDonationController(

            RescueDonationService rescueDonationService,

            UserRepository userRepository

    ){

        this.rescueDonationService = rescueDonationService;

        this.userRepository = userRepository;

    }









    @GetMapping
    public ResponseEntity<List<RescueDonationDTO>> getAllRescues(){


        return ResponseEntity.ok(

                rescueDonationService.getAllDonations()

        );


    }









    @PostMapping
    public ResponseEntity<?> createRescue(

            @RequestBody RescueDonation donation,

            @RequestParam Long userId

    ){



        User user =

                userRepository.findById(userId)

                .orElseThrow(

                        () ->

                        new RuntimeException(

                                "User not found"

                        )

                );





        RescueDonationDTO saved =

                rescueDonationService.createDonation(

                        donation,

                        user

                );






        return ResponseEntity.ok(saved);



    }





}