package backend.dto;


import java.time.LocalDate;



public class DonorProfileDTO {


    private Long id;


    private String name;


    private String bloodGroup;


    private String location;


    private boolean availableForDonation;


    private LocalDate lastDonationDate;


    private long completedDonations;


    private int reliabilityScore;


    private String reliabilityLevel;





    public DonorProfileDTO(

            Long id,

            String name,

            String bloodGroup,

            String location,

            boolean availableForDonation,

            LocalDate lastDonationDate,

            long completedDonations,

            int reliabilityScore,

            String reliabilityLevel

    ){


        this.id = id;

        this.name = name;

        this.bloodGroup = bloodGroup;

        this.location = location;

        this.availableForDonation =
                availableForDonation;

        this.lastDonationDate =
                lastDonationDate;

        this.completedDonations =
                completedDonations;

        this.reliabilityScore =
                reliabilityScore;

        this.reliabilityLevel =
                reliabilityLevel;


    }







    public Long getId(){

        return id;

    }




    public String getName(){

        return name;

    }




    public String getBloodGroup(){

        return bloodGroup;

    }




    public String getLocation(){

        return location;

    }




    public boolean isAvailableForDonation(){

        return availableForDonation;

    }




    public LocalDate getLastDonationDate(){

        return lastDonationDate;

    }




    public long getCompletedDonations(){

        return completedDonations;

    }




    public int getReliabilityScore(){

        return reliabilityScore;

    }




    public String getReliabilityLevel(){

        return reliabilityLevel;

    }



}