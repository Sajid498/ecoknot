package backend.service;



import org.springframework.stereotype.Service;

import backend.dto.DashboardStatsDTO;
import backend.entity.PickupStatus;
import backend.repository.PickupRequestRepository;
import backend.repository.RescueDonationRepository;
import backend.repository.UserRepository;





@Service
public class DashboardService {





    private final RescueDonationRepository rescueDonationRepository;


    private final PickupRequestRepository pickupRequestRepository;


    private final UserRepository userRepository;








    public DashboardService(

            RescueDonationRepository rescueDonationRepository,

            PickupRequestRepository pickupRequestRepository,

            UserRepository userRepository

    ){


        this.rescueDonationRepository = rescueDonationRepository;

        this.pickupRequestRepository = pickupRequestRepository;

        this.userRepository = userRepository;


    }









    public DashboardStatsDTO getStats(){



        long totalRelief =

                rescueDonationRepository.count();






        long foodDonations =

                rescueDonationRepository

                .countByType(

                        "FOOD"

                );








        long medicineDonations =

                rescueDonationRepository

                .countByType(

                        "MEDICINE"

                );








        long completedDeliveries =

                pickupRequestRepository

                .countByStatus(

                        PickupStatus.DELIVERED

                );








        long totalUsers =

                userRepository.count();







        return new DashboardStatsDTO(

                totalRelief,

                foodDonations,

                medicineDonations,

                completedDeliveries,

                totalUsers

        );



    }




}