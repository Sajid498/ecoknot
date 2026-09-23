package backend.service;


import java.time.LocalDateTime;
import java.util.List;


import org.springframework.stereotype.Service;


import backend.entity.TimeOffer;
import backend.entity.TimeOfferStatus;
import backend.entity.TimeTransaction;
import backend.entity.TransactionType;
import backend.entity.User;

import backend.exception.ResourceNotFoundException;

import backend.repository.TimeOfferRepository;
import backend.repository.TimeTransactionRepository;
import backend.repository.UserRepository;



@Service
public class TimeBankService {





    private final TimeOfferRepository timeOfferRepository;

    private final TimeTransactionRepository timeTransactionRepository;

    private final UserRepository userRepository;









    public TimeBankService(

            TimeOfferRepository timeOfferRepository,

            TimeTransactionRepository timeTransactionRepository,

            UserRepository userRepository

    ){


        this.timeOfferRepository = timeOfferRepository;

        this.timeTransactionRepository = timeTransactionRepository;

        this.userRepository = userRepository;


    }









    // ==================================
    // Create Time Offer
    // ==================================

    public TimeOffer createOffer(

            Long userId,

            String title,

            String description,

            String skillCategory,

            Integer hours

    ){



        User user = userRepository

                .findById(userId)

                .orElseThrow(

                        () -> new ResourceNotFoundException(

                                "User not found"

                        )

                );





        TimeOffer offer = new TimeOffer(

                user,

                title,

                description,

                skillCategory,

                hours

        );





        return timeOfferRepository.save(

                offer

        );


    }









    // ==================================
    // Get Available Offers
    // ==================================

    public List<TimeOffer> getAvailableOffers(){



        return timeOfferRepository

                .findByStatusOrderByCreatedAtDesc(

                        TimeOfferStatus.AVAILABLE

                );


    }









    // ==================================
    // Get User Offers
    // ==================================

    public List<TimeOffer> getUserOffers(

            Long userId

    ){



        return timeOfferRepository

                .findByUserId(

                        userId

                );


    }









    // ==================================
    // Complete Exchange
    // Earn credits for provider
    // ==================================

    public TimeTransaction completeExchange(

            Long userId,

            Long offerId

    ){



        User user = userRepository

                .findById(userId)

                .orElseThrow(

                        () -> new ResourceNotFoundException(

                                "User not found"

                        )

                );






        TimeOffer offer = timeOfferRepository

                .findById(offerId)

                .orElseThrow(

                        () -> new ResourceNotFoundException(

                                "Offer not found"

                        )

                );







        offer.setStatus(

                TimeOfferStatus.COMPLETED

        );



        timeOfferRepository.save(

                offer

        );







        TimeTransaction transaction =

                new TimeTransaction(

                        user,

                        offer.getAvailableHours(),

                        TransactionType.EARN,

                        "Completed: "

                        + offer.getTitle()

                );







        transaction.setCreatedAt(

                LocalDateTime.now()

        );







        return timeTransactionRepository.save(

                transaction

        );


    }









    // ==================================
    // Create Spend Transaction
    // ==================================

    public TimeTransaction spendCredits(

            Long userId,

            Integer hours,

            String description

    ){



        User user = userRepository

                .findById(userId)

                .orElseThrow(

                        () -> new ResourceNotFoundException(

                                "User not found"

                        )

                );








        if(getBalance(userId) < hours){


            throw new RuntimeException(

                    "Not enough time credits"

            );


        }








        TimeTransaction transaction =

                new TimeTransaction(

                        user,

                        -hours,

                        TransactionType.SPEND,

                        description

                );








        return timeTransactionRepository.save(

                transaction

        );


    }









    // ==================================
    // Calculate Balance
    // ==================================

    public Integer getBalance(

            Long userId

    ){



        List<TimeTransaction> transactions =

                timeTransactionRepository

                        .findByUserId(

                                userId

                        );







        return transactions

                .stream()

                .mapToInt(

                        TimeTransaction::getAmount

                )

                .sum();



    }









    // ==================================
    // Transaction History
    // ==================================

    public List<TimeTransaction> getHistory(

            Long userId

    ){



        return timeTransactionRepository

                .findByUserIdOrderByCreatedAtDesc(

                        userId

                );


    }






}