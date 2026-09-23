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









    // ======================================
    // Create Help Request
    // ======================================


    public TimeRequest createRequest(

            Long userId,

            String title,

            String description,

            String category,

            Integer hours

    ){


        User user = userRepository.findById(userId)

                .orElseThrow(

                () -> new RuntimeException("User not found")

                );




        TimeRequest request = new TimeRequest(

                user,

                title,

                description,

                category,

                hours

        );



        return timeRequestRepository.save(request);


    }









    // ======================================
    // Get Open Requests
    // ======================================


    public List<TimeRequest> getOpenRequests(){



        return timeRequestRepository

                .findByStatus("OPEN");


    }









    // ======================================
    // Get User Requests
    // ======================================


    public List<TimeRequest> getUserRequests(

            Long userId

    ){


        return timeRequestRepository

                .findByRequesterId(userId);


    }









    // ======================================
    // Accept Request
    // ======================================


    @Transactional
    public TimeRequest acceptRequest(

            Long requestId

    ){


        TimeRequest request = timeRequestRepository

                .findById(requestId)

                .orElseThrow(

                () -> new RuntimeException("Request not found")

                );



        request.setStatus("ACCEPTED");



        return timeRequestRepository.save(request);


    }









    // ======================================
    // Complete Work & Give Credit
    // ======================================


    @Transactional
    public TimeTransaction completeRequest(

            Long requestId,

            Long helperId

    ){



        TimeRequest request = timeRequestRepository

                .findById(requestId)

                .orElseThrow(

                () -> new RuntimeException("Request not found")

                );



        User helper = userRepository.findById(helperId)

                .orElseThrow(

                () -> new RuntimeException("Helper not found")

                );





        request.setStatus("COMPLETED");

        timeRequestRepository.save(request);







       TimeTransaction transaction = new TimeTransaction();


transaction.setProvider(helper);


transaction.setRequester(

        request.getRequester()

);



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









    // ======================================
    // Calculate Balance
    // ======================================


    public Integer getBalance(

            Long userId

    ){



     List<TimeTransaction> transactions =

        timeTransactionRepository

        .findByProviderIdOrderByCreatedAtDesc(userId);




        return transactions.stream()

                .mapToInt(

                TimeTransaction::getHours

                )

                .sum();



    }







}