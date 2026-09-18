package backend.service;


import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Comparator;
import java.util.List;

import org.springframework.stereotype.Service;

import backend.dto.RecommendedDonorDTO;
import backend.entity.BloodGroup;
import backend.entity.BloodRequest;
import backend.entity.UrgencyLevel;
import backend.entity.User;
import backend.exception.ResourceNotFoundException;
import backend.repository.BloodRequestRepository;
import backend.repository.UserRepository;



@Service
public class DonorMatchingService {



    private final UserRepository userRepository;


    private final BloodRequestRepository bloodRequestRepository;






    public DonorMatchingService(
            UserRepository userRepository,
            BloodRequestRepository bloodRequestRepository
    ){

        this.userRepository = userRepository;

        this.bloodRequestRepository = bloodRequestRepository;

    }









    public List<RecommendedDonorDTO> findRecommendedDonors(
            Long requestId
    ){


        BloodRequest request =
                bloodRequestRepository
                        .findById(requestId)
                        .orElseThrow(
                                () -> new ResourceNotFoundException(
                                        "Blood request not found"
                                )
                        );







        List<User> donors =
                userRepository
                        .findByAvailableForDonationTrue();







        return donors

                .stream()

                .filter(
                        this::isEligible
                )

                .map(
                        donor ->
                                createRecommendation(
                                        donor,
                                        request
                                )
                )

                .filter(
                        dto ->
                                dto.getScore() > 0
                )

                .sorted(
                        Comparator.comparingInt(
                                RecommendedDonorDTO::getScore
                        )
                        .reversed()
                )

                .toList();


    }









    private RecommendedDonorDTO createRecommendation(
            User donor,
            BloodRequest request
    ){


        int score = 0;


        StringBuilder reason =
                new StringBuilder();







        // ==========================
        // Blood Compatibility
        // ==========================


        if(
            isBloodCompatible(
                    donor.getBloodGroup(),
                    request.getBloodGroup()
            )
        ){


            score += 50;


            reason.append(
                    "Blood group compatible. "
            );


        }

        else{


            return new RecommendedDonorDTO(

                    donor.getId(),

                    donor.getName(),

                    donor.getBloodGroup()!=null
                    ?
                    donor.getBloodGroup().toString()
                    :
                    null,

                    donor.getLocation(),

                    0,

                    "Blood group not compatible"

            );


        }









        // ==========================
        // Advanced Location Matching
        // ==========================


        int locationScore =
                calculateLocationScore(
                        donor.getLocation(),
                        request.getLocation()
                );



        score += locationScore;




        if(locationScore == 25){


            reason.append(
                    "Same location. "
            );


        }
        else if(locationScore == 20){


            reason.append(
                    "Nearby location. "
            );


        }
        else{


            reason.append(
                    "Different location. "
            );


        }









        // ==========================
        // Eligibility Score
        // ==========================


        if(
                isEligible(donor)
        ){


            score += 15;


            reason.append(
                    "Eligible donor. "
            );


        }









        // ==========================
        // Availability Score
        // ==========================


        if(
                donor.isAvailableForDonation()
        ){


            score += 10;


            reason.append(
                    "Currently available. "
            );


        }









        // ==========================
        // Urgency Priority
        // ==========================


        if(
                request.getUrgency()
                == UrgencyLevel.CRITICAL
        ){


            score += 10;


            reason.append(
                    "Critical request priority. "
            );


        }









        return new RecommendedDonorDTO(

                donor.getId(),

                donor.getName(),

                donor.getBloodGroup()!=null
                ?
                donor.getBloodGroup().toString()
                :
                null,

                donor.getLocation(),

                score,

                reason.toString()

        );


    }









    // ==========================
    // Donation Eligibility
    // ==========================


    private boolean isEligible(
            User donor
    ){



        if(
                donor.getLastDonationDate()==null
        ){

            return true;

        }







        long days =

                ChronoUnit.DAYS.between(

                        donor.getLastDonationDate(),

                        LocalDate.now()

                );







        return days >= 90;


    }









    // ==========================
    // Location Intelligence
    // ==========================


    private int calculateLocationScore(
            String donorLocation,
            String requestLocation
    ){



        if(
                donorLocation == null
                ||
                requestLocation == null
        ){

            return 0;

        }







        if(
                donorLocation.equalsIgnoreCase(
                        requestLocation
                )
        ){

            return 25;

        }







        if(
                isNearbyLocation(
                        donorLocation,
                        requestLocation
                )
        ){

            return 20;

        }







        return 10;


    }









    private boolean isNearbyLocation(
            String donorLocation,
            String requestLocation
    ){



        String donor =
                donorLocation.toLowerCase();


        String request =
                requestLocation.toLowerCase();







        String[][] nearbyAreas = {


                {
                    "dhaka",
                    "uttara",
                    "mirpur",
                    "dhanmondi",
                    "gulshan",
                    "banani"
                },



                {
                    "chittagong",
                    "agrabad",
                    "halishahar"
                },



                {
                    "sylhet",
                    "zindabazar"
                }



        };









        for(String[] area : nearbyAreas){


            boolean donorMatch = false;


            boolean requestMatch = false;





            for(String place : area){


                if(
                    donor.contains(place)
                ){

                    donorMatch = true;

                }





                if(
                    request.contains(place)
                ){

                    requestMatch = true;

                }


            }







            if(
                    donorMatch
                    &&
                    requestMatch
            ){

                return true;

            }



        }







        return false;


    }









    // ==========================
    // Blood Compatibility
    // ==========================


    private boolean isBloodCompatible(

            BloodGroup donorGroup,

            BloodGroup requestGroup

    ){



        if(
                donorGroup == null
                ||
                requestGroup == null
        ){

            return false;

        }







        if(
                donorGroup == requestGroup
        ){

            return true;

        }







        // Universal donor

        if(
                donorGroup == BloodGroup.O_NEGATIVE
        ){

            return true;

        }







        return false;


    }




}