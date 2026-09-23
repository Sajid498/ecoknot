package backend.controller;



import java.util.List;


import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
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













    // Get all relief posts


    @GetMapping

    public ResponseEntity<List<RescueDonationDTO>> getAllRescues(){



        return ResponseEntity.ok(


                rescueDonationService.getAllDonations()


        );


    }













    // Get user's own relief posts


    @GetMapping("/user/{userId}")

    public ResponseEntity<List<RescueDonationDTO>> getUserRescues(


            @PathVariable Long userId


    ){



        return ResponseEntity.ok(


                rescueDonationService.getUserDonations(userId)


        );


    }













    // Get single relief post by id


    @GetMapping("/{id}")

    public ResponseEntity<RescueDonationDTO> getSingleRescue(


            @PathVariable Long id


    ){



        return ResponseEntity.ok(


                rescueDonationService.getDonationById(id)


        );


    }













    // Create relief post


    @PostMapping

    public ResponseEntity<?> createRescue(


            @RequestBody RescueDonation donation,


            @RequestParam Long userId


    ){



        User user =


                userRepository.findById(userId)


                .orElseThrow(


                        () -> new RuntimeException(


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













    // Update relief post


    @PutMapping("/{id}")

    public ResponseEntity<RescueDonationDTO> updateRescue(


            @PathVariable Long id,


            @RequestBody RescueDonation donation


    ){



        return ResponseEntity.ok(


                rescueDonationService.updateDonation(


                        id,


                        donation


                )


        );


    }













    // Delete relief post


    @DeleteMapping("/{id}")

    public ResponseEntity<?> deleteRescue(


            @PathVariable Long id


    ){



        rescueDonationService.deleteDonation(id);





        return ResponseEntity.ok(


                "Relief post deleted successfully"


        );


    }






}