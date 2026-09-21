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


        return rescueDonationRepository

                .findAll()

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