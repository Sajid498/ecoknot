package backend.service;


import org.springframework.stereotype.Service;


import backend.dto.UserProfileDTO;
import backend.entity.User;
import backend.exception.ResourceNotFoundException;
import backend.repository.UserRepository;




@Service
public class UserProfileService {





    private final UserRepository userRepository;








    public UserProfileService(

            UserRepository userRepository

    ){


        this.userRepository = userRepository;


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












    // Convert Entity to DTO

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