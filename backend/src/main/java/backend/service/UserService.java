package backend.service;


import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import backend.dto.DonorProfileDTO;
import backend.entity.BloodGroup;
import backend.entity.DonationStatus;
import backend.entity.User;
import backend.exception.ResourceNotFoundException;
import backend.repository.DonationResponseRepository;
import backend.repository.UserRepository;



@Service
public class UserService {



    private final UserRepository userRepository;


    private final DonationResponseRepository donationResponseRepository;






    public UserService(

            UserRepository userRepository,

            DonationResponseRepository donationResponseRepository

    ) {


        this.userRepository =
                userRepository;


        this.donationResponseRepository =
                donationResponseRepository;


    }









    // Signup

    public User signup(

            User user

    ) {



        if(

                userRepository

                        .findByEmail(

                                user.getEmail()

                        )

                        .isPresent()

        ) {


            throw new RuntimeException(

                    "Email already exists"

            );


        }







        return userRepository.save(

                user

        );


    }









    // Login

    public User login(

            String email,

            String password

    ) {



        User user =


                userRepository

                        .findByEmail(

                                email

                        )

                        .orElseThrow(


                                () -> new ResourceNotFoundException(

                                        "User not found"

                                )


                        );







        if(

                !user.getPassword()

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





        existingUser.setBloodGroup(

                updatedUser.getBloodGroup()

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









    // Update donor availability


    public User updateAvailability(

            Long id,

            boolean available

    ){



        User user =


                userRepository

                        .findById(id)

                        .orElseThrow(

                                () -> new ResourceNotFoundException(

                                        "User not found"

                                )

                        );








        user.setAvailableForDonation(

                available

        );







        return userRepository.save(

                user

        );


    }









    // Search available donors


    public List<User> searchDonors(

            BloodGroup bloodGroup,

            String location

    ){



        if(

                bloodGroup != null

                &&

                location != null

                &&

                !location.isBlank()

        ){



            return userRepository

                    .findByBloodGroupAndLocationContainingIgnoreCaseAndAvailableForDonationTrue(

                            bloodGroup,

                            location

                    );


        }







        if(bloodGroup != null){



            return userRepository

                    .findByBloodGroupAndAvailableForDonationTrue(

                            bloodGroup

                    );


        }







        if(

                location != null

                &&

                !location.isBlank()

        ){



            return userRepository

                    .findByLocationContainingIgnoreCaseAndAvailableForDonationTrue(

                            location

                    );


        }







        return userRepository

                .findByAvailableForDonationTrue();


    }









    // Get donor dashboard information


    public Map<String,Object> getDonorDashboard(

            Long id

    ){



        User user =


                userRepository

                        .findById(id)

                        .orElseThrow(

                                () -> new ResourceNotFoundException(

                                        "User not found"

                                )

                        );







        long completedDonations =


                donationResponseRepository

                        .countByDonorIdAndStatus(

                                id,

                                DonationStatus.COMPLETED

                        );








        int reliabilityScore =


                (int) completedDonations * 5;







        if(reliabilityScore > 20){


            reliabilityScore = 20;


        }







        String reliabilityLevel;



        if(reliabilityScore >= 15){



            reliabilityLevel =

                    "Highly Reliable";


        }

        else if(reliabilityScore > 0){



            reliabilityLevel =

                    "Reliable";


        }

        else{


            reliabilityLevel =

                    "New Donor";


        }








        Map<String,Object> dashboard =

                new HashMap<>();





        dashboard.put(

                "id",

                user.getId()

        );





        dashboard.put(

                "name",

                user.getName()

        );





        dashboard.put(

                "email",

                user.getEmail()

        );





        dashboard.put(

                "bloodGroup",

                user.getBloodGroup()

        );





        dashboard.put(

                "location",

                user.getLocation()

        );





        dashboard.put(

                "availableForDonation",

                user.isAvailableForDonation()

        );





        dashboard.put(

                "lastDonationDate",

                user.getLastDonationDate()

        );





        dashboard.put(

                "completedDonations",

                completedDonations

        );





        dashboard.put(

                "reliabilityScore",

                reliabilityScore

        );





        dashboard.put(

                "reliabilityLevel",

                reliabilityLevel

        );






        return dashboard;


    }
        // Get public donor profile with reliability information

    public DonorProfileDTO getDonorProfile(

            Long id

    ){



        User user =


                userRepository

                        .findById(id)

                        .orElseThrow(

                                () -> new ResourceNotFoundException(

                                        "User not found"

                                )

                        );









        long completedDonations =


                donationResponseRepository

                        .countByDonorIdAndStatus(

                                id,

                                DonationStatus.COMPLETED

                        );









        int reliabilityScore =


                (int) completedDonations * 5;









        if(reliabilityScore > 20){


            reliabilityScore = 20;


        }









        String reliabilityLevel;







        if(reliabilityScore >= 15){



            reliabilityLevel =

                    "Highly Reliable";


        }

        else if(reliabilityScore > 0){



            reliabilityLevel =

                    "Reliable";


        }

        else{


            reliabilityLevel =

                    "New Donor";


        }









        return new DonorProfileDTO(



                user.getId(),



                user.getName(),



                user.getBloodGroup() != null

                ?

                user.getBloodGroup().toString()

                :

                null,



                user.getLocation(),



                user.isAvailableForDonation(),



                user.getLastDonationDate(),



                completedDonations,



                reliabilityScore,



                reliabilityLevel


        );


    }



}