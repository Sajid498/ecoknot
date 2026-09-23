package backend.dto;


public class DashboardStatsDTO {



    private long totalRelief;


    private long foodDonations;


    private long medicineDonations;


    private long completedDeliveries;


    private long totalUsers;



    // Volunteer Time Bank

    private long totalTimeOffers;


    private long totalTimeCredits;








    public DashboardStatsDTO(){


    }









    public DashboardStatsDTO(

            long totalRelief,

            long foodDonations,

            long medicineDonations,

            long completedDeliveries,

            long totalUsers,

            long totalTimeOffers,

            long totalTimeCredits

    ){


        this.totalRelief = totalRelief;


        this.foodDonations = foodDonations;


        this.medicineDonations = medicineDonations;


        this.completedDeliveries = completedDeliveries;


        this.totalUsers = totalUsers;


        this.totalTimeOffers = totalTimeOffers;


        this.totalTimeCredits = totalTimeCredits;


    }









    public long getTotalRelief(){

        return totalRelief;

    }








    public void setTotalRelief(long totalRelief){

        this.totalRelief = totalRelief;

    }









    public long getFoodDonations(){

        return foodDonations;

    }








    public void setFoodDonations(long foodDonations){

        this.foodDonations = foodDonations;

    }









    public long getMedicineDonations(){

        return medicineDonations;

    }








    public void setMedicineDonations(long medicineDonations){

        this.medicineDonations = medicineDonations;

    }









    public long getCompletedDeliveries(){

        return completedDeliveries;

    }








    public void setCompletedDeliveries(long completedDeliveries){

        this.completedDeliveries = completedDeliveries;

    }









    public long getTotalUsers(){

        return totalUsers;

    }








    public void setTotalUsers(long totalUsers){

        this.totalUsers = totalUsers;

    }









    public long getTotalTimeOffers(){

        return totalTimeOffers;

    }








    public void setTotalTimeOffers(long totalTimeOffers){

        this.totalTimeOffers = totalTimeOffers;

    }









    public long getTotalTimeCredits(){

        return totalTimeCredits;

    }








    public void setTotalTimeCredits(long totalTimeCredits){

        this.totalTimeCredits = totalTimeCredits;

    }



}