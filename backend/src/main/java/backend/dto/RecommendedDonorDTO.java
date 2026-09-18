package backend.dto;



public class RecommendedDonorDTO {



    private Long donorId;


    private String name;


    private String bloodGroup;


    private String location;


    private int score;


    private String reason;







    public RecommendedDonorDTO(){


    }








    public RecommendedDonorDTO(
            Long donorId,
            String name,
            String bloodGroup,
            String location,
            int score,
            String reason
    ){

        this.donorId = donorId;

        this.name = name;

        this.bloodGroup = bloodGroup;

        this.location = location;

        this.score = score;

        this.reason = reason;

    }









    public Long getDonorId(){

        return donorId;

    }



    public void setDonorId(
            Long donorId
    ){

        this.donorId = donorId;

    }









    public String getName(){

        return name;

    }



    public void setName(
            String name
    ){

        this.name = name;

    }









    public String getBloodGroup(){

        return bloodGroup;

    }



    public void setBloodGroup(
            String bloodGroup
    ){

        this.bloodGroup = bloodGroup;

    }









    public String getLocation(){

        return location;

    }



    public void setLocation(
            String location
    ){

        this.location = location;

    }









    public int getScore(){

        return score;

    }



    public void setScore(
            int score
    ){

        this.score = score;

    }









    public String getReason(){

        return reason;

    }



    public void setReason(
            String reason
    ){

        this.reason = reason;

    }



}