package backend.service;


import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import backend.dto.PickupRequestDTO;
import backend.entity.PickupRequest;
import backend.entity.PickupStatus;
import backend.entity.RescueDonation;
import backend.entity.RescueStatus;
import backend.entity.User;
import backend.repository.PickupRequestRepository;
import backend.repository.RescueDonationRepository;
import backend.repository.UserRepository;




@Service
public class PickupRequestService {




    private final PickupRequestRepository pickupRequestRepository;


    private final RescueDonationRepository rescueDonationRepository;


    private final UserRepository userRepository;


    private final NotificationService notificationService;








    public PickupRequestService(

            PickupRequestRepository pickupRequestRepository,

            RescueDonationRepository rescueDonationRepository,

            UserRepository userRepository,

            NotificationService notificationService

    ){


        this.pickupRequestRepository = pickupRequestRepository;

        this.rescueDonationRepository = rescueDonationRepository;

        this.userRepository = userRepository;

        this.notificationService = notificationService;


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







        /*
         * Security validation
         *
         * A user cannot request pickup
         * from their own relief post
         */

        if(

            rescue.getUser()

                  .getId()

                  .equals(volunteerId)

        ){


            throw new RuntimeException(

                    "You cannot request pickup for your own relief post"

            );


        }









        /*
         * Pickup requests can only be created
         * while the relief post is available
         */

        if(

            rescue.getStatus()

                  != RescueStatus.AVAILABLE

        ){


            throw new RuntimeException(

                    "This relief post is no longer available for pickup"

            );


        }









        /*
         * Prevent the same volunteer from creating
         * multiple active pickup requests
         * for the same relief post
         */

        boolean activeRequestExists =

                pickupRequestRepository

                .findByRescueDonationId(rescueId)

                .stream()

                .anyMatch(

                        existing ->

                                existing.getVolunteer()

                                        .getId()

                                        .equals(volunteerId)

                                &&

                                existing.getStatus()

                                        != PickupStatus.REJECTED

                                &&

                                existing.getStatus()

                                        != PickupStatus.DELIVERED

                );







        if(activeRequestExists){


            throw new RuntimeException(

                    "You already have an active pickup request for this relief post"

            );


        }









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









        notificationService.createNotification(


                rescue.getUser().getId(),


                volunteer.getName()

                + " requested pickup for your relief donation: "

                + rescue.getTitle(),


                "PICKUP_REQUEST"

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












    // Get requests for relief post

    public List<PickupRequestDTO> getReliefRequests(

            Long rescueId

    ){


        return pickupRequestRepository

                .findByRescueDonationId(rescueId)

                .stream()

                .map(this::convertToDTO)

                .toList();


    }






    // Get all pickup requests
    // from relief posts owned by a user

    public List<PickupRequestDTO> getOwnerRequests(

            Long userId

    ){


        return pickupRequestRepository

                .findByRescueDonationUserId(userId)

                .stream()

                .map(this::convertToDTO)

                .toList();


    }





    // Approve pickup request
    // Only donation owner can approve

    public PickupRequestDTO approveRequest(

            Long requestId,

            Long userId

    ){



        PickupRequest request =

                getRequest(requestId);






        checkDonationOwner(

                request,

                userId

        );






        if(

            request.getStatus()

                   != PickupStatus.PENDING

        ){


            throw new RuntimeException(

                    "Only pending pickup requests can be approved"

            );


        }









        RescueDonation rescue =

                request.getRescueDonation();







        if(

            rescue.getStatus()

                  != RescueStatus.AVAILABLE

        ){


            throw new RuntimeException(

                    "This relief post is no longer available"

            );


        }









        request.setStatus(

                PickupStatus.APPROVED

        );





        request.setApprovedAt(

                LocalDateTime.now()

        );









        /*
         * Reserve relief post so another volunteer
         * cannot be approved for the same donation
         */

        rescue.setStatus(

                RescueStatus.RESERVED

        );





        rescueDonationRepository.save(

                rescue

        );









        PickupRequest saved =

                pickupRequestRepository.save(

                        request

                );









        /*
         * Reject every other pending request
         * for this relief post
         */

        List<PickupRequest> otherRequests =

                pickupRequestRepository

                .findByRescueDonationId(

                        rescue.getId()

                );







        for(

            PickupRequest otherRequest

            :

            otherRequests

        ){


            if(

                !otherRequest.getId()

                             .equals(requestId)

                &&

                otherRequest.getStatus()

                            == PickupStatus.PENDING

            ){


                otherRequest.setStatus(

                        PickupStatus.REJECTED

                );





                pickupRequestRepository.save(

                        otherRequest

                );





                notificationService.createNotification(


                        otherRequest.getVolunteer().getId(),


                        "Your pickup request for "

                        + rescue.getTitle()

                        + " was closed because another volunteer was selected.",


                        "PICKUP_REJECTED"

                );


            }


        }









        notificationService.createNotification(


                request.getVolunteer().getId(),


                "Your pickup request for "

                + request.getRescueDonation().getTitle()

                + " has been approved.",


                "PICKUP_APPROVED"

        );








        return convertToDTO(saved);


    }












    // Reject pickup request
    // Only donation owner can reject

    public PickupRequestDTO rejectRequest(

            Long requestId,

            Long userId

    ){



        PickupRequest request =

                getRequest(requestId);






        checkDonationOwner(

                request,

                userId

        );







        if(

            request.getStatus()

                   != PickupStatus.PENDING

        ){


            throw new RuntimeException(

                    "Only pending pickup requests can be rejected"

            );


        }







        request.setStatus(

                PickupStatus.REJECTED

        );






        PickupRequest saved =

                pickupRequestRepository.save(

                        request

                );









        notificationService.createNotification(


                request.getVolunteer().getId(),


                "Your pickup request for "

                + request.getRescueDonation().getTitle()

                + " has been rejected.",


                "PICKUP_REJECTED"

        );








        return convertToDTO(saved);


    }












    // Mark picked up

    public PickupRequestDTO markPickedUp(

            Long requestId

    ){



        PickupRequest request =

                getRequest(requestId);






        if(

            request.getStatus()

                   != PickupStatus.APPROVED

        ){


            throw new RuntimeException(

                    "Pickup must be approved before it can be collected"

            );


        }







        request.setStatus(

                PickupStatus.PICKED_UP

        );









        RescueDonation rescue =

                request.getRescueDonation();






        rescue.setStatus(

                RescueStatus.PICKED_UP

        );






        rescueDonationRepository.save(

                rescue

        );






        PickupRequest saved =

                pickupRequestRepository.save(

                        request

                );







        notificationService.createNotification(


                request.getRescueDonation()

                .getUser()

                .getId(),


                "Your donation "

                + request.getRescueDonation().getTitle()

                + " has been picked up.",


                "PICKUP_COMPLETED"

        );







        return convertToDTO(saved);


    }












    // Mark delivered

    public PickupRequestDTO markDelivered(

            Long requestId

    ){



        PickupRequest request =

                getRequest(requestId);






        if(

            request.getStatus()

                   != PickupStatus.PICKED_UP

        ){


            throw new RuntimeException(

                    "The item must be picked up before delivery can be completed"

            );


        }







        request.setStatus(

                PickupStatus.DELIVERED

        );






        request.setCompletedAt(

                LocalDateTime.now()

        );







        RescueDonation rescue =

                request.getRescueDonation();






        rescue.setStatus(

                RescueStatus.DELIVERED

        );






        rescueDonationRepository.save(

                rescue

        );







        PickupRequest saved =

                pickupRequestRepository.save(

                        request

                );









        notificationService.createNotification(


                rescue.getUser().getId(),


                "Your donation "

                + rescue.getTitle()

                + " has been delivered successfully.",


                "DELIVERY_COMPLETE"

        );








        return convertToDTO(saved);


    }












    private void checkDonationOwner(

            PickupRequest request,

            Long userId

    ){



        Long ownerId =

                request

                .getRescueDonation()

                .getUser()

                .getId();







        if(!ownerId.equals(userId)){


            throw new RuntimeException(

                    "You are not allowed to perform this action"

            );


        }


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

                        rescue.getQuantity(),

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