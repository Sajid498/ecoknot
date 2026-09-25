package backend.controller;


import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import backend.dto.AuthResponse;
import backend.dto.DonorProfileDTO;
import backend.entity.BloodGroup;
import backend.entity.User;
import backend.service.EligibilityService;
import backend.service.JwtService;
import backend.service.UserService;



@RestController
@RequestMapping("/api/users")
@CrossOrigin("*")
public class UserController {




    private final UserService userService;


    private final EligibilityService eligibilityService;


    private final JwtService jwtService;








    public UserController(

            UserService userService,

            EligibilityService eligibilityService,

            JwtService jwtService

    ){


        this.userService =
                userService;


        this.eligibilityService =
                eligibilityService;


        this.jwtService =
                jwtService;


    }









    // Signup


    @PostMapping("/signup")
    public User signup(

            @RequestBody User user

    ){


        return userService.signup(

                user

        );


    }









    // Login


    @PostMapping("/login")
    public AuthResponse login(

            @RequestBody User user

    ){


        User loggedInUser =

                userService.login(

                        user.getEmail(),

                        user.getPassword()

                );





        String token =

                jwtService.generateToken(

                        loggedInUser

                );





        return new AuthResponse(

                loggedInUser,

                token

        );


    }









    // Get user profile


    @GetMapping("/{id}")
    public User getUser(

            @PathVariable Long id

    ){


        return userService.getUserById(

                id

        );


    }









    // Update donor profile


    @PutMapping("/{id}")
    public User updateProfile(

            @PathVariable Long id,

            @RequestBody User user

    ){


        return userService.updateProfile(

                id,

                user

        );


    }









    // Search available donors


    @GetMapping("/search-donors")
    public List<User> searchDonors(

            @RequestParam(required = false)
            BloodGroup bloodGroup,


            @RequestParam(required = false)
            String location

    ){


        return userService.searchDonors(

                bloodGroup,

                location

        );


    }









    // Get donor dashboard


    @GetMapping("/{id}/donor-dashboard")
    public Map<String,Object> getDonorDashboard(

            @PathVariable Long id

    ){


        return userService

                .getDonorDashboard(

                        id

                );


    }









    // Phase 4.3
    // Get public donor profile with reliability


    @GetMapping("/donor-profile/{id}")
    public DonorProfileDTO getDonorProfile(

            @PathVariable Long id

    ){


        return userService

                .getDonorProfile(

                        id

                );


    }









    // Update donor availability


    @PutMapping("/{id}/availability")
    public User updateAvailability(

            @PathVariable Long id,


            @RequestBody Map<String,Boolean> body

    ){



        Boolean available =

                body.get(

                        "available"

                );







        if(available == null){


            throw new RuntimeException(

                    "Availability value is required"

            );


        }







        return userService

                .updateAvailability(

                        id,

                        available

                );


    }









    // Check donation eligibility


    @GetMapping("/{id}/eligibility")
    public Map<String,Object> checkEligibility(

            @PathVariable Long id

    ){



        boolean eligible =

                eligibilityService

                        .isEligible(id);









        Map<String,Object> response =

                new HashMap<>();









        response.put(

                "eligible",

                eligible

        );









        if(eligible){



            response.put(

                    "message",

                    "You are eligible to donate blood"

            );


        }

        else{



            LocalDate nextDate =

                    eligibilityService

                            .getNextEligibleDate(

                                    id

                            );









            response.put(

                    "message",

                    "You can donate after "
                    + nextDate

            );









            response.put(

                    "nextEligibleDate",

                    nextDate

            );


        }









        return response;


    }





}