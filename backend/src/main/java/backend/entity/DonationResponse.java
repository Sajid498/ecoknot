package backend.entity;


import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;



@Entity
@Table(name = "donation_responses")
public class DonationResponse {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;



    private Long requestId;



    private Long donorId;



    private String donorName;



    private String donorEmail;



    private String donorPhone;




    @Enumerated(EnumType.STRING)
    private DonationStatus status;






    public DonationResponse(){

    }







    public DonationResponse(
            Long requestId,
            Long donorId,
            String donorName,
            String donorEmail,
            String donorPhone,
            DonationStatus status
    ){

        this.requestId = requestId;

        this.donorId = donorId;

        this.donorName = donorName;

        this.donorEmail = donorEmail;

        this.donorPhone = donorPhone;

        this.status = status;

    }









    public Long getId(){

        return id;

    }






    public Long getRequestId(){

        return requestId;

    }



    public void setRequestId(Long requestId){

        this.requestId = requestId;

    }






    public Long getDonorId(){

        return donorId;

    }



    public void setDonorId(Long donorId){

        this.donorId = donorId;

    }







    public String getDonorName(){

        return donorName;

    }



    public void setDonorName(String donorName){

        this.donorName = donorName;

    }







    public String getDonorEmail(){

        return donorEmail;

    }



    public void setDonorEmail(String donorEmail){

        this.donorEmail = donorEmail;

    }







    public String getDonorPhone(){

        return donorPhone;

    }



    public void setDonorPhone(String donorPhone){

        this.donorPhone = donorPhone;

    }








    public DonationStatus getStatus(){

        return status;

    }



    public void setStatus(DonationStatus status){

        this.status = status;

    }



}