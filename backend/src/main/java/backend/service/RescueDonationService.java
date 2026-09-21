package backend.service;


import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import backend.dto.RescueDonationDTO;
import backend.entity.RescueDonation;
import backend.entity.RescueStatus;
import backend.entity.User;
import backend.repository.RescueDonationRepository;



@Service
public class RescueDonationService {




    private final RescueDonationRepository rescueDonationRepository;





    public RescueDonationService(

            RescueDonationRepository rescueDonationRepository

    ){

        this.rescueDonationRepository = rescueDonationRepository;

    }









    public List<RescueDonationDTO> getAllDonations(){



        updateExpiredStatus();





        return rescueDonationRepository

                .findAll()

                .stream()

                .map(this::convertToDTO)

                .toList();


    }









    // Get posts created by a specific donor

    public List<RescueDonationDTO> getUserDonations(

            Long userId

    ){


        return rescueDonationRepository

                .findByUserId(userId)

                .stream()

                .map(this::convertToDTO)

                .toList();


    }









    public RescueDonationDTO createDonation(

            RescueDonation donation,

            User user

    ){



        donation.setUser(user);


        donation.setCreatedAt(

                LocalDateTime.now()

        );





        if(donation.getStatus()==null){


            donation.setStatus(

                    RescueStatus.AVAILABLE

            );


        }







        RescueDonation saved =

                rescueDonationRepository.save(

                        donation

                );






        return convertToDTO(saved);



    }









    /*
        Automatically update expired donations

        AVAILABLE
              |
              |
        expiry time passed
              |
              |
        EXPIRED

    */


    private void updateExpiredStatus(){





        List<RescueDonation> donations =

                rescueDonationRepository.findAll();







        LocalDateTime now =

                LocalDateTime.now();








        for(RescueDonation donation : donations){






            if(

                donation.getExpiryTime()!=null

                &&

                donation.getExpiryTime().isBefore(now)

                &&

                donation.getStatus()!=RescueStatus.EXPIRED

            ){





                donation.setStatus(

                        RescueStatus.EXPIRED

                );






                rescueDonationRepository.save(

                        donation

                );




            }





        }




    }









    private RescueDonationDTO convertToDTO(

            RescueDonation donation

    ){



        return new RescueDonationDTO(


                donation.getId(),

                donation.getTitle(),

                donation.getDescription(),

                donation.getType(),

                donation.getQuantity(),

                donation.getLocation(),

                donation.getLatitude(),

                donation.getLongitude(),

                donation.getExpiryTime(),

                donation.getStatus(),



                donation.getUser()!=null

                ?

                donation.getUser().getName()

                :

                null,




                donation.getUser()!=null

                ?

                donation.getUser().getId()

                :

                null,




                donation.getCreatedAt()


        );


    }





}