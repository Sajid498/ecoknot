package backend.dto;


import java.time.LocalDateTime;


public class DonationHistoryDTO {


    private Long id;

    private Long requestId;

    private String patientName;

    private String bloodGroup;

    private String hospital;

    private String location;

    private String status;

    private LocalDateTime createdAt;



    public DonationHistoryDTO(
            Long id,
            Long requestId,
            String patientName,
            String bloodGroup,
            String hospital,
            String location,
            String status,
            LocalDateTime createdAt
    ){

        this.id = id;

        this.requestId = requestId;

        this.patientName = patientName;

        this.bloodGroup = bloodGroup;

        this.hospital = hospital;

        this.location = location;

        this.status = status;

        this.createdAt = createdAt;

    }




    public Long getId(){

        return id;

    }



    public Long getRequestId(){

        return requestId;

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



    public String getStatus(){

        return status;

    }



    public LocalDateTime getCreatedAt(){

        return createdAt;

    }


}