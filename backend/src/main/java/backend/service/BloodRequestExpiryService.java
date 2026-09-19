package backend.service;


import java.time.LocalDate;
import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import backend.entity.BloodRequest;
import backend.entity.RequestStatus;
import backend.repository.BloodRequestRepository;



@Service
public class BloodRequestExpiryService {



    private final BloodRequestRepository bloodRequestRepository;





    public BloodRequestExpiryService(

            BloodRequestRepository bloodRequestRepository

    ){


        this.bloodRequestRepository =
                bloodRequestRepository;


    }









    // Check expired blood requests every hour

    @Scheduled(fixedRate = 3600000)
    public void expireOldRequests(){



        List<BloodRequest> requests =

                bloodRequestRepository.findAll();







        LocalDate today =

                LocalDate.now();









        for(BloodRequest request : requests){





            if(

                    request.getStatus()

                    ==

                    RequestStatus.OPEN

                    &&

                    request.getRequiredDate()

                    != null

                    &&

                    request.getRequiredDate()

                            .isBefore(today)

            ){



                request.setStatus(

                        RequestStatus.EXPIRED

                );





                bloodRequestRepository.save(

                        request

                );



            }





        }



    }



}