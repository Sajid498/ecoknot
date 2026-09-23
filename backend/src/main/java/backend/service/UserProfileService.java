package backend.service;


import org.springframework.stereotype.Service;


import backend.dto.ProfileStatsDTO;
import backend.dto.UserProfileDTO;

import backend.entity.PickupStatus;
import backend.entity.User;

import backend.exception.ResourceNotFoundException;

import backend.repository.BloodRequestRepository;
import backend.repository.PickupRequestRepository;
import backend.repository.RescueDonationRepository;
import backend.repository.UserRepository;



@Service
public class UserProfileService {





    private final UserRepository userRepository;


    private final RescueDonationRepository rescueDonationRepository;


    private final BloodRequestRepository bloodRequestRepository;


    private final PickupRequestRepository pickupRequestRepository;









    public UserProfileService(

            UserRepository userRepository,

            RescueDonationRepository rescueDonationRepository,

            BloodRequestRepository bloodRequestRepository,

            PickupRequestRepository pickupRequestRepository

    ){


        this.userRepository = userRepository;

        this.rescueDonationRepository =
                rescueDonationRepository;

        this.bloodRequestRepository =
                bloodRequestRepository;

        this.pickupRequestRepository =
                pickupRequestRepository;


    }









    // Get user profile

    public UserProfileDTO getProfile(

            Long userId

    ){



        User user =

                userRepository

                        .findById(userId)

                        .orElseThrow(

                                () ->

                                new ResourceNotFoundException(

                                        "User not found"

                                )

                        );






        return convertToDTO(user);



    }













    // Update user profile

    public UserProfileDTO updateProfile(

            Long userId,

            User updatedUser

    ){



        User existingUser =

                userRepository

                        .findById(userId)

                        .orElseThrow(

                                () ->

                                new ResourceNotFoundException(

                                        "User not found"

                                )

                        );








        existingUser.setName(

                updatedUser.getName()

        );








        existingUser.setLocation(

                updatedUser.getLocation()

        );








        existingUser.setBloodGroup(

                updatedUser.getBloodGroup()

        );








        existingUser.setAvailableForDonation(

                updatedUser.isAvailableForDonation()

        );








        existingUser.setLastDonationDate(

                updatedUser.getLastDonationDate()

        );









        User savedUser =

                userRepository.save(

                        existingUser

                );








        return convertToDTO(savedUser);



    }












    // Get profile statistics

    public ProfileStatsDTO getProfileStats(

            Long userId

    ){





        long reliefPosts =

                rescueDonationRepository

                        .findByUserId(userId)

                        .size();








        long bloodRequests =

                bloodRequestRepository

                        .findByUserId(userId)

                        .size();








        long completedPickups =

                pickupRequestRepository

                        .countByVolunteerIdAndStatus(

                                userId,

                                PickupStatus.DELIVERED

                        );









        return new ProfileStatsDTO(

                reliefPosts,

                bloodRequests,

                completedPickups

        );



    }












    // Convert User Entity to DTO

    private UserProfileDTO convertToDTO(

            User user

    ){



        return new UserProfileDTO(

                user.getId(),

                user.getName(),

                user.getEmail(),

                user.getRole(),

                user.getLocation(),

                user.getBloodGroup(),

                user.isAvailableForDonation(),

                user.getLastDonationDate()

        );


    }






}