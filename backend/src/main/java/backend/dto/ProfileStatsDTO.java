package backend.dto;



public class ProfileStatsDTO {



    private long reliefPosts;


    private long bloodRequests;


    private long completedPickups;






    public ProfileStatsDTO(

            long reliefPosts,

            long bloodRequests,

            long completedPickups

    ){


        this.reliefPosts = reliefPosts;

        this.bloodRequests = bloodRequests;

        this.completedPickups = completedPickups;


    }







    public long getReliefPosts(){

        return reliefPosts;

    }







    public long getBloodRequests(){

        return bloodRequests;

    }







    public long getCompletedPickups(){

        return completedPickups;

    }




}