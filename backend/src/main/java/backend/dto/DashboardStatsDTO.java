package backend.dto;



public class DashboardStatsDTO {



    private long totalRelief;


    private long foodDonations;


    private long medicineDonations;


    private long completedDeliveries;


    private long totalUsers;








    public DashboardStatsDTO(

            long totalRelief,

            long foodDonations,

            long medicineDonations,

            long completedDeliveries,

            long totalUsers

    ){


        this.totalRelief = totalRelief;

        this.foodDonations = foodDonations;

        this.medicineDonations = medicineDonations;

        this.completedDeliveries = completedDeliveries;

        this.totalUsers = totalUsers;


    }







    public long getTotalRelief(){

        return totalRelief;

    }





    public long getFoodDonations(){

        return foodDonations;

    }





    public long getMedicineDonations(){

        return medicineDonations;

    }





    public long getCompletedDeliveries(){

        return completedDeliveries;

    }





    public long getTotalUsers(){

        return totalUsers;

    }



}