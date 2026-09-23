package backend.dto;


import java.time.LocalDate;

import backend.entity.BloodGroup;



public class UserProfileDTO {




    private Long id;



    private String name;



    private String email;



    private String role;



    private String location;



    private BloodGroup bloodGroup;



    private boolean availableForDonation;



    private LocalDate lastDonationDate;








    public UserProfileDTO(

            Long id,

            String name,

            String email,

            String role,

            String location,

            BloodGroup bloodGroup,

            boolean availableForDonation,

            LocalDate lastDonationDate

    ){


        this.id = id;

        this.name = name;

        this.email = email;

        this.role = role;

        this.location = location;

        this.bloodGroup = bloodGroup;

        this.availableForDonation = availableForDonation;

        this.lastDonationDate = lastDonationDate;


    }









    public Long getId(){

        return id;

    }







    public String getName(){

        return name;

    }







    public String getEmail(){

        return email;

    }







    public String getRole(){

        return role;

    }







    public String getLocation(){

        return location;

    }







    public BloodGroup getBloodGroup(){

        return bloodGroup;

    }







    public boolean isAvailableForDonation(){

        return availableForDonation;

    }







    public LocalDate getLastDonationDate(){

        return lastDonationDate;

    }



}