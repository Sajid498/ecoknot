package backend.service;


import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;

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


    private final PasswordEncoder passwordEncoder;






    public UserService(

            UserRepository userRepository,

            DonationResponseRepository donationResponseRepository,

            PasswordEncoder passwordEncoder

    ) {


        this.userRepository =
                userRepository;


        this.donationResponseRepository =
                donationResponseRepository;


        this.passwordEncoder =
                passwordEncoder;


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





        if(

                user.getPassword() == null

                ||

                user.getPassword().trim().isEmpty()

        ){


            throw new RuntimeException(

                    "Password is required"

            );


        }





        /*
         * Public signup must never be able
         * to create an administrator account.
         */

        user.setRole(

                "USER"

        );





        user.setPassword(

                passwordEncoder.encode(

                        user.getPassword()

                )

        );





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

                password == null

                ||

                password.isBlank()

        ){


            throw new RuntimeException(

                    "Invalid password"

            );


        }





        String storedPassword =

                user.getPassword();





        boolean passwordMatches;





        if(

                isBcryptHash(

                        storedPassword

                )

        ){


            passwordMatches =

                    passwordEncoder.matches(

                            password,

                            storedPassword

                    );


        }

        else{


            /*
             * Backward compatibility:
             * old EcoKnot users may still have
             * plaintext passwords in the database.
             *
             * If the old password matches once,
             * migrate it immediately to BCrypt.
             */

            passwordMatches =

                    storedPassword != null

                    &&

                    storedPassword.equals(

                            password

                    );





            if(passwordMatches){


                user.setPassword(

                        passwordEncoder.encode(

                                password

                        )

                );





                userRepository.save(

                        user

                );


            }


        }





        if(!passwordMatches){


            throw new RuntimeException(

                    "Invalid password"

            );


        }







        return user;


    }







    private boolean isBcryptHash(

            String password

    ){


        if(password == null){


            return false;


        }





        return password.startsWith(

                "$2a$"

        )

        ||

        password.startsWith(

                "$2b$"

        )

        ||

        password.startsWith(

                "$2y$"

        );


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