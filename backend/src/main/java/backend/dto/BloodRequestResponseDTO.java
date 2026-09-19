package backend.dto;


import java.time.LocalDate;



public class BloodRequestResponseDTO {


    private Long id;


    private String patientName;


    private String bloodGroup;


    private String hospital;


    private String location;


    private String contactNumber;


    private LocalDate requiredDate;


    private Integer unitsNeeded;


    private String urgency;


    private String description;


    private String status;


    private Long userId;



    // Accepted donor information

    private Long donorId;


    private String donorName;


    private String donorBloodGroup;


    private String donorLocation;



    // Phase 4.1
    // Donation response id required for completion confirmation

    private Long donationResponseId;







    public BloodRequestResponseDTO(

            Long id,

            String patientName,

            String bloodGroup,

            String hospital,

            String location,

            String contactNumber,

            LocalDate requiredDate,

            Integer unitsNeeded,

            String urgency,

            String description,

            String status,

            Long userId,

            Long donorId,

            String donorName,

            String donorBloodGroup,

            String donorLocation,

            Long donationResponseId

    ){



        this.id = id;

        this.patientName = patientName;

        this.bloodGroup = bloodGroup;

        this.hospital = hospital;

        this.location = location;

        this.contactNumber = contactNumber;

        this.requiredDate = requiredDate;

        this.unitsNeeded = unitsNeeded;

        this.urgency = urgency;

        this.description = description;

        this.status = status;

        this.userId = userId;


        this.donorId = donorId;

        this.donorName = donorName;

        this.donorBloodGroup = donorBloodGroup;

        this.donorLocation = donorLocation;


        this.donationResponseId = donationResponseId;


    }









    public Long getId(){

        return id;

    }




    public String getPatientName(){

        return patientName;

    }




    public String getBloodGroup(){

        return bloodGroup;

    }




    public String getHospital(){

        return hospital;

    }




    public String getLocation(){

        return location;

    }




    public String getContactNumber(){

        return contactNumber;

    }




    public LocalDate getRequiredDate(){

        return requiredDate;

    }




    public Integer getUnitsNeeded(){

        return unitsNeeded;

    }




    public String getUrgency(){

        return urgency;

    }




    public String getDescription(){

        return description;

    }




    public String getStatus(){

        return status;

    }




    public Long getUserId(){

        return userId;

    }




    public Long getDonorId(){

        return donorId;

    }




    public String getDonorName(){

        return donorName;

    }




    public String getDonorBloodGroup(){

        return donorBloodGroup;

    }




    public String getDonorLocation(){

        return donorLocation;

    }





    public Long getDonationResponseId(){

        return donationResponseId;

    }



}