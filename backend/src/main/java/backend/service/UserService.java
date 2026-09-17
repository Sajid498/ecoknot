package backend.service;


import org.springframework.stereotype.Service;

import backend.entity.User;
import backend.exception.ResourceNotFoundException;
import backend.repository.UserRepository;



@Service
public class UserService {



    private final UserRepository userRepository;





    public UserService(
            UserRepository userRepository
    ) {

        this.userRepository = userRepository;

    }







    // Signup

    public User signup(
            User user
    ) {



        if(userRepository
                .findByEmail(user.getEmail())
                .isPresent()
        ) {


            throw new RuntimeException(
                    "Email already exists"
            );


        }







        return userRepository.save(user);


    }









    // Login

    public User login(
            String email,
            String password
    ) {



        User user =
                userRepository
                        .findByEmail(email)
                        .orElseThrow(
                                () -> new ResourceNotFoundException(
                                        "User not found"
                                )
                        );







        if(!user.getPassword()
                .equals(password)
        ) {


            throw new RuntimeException(
                    "Invalid password"
            );


        }







        return user;


    }









    // Get user profile

    public User getUserById(
            Long id
    ){


        return userRepository
                .findById(id)
                .orElseThrow(
                        () -> new ResourceNotFoundException(
                                "User not found"
                        )
                );


    }









    // Update donor profile

    public User updateProfile(
            Long id,
            User updatedUser
    ){



        User existingUser =
                userRepository
                        .findById(id)
                        .orElseThrow(
                                () -> new ResourceNotFoundException(
                                        "User not found"
                                )
                        );





        existingUser.setLocation(
                updatedUser.getLocation()
        );



        existingUser.setAvailableForDonation(
                updatedUser.isAvailableForDonation()
        );



        existingUser.setLastDonationDate(
                updatedUser.getLastDonationDate()
        );





        return userRepository.save(
                existingUser
        );


    }





}