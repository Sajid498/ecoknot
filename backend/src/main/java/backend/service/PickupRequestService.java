package backend.service;


import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import backend.dto.PickupRequestDTO;
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

    public PickupRequestDTO createPickupRequest(

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







        PickupRequest saved =

                pickupRequestRepository.save(

                        request

                );






        return convertToDTO(saved);



    }









    // Get volunteer pickup requests

    public List<PickupRequestDTO> getVolunteerRequests(

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

                .findByVolunteer(volunteer)

                .stream()

                .map(this::convertToDTO)

                .toList();


    }









    // Get requests for a relief post

    public List<PickupRequestDTO> getReliefRequests(

            Long rescueId

    ){



        return pickupRequestRepository

                .findByRescueDonationId(rescueId)

                .stream()

                .map(this::convertToDTO)

                .toList();


    }









    // Approve pickup request

    public PickupRequestDTO approveRequest(

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






        PickupRequest saved =

                pickupRequestRepository.save(request);






        return convertToDTO(saved);


    }









    // Reject pickup request

    public PickupRequestDTO rejectRequest(

            Long requestId

    ){



        PickupRequest request =

                getRequest(requestId);






        request.setStatus(

                PickupStatus.REJECTED

        );






        PickupRequest saved =

                pickupRequestRepository.save(request);






        return convertToDTO(saved);


    }









    // Mark picked up

    public PickupRequestDTO markPickedUp(

            Long requestId

    ){



        PickupRequest request =

                getRequest(requestId);






        request.setStatus(

                PickupStatus.PICKED_UP

        );






        PickupRequest saved =

                pickupRequestRepository.save(request);






        return convertToDTO(saved);


    }









    // Mark delivered

    public PickupRequestDTO markDelivered(

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






        PickupRequest saved =

                pickupRequestRepository.save(request);






        return convertToDTO(saved);


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









    private PickupRequestDTO convertToDTO(

            PickupRequest request

    ){



        User volunteer =

                request.getVolunteer();




        RescueDonation rescue =

                request.getRescueDonation();







        PickupRequestDTO.VolunteerDTO volunteerDTO =

                new PickupRequestDTO.VolunteerDTO(

                        volunteer.getId(),

                        volunteer.getName(),

                        volunteer.getEmail(),

                        volunteer.getLocation()

                );







        PickupRequestDTO.RescueInfoDTO rescueDTO =

                new PickupRequestDTO.RescueInfoDTO(

                        rescue.getId(),

                        rescue.getTitle(),

                        rescue.getType().toString(),

                        rescue.getLocation()

                );







        return new PickupRequestDTO(

                request.getId(),

                request.getStatus(),

                request.getRequestedAt(),

                request.getApprovedAt(),

                request.getCompletedAt(),

                volunteerDTO,

                rescueDTO

        );


    }






}