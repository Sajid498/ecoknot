package backend.service;


import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Comparator;
import java.util.List;

import org.springframework.stereotype.Service;

import backend.dto.RecommendedDonorDTO;
import backend.entity.BloodGroup;
import backend.entity.BloodRequest;
import backend.entity.DonationStatus;
import backend.entity.UrgencyLevel;
import backend.entity.User;
import backend.exception.ResourceNotFoundException;
import backend.repository.BloodRequestRepository;
import backend.repository.DonationResponseRepository;
import backend.repository.UserRepository;



@Service
public class DonorMatchingService {



    private final UserRepository userRepository;


    private final BloodRequestRepository bloodRequestRepository;


    private final DonationResponseRepository donationResponseRepository;







    public DonorMatchingService(

            UserRepository userRepository,

            BloodRequestRepository bloodRequestRepository,

            DonationResponseRepository donationResponseRepository

    ){


        this.userRepository =
                userRepository;


        this.bloodRequestRepository =
                bloodRequestRepository;


        this.donationResponseRepository =
                donationResponseRepository;


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









        // Blood compatibility


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









        // Location score


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









        // Eligibility score


        if(
                isEligible(donor)
        ){


            score += 15;


            reason.append(
                    "Eligible donor. "
            );


        }









        // Availability score


        if(
                donor.isAvailableForDonation()
        ){


            score += 10;


            reason.append(
                    "Currently available. "
            );


        }









        // Critical request priority


        if(

                request.getUrgency()
                == UrgencyLevel.CRITICAL

        ){


            score += 10;


            reason.append(
                    "Critical request priority. "
            );


        }









        // Reliability score


        int reliabilityScore =

                calculateReliabilityScore(
                        donor.getId()
                );



        score += reliabilityScore;





        if(reliabilityScore >= 15){


            reason.append(
                    "Highly reliable donor. "
            );


        }

        else if(reliabilityScore > 0){


            reason.append(
                    "Previous donation history found. "
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









    // Reliability calculation


    private int calculateReliabilityScore(

            Long donorId

    ){


        long completedDonations =

                donationResponseRepository
                        .countByDonorIdAndStatus(

                                donorId,

                                DonationStatus.COMPLETED

                        );





        int score =

                (int)(completedDonations * 5);






        if(score > 20){

            score = 20;

        }





        return score;


    }









    // Eligibility check


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









    // Location matching


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









    // Blood compatibility


    // Blood compatibility

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







    switch(donorGroup){



        // Universal donor

        case O_NEGATIVE:


            return true;







        // O+ can donate to positive groups

        case O_POSITIVE:


            return requestGroup == BloodGroup.O_POSITIVE

                    ||

                    requestGroup == BloodGroup.A_POSITIVE

                    ||

                    requestGroup == BloodGroup.B_POSITIVE

                    ||

                    requestGroup == BloodGroup.AB_POSITIVE;









        // A-

        case A_NEGATIVE:


            return requestGroup == BloodGroup.A_NEGATIVE

                    ||

                    requestGroup == BloodGroup.A_POSITIVE

                    ||

                    requestGroup == BloodGroup.AB_NEGATIVE

                    ||

                    requestGroup == BloodGroup.AB_POSITIVE;









        // A+

        case A_POSITIVE:


            return requestGroup == BloodGroup.A_POSITIVE

                    ||

                    requestGroup == BloodGroup.AB_POSITIVE;









        // B-

        case B_NEGATIVE:


            return requestGroup == BloodGroup.B_NEGATIVE

                    ||

                    requestGroup == BloodGroup.B_POSITIVE

                    ||

                    requestGroup == BloodGroup.AB_NEGATIVE

                    ||

                    requestGroup == BloodGroup.AB_POSITIVE;









        // B+

        case B_POSITIVE:


            return requestGroup == BloodGroup.B_POSITIVE

                    ||

                    requestGroup == BloodGroup.AB_POSITIVE;









        // AB-

        case AB_NEGATIVE:


            return requestGroup == BloodGroup.AB_NEGATIVE

                    ||

                    requestGroup == BloodGroup.AB_POSITIVE;









        // AB+

        case AB_POSITIVE:


            return requestGroup == BloodGroup.AB_POSITIVE;







        default:

            return false;


    }


}



}