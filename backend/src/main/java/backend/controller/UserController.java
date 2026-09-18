package backend.controller;


import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import backend.entity.User;
import backend.service.EligibilityService;
import backend.service.UserService;




@RestController
@RequestMapping("/api/users")
@CrossOrigin("*")
public class UserController {




    private final UserService userService;


    private final EligibilityService eligibilityService;






    public UserController(

            UserService userService,

            EligibilityService eligibilityService

    ){


        this.userService =
                userService;


        this.eligibilityService =
                eligibilityService;


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
    public User login(

            @RequestBody User user

    ){


        return userService.login(

                user.getEmail(),

                user.getPassword()

        );


    }









    // Get profile

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