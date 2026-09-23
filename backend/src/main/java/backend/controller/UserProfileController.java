package backend.controller;


import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import backend.dto.ProfileStatsDTO;
import backend.dto.UserProfileDTO;

import backend.entity.User;

import backend.service.UserProfileService;





@RestController
@RequestMapping("/api/profile")
@CrossOrigin("*")
public class UserProfileController {





    private final UserProfileService userProfileService;







    public UserProfileController(

            UserProfileService userProfileService

    ){


        this.userProfileService = userProfileService;


    }









    // Get user profile

    @GetMapping("/{userId}")

    public ResponseEntity<UserProfileDTO> getProfile(

            @PathVariable Long userId

    ){



        return ResponseEntity.ok(

                userProfileService.getProfile(

                        userId

                )

        );


    }









    // Update user profile

    @PutMapping("/{userId}")

    public ResponseEntity<UserProfileDTO> updateProfile(

            @PathVariable Long userId,

            @RequestBody User user

    ){



        return ResponseEntity.ok(

                userProfileService.updateProfile(

                        userId,

                        user

                )

        );


    }









    // Get profile statistics

    @GetMapping("/{userId}/stats")

    public ResponseEntity<ProfileStatsDTO> getProfileStats(

            @PathVariable Long userId

    ){



        return ResponseEntity.ok(

                userProfileService.getProfileStats(

                        userId

                )

        );


    }






}