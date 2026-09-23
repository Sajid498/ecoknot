package backend.entity;


import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;



@Entity
@Table(name = "time_requests")
public class TimeRequest {



    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;




    // User who created the request
    // Example: User A needs help

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "requester_id")
    private User requester;





    // User who accepts and provides help
    // Example: User B helps User A

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "helper_id")
    private User helper;






    private String title;



    @Column(length = 1000)
    private String description;



    private String category;



    private Integer requiredHours;



    /*
        OPEN      = waiting for volunteer
        ACCEPTED  = someone accepted
        COMPLETED = work finished
    */

    private String status;




    private LocalDateTime createdAt;







    // ==============================
    // Constructors
    // ==============================


    public TimeRequest(){

    }






    public TimeRequest(

            User requester,

            String title,

            String description,

            String category,

            Integer requiredHours

    ){


        this.requester = requester;

        this.title = title;

        this.description = description;

        this.category = category;

        this.requiredHours = requiredHours;

        this.status = "OPEN";

        this.createdAt = LocalDateTime.now();


    }









    // ==============================
    // Getters & Setters
    // ==============================


    public Long getId(){

        return id;

    }



    public void setId(Long id){

        this.id = id;

    }







    public User getRequester(){

        return requester;

    }



    public void setRequester(User requester){

        this.requester = requester;

    }







    public User getHelper(){

        return helper;

    }



    public void setHelper(User helper){

        this.helper = helper;

    }








    public String getTitle(){

        return title;

    }



    public void setTitle(String title){

        this.title = title;

    }








    public String getDescription(){

        return description;

    }



    public void setDescription(String description){

        this.description = description;

    }








    public String getCategory(){

        return category;

    }



    public void setCategory(String category){

        this.category = category;

    }








    public Integer getRequiredHours(){

        return requiredHours;

    }



    public void setRequiredHours(Integer requiredHours){

        this.requiredHours = requiredHours;

    }








    public String getStatus(){

        return status;

    }



    public void setStatus(String status){

        this.status = status;

    }








    public LocalDateTime getCreatedAt(){

        return createdAt;

    }



    public void setCreatedAt(LocalDateTime createdAt){

        this.createdAt = createdAt;

    }



}