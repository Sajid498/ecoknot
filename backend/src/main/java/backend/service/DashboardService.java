package backend.service;


import org.springframework.stereotype.Service;

import backend.dto.DashboardStatsDTO;
import backend.entity.PickupStatus;
import backend.repository.PickupRequestRepository;
import backend.repository.RescueDonationRepository;
import backend.repository.TimeOfferRepository;
import backend.repository.TimeTransactionRepository;
import backend.repository.UserRepository;



@Service
public class DashboardService {





    private final RescueDonationRepository rescueDonationRepository;


    private final PickupRequestRepository pickupRequestRepository;


    private final UserRepository userRepository;


    private final TimeOfferRepository timeOfferRepository;


    private final TimeTransactionRepository timeTransactionRepository;









    public DashboardService(

            RescueDonationRepository rescueDonationRepository,

            PickupRequestRepository pickupRequestRepository,

            UserRepository userRepository,

            TimeOfferRepository timeOfferRepository,

            TimeTransactionRepository timeTransactionRepository

    ){


        this.rescueDonationRepository = rescueDonationRepository;


        this.pickupRequestRepository = pickupRequestRepository;


        this.userRepository = userRepository;


        this.timeOfferRepository = timeOfferRepository;


        this.timeTransactionRepository = timeTransactionRepository;


    }









    public DashboardStatsDTO getStats(){






        long totalRelief =

                rescueDonationRepository.count();








        long foodDonations =

                rescueDonationRepository

                        .countByType("FOOD");








        long medicineDonations =

                rescueDonationRepository

                        .countByType("MEDICINE");








        long completedDeliveries =

                pickupRequestRepository

                        .countByStatus(

                                PickupStatus.DELIVERED

                        );








        long totalUsers =

                userRepository.count();









        // =============================
        // Volunteer Time Bank Statistics
        // =============================


        long totalTimeOffers =

                timeOfferRepository.count();








        long totalTimeCredits =

                timeTransactionRepository

                        .findAll()

                        .stream()

                        .mapToLong(

                                transaction ->

                                        transaction.getAmount()

                        )

                        .sum();









        return new DashboardStatsDTO(

                totalRelief,

                foodDonations,

                medicineDonations,

                completedDeliveries,

                totalUsers,

                totalTimeOffers,

                totalTimeCredits

        );


    }



}