package backend.service;


import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import backend.entity.TimeRequest;
import backend.entity.TimeTransaction;
import backend.entity.User;
import backend.repository.TimeRequestRepository;
import backend.repository.TimeTransactionRepository;
import backend.repository.UserRepository;



@Service
public class TimeBankService {




    private final TimeRequestRepository timeRequestRepository;

    private final TimeTransactionRepository timeTransactionRepository;

    private final UserRepository userRepository;







    public TimeBankService(

            TimeRequestRepository timeRequestRepository,

            TimeTransactionRepository timeTransactionRepository,

            UserRepository userRepository

    ){

        this.timeRequestRepository = timeRequestRepository;

        this.timeTransactionRepository = timeTransactionRepository;

        this.userRepository = userRepository;

    }









    // ==================================================
    // CREATE HELP REQUEST
    // User creates a request
    // ==================================================


    public TimeRequest createRequest(

            Long userId,

            String title,

            String description,

            String category,

            Integer hours

    ){


        User requester = userRepository.findById(userId)

                .orElseThrow(

                () -> new RuntimeException("User not found")

                );



        TimeRequest request = new TimeRequest(

                requester,

                title,

                description,

                category,

                hours

        );



        return timeRequestRepository.save(request);


    }









    // ==================================================
    // GET AVAILABLE REQUESTS
    // Show requests from other users only
    // ==================================================


    public List<TimeRequest> getOpenRequests(

            Long userId

    ){


        return timeRequestRepository

                .findByStatusAndRequesterIdNot(

                        "OPEN",

                        userId

                );


    }









    // ==================================================
    // GET MY REQUESTS
    // ==================================================


    public List<TimeRequest> getUserRequests(

            Long userId

    ){


        return timeRequestRepository

                .findByRequesterId(userId);


    }









    // ==================================================
    // ACCEPT REQUEST
    // User B accepts User A request
    // ==================================================


    @Transactional
    public TimeRequest acceptRequest(

            Long requestId,

            Long helperId

    ){



        TimeRequest request = timeRequestRepository

                .findById(requestId)

                .orElseThrow(

                () -> new RuntimeException(
                        "Request not found"
                )

                );





        if(!request.getStatus().equals("OPEN")){


            throw new RuntimeException(
                    "Request already accepted"
            );


        }






        User helper = userRepository.findById(helperId)

                .orElseThrow(

                () -> new RuntimeException(
                        "Helper not found"
                )

                );






        // prevent user accepting own request

        if(request.getRequester().getId()
                .equals(helperId)){


            throw new RuntimeException(
                    "You cannot accept your own request"
            );


        }





        request.setHelper(helper);

        request.setStatus("ACCEPTED");



        return timeRequestRepository.save(request);


    }









    // ==================================================
    // COMPLETE REQUEST
    // Helper receives credits
    // ==================================================


    @Transactional
    public TimeTransaction completeRequest(

            Long requestId

    ){



        TimeRequest request = timeRequestRepository

                .findById(requestId)

                .orElseThrow(

                () -> new RuntimeException(
                        "Request not found"
                )

                );






        if(request.getHelper() == null){


            throw new RuntimeException(
                    "No helper accepted this request"
            );


        }







        if(!request.getStatus().equals("ACCEPTED")){


            throw new RuntimeException(
                    "Request is not ready for completion"
            );


        }







        User helper = request.getHelper();

        User requester = request.getRequester();







        request.setStatus("COMPLETED");


        timeRequestRepository.save(request);







        TimeTransaction transaction = new TimeTransaction();



        // Person who helped
        transaction.setProvider(helper);



        // Person who received help
        transaction.setRequester(requester);




        transaction.setHours(

                request.getRequiredHours()

        );





        transaction.setDescription(

                "Completed help request: "

                + request.getTitle()

        );






        transaction.setTransactionType(

                "EARN"

        );





        transaction.setCreatedAt(

                LocalDateTime.now()

        );






        return timeTransactionRepository.save(transaction);


    }









    // ==================================================
    // GET BALANCE
    // Earned credits
    // ==================================================


    public Integer getBalance(

            Long userId

    ){



        List<TimeTransaction> transactions =


                timeTransactionRepository

                .findByProviderIdOrderByCreatedAtDesc(

                        userId

                );





        return transactions.stream()


                .mapToInt(

                TimeTransaction::getHours

                )


                .sum();


    }







}