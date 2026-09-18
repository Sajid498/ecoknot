package backend.service;


import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

import org.springframework.stereotype.Service;

import backend.entity.User;
import backend.exception.ResourceNotFoundException;
import backend.repository.UserRepository;



@Service
public class EligibilityService {



    private final UserRepository userRepository;





    public EligibilityService(
            UserRepository userRepository
    ){

        this.userRepository = userRepository;

    }









    public boolean isEligible(
            Long userId
    ){


        User user =
                userRepository
                        .findById(userId)
                        .orElseThrow(
                                () -> new ResourceNotFoundException(
                                        "User not found"
                                )
                        );





        // New donor
        // No previous donation

        if(user.getLastDonationDate()==null){

            return true;

        }






        LocalDate today =
                LocalDate.now();




        long days =
                ChronoUnit.DAYS.between(
                        user.getLastDonationDate(),
                        today
                );





        return days >= 90;


    }









    public LocalDate getNextEligibleDate(
            Long userId
    ){


        User user =
                userRepository
                        .findById(userId)
                        .orElseThrow(
                                () -> new ResourceNotFoundException(
                                        "User not found"
                                )
                        );





        if(user.getLastDonationDate()==null){

            return LocalDate.now();

        }





        return user.getLastDonationDate()
                .plusDays(90);


    }









    public String getEligibilityMessage(
            Long userId
    ){



        if(isEligible(userId)){


            return "You are eligible to donate blood";


        }





        return "You can donate after "
                +
                getNextEligibleDate(userId);



    }



}