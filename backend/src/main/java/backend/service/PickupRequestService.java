package backend.service;


import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import backend.entity.PickupRequest;
import backend.entity.PickupStatus;
import backend.entity.RescueDonation;
import backend.entity.User;
import backend.repository.PickupRequestRepository;
import backend.repository.RescueDonationRepository;
import backend.repository.UserRepository;





@Service
public class PickupRequestService {





    private final PickupRequestRepository pickupRequestRepository;


    private final RescueDonationRepository rescueDonationRepository;


    private final UserRepository userRepository;








    public PickupRequestService(

            PickupRequestRepository pickupRequestRepository,

            RescueDonationRepository rescueDonationRepository,

            UserRepository userRepository

    ){


        this.pickupRequestRepository = pickupRequestRepository;

        this.rescueDonationRepository = rescueDonationRepository;

        this.userRepository = userRepository;


    }









    // Volunteer requests pickup

    public PickupRequest createPickupRequest(

            Long rescueId,

            Long volunteerId

    ){



        RescueDonation rescue =

                rescueDonationRepository

                .findById(rescueId)

                .orElseThrow(

                        () -> new RuntimeException(

                                "Relief post not found"

                        )

                );







        User volunteer =

                userRepository

                .findById(volunteerId)

                .orElseThrow(

                        () -> new RuntimeException(

                                "Volunteer not found"

                        )

                );







        PickupRequest request =

                new PickupRequest();







        request.setRescueDonation(

                rescue

        );







        request.setVolunteer(

                volunteer

        );







        request.setStatus(

                PickupStatus.PENDING

        );







        request.setRequestedAt(

                LocalDateTime.now()

        );







        return pickupRequestRepository.save(

                request

        );


    }









    // Get volunteer pickup requests

    public List<PickupRequest> getVolunteerRequests(

            Long volunteerId

    ){



        User volunteer =

                userRepository

                .findById(volunteerId)

                .orElseThrow(

                        () -> new RuntimeException(

                                "Volunteer not found"

                        )

                );







        return pickupRequestRepository

                .findByVolunteer(

                        volunteer

                );


    }









    // Get requests for a relief post

    public List<PickupRequest> getReliefRequests(

            Long rescueId

    ){


        return pickupRequestRepository

                .findByRescueDonationId(

                        rescueId

                );


    }









    // Approve pickup request

    public PickupRequest approveRequest(

            Long requestId

    ){



        PickupRequest request =

                getRequest(requestId);







        request.setStatus(

                PickupStatus.APPROVED

        );







        request.setApprovedAt(

                LocalDateTime.now()

        );







        return pickupRequestRepository.save(

                request

        );


    }









    // Mark item picked up

    public PickupRequest markPickedUp(

            Long requestId

    ){



        PickupRequest request =

                getRequest(requestId);







        request.setStatus(

                PickupStatus.PICKED_UP

        );







        return pickupRequestRepository.save(

                request

        );


    }









    // Mark delivered

    public PickupRequest markDelivered(

            Long requestId

    ){



        PickupRequest request =

                getRequest(requestId);







        request.setStatus(

                PickupStatus.DELIVERED

        );







        request.setCompletedAt(

                LocalDateTime.now()

        );







        return pickupRequestRepository.save(

                request

        );


    }









    private PickupRequest getRequest(

            Long id

    ){


        return pickupRequestRepository

                .findById(id)

                .orElseThrow(

                        () -> new RuntimeException(

                                "Pickup request not found"

                        )

                );


    }






}