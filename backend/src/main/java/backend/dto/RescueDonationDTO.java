package backend.dto;


import java.time.LocalDateTime;

import backend.entity.RescueStatus;
import backend.entity.RescueType;



public class RescueDonationDTO {



    private Long id;


    private String title;


    private String description;


    private RescueType type;


    private Integer quantity;


    private String location;


    private Double latitude;


    private Double longitude;


    private LocalDateTime expiryTime;


    private RescueStatus status;


    private String userName;


    private Long userId;


    private LocalDateTime createdAt;







    public RescueDonationDTO(

            Long id,

            String title,

            String description,

            RescueType type,

            Integer quantity,

            String location,

            Double latitude,

            Double longitude,

            LocalDateTime expiryTime,

            RescueStatus status,

            String userName,

            Long userId,

            LocalDateTime createdAt

    ){


        this.id = id;

        this.title = title;

        this.description = description;

        this.type = type;

        this.quantity = quantity;

        this.location = location;

        this.latitude = latitude;

        this.longitude = longitude;

        this.expiryTime = expiryTime;

        this.status = status;

        this.userName = userName;

        this.userId = userId;

        this.createdAt = createdAt;


    }








    public Long getId(){

        return id;

    }




    public String getTitle(){

        return title;

    }




    public String getDescription(){

        return description;

    }




    public RescueType getType(){

        return type;

    }




    public Integer getQuantity(){

        return quantity;

    }




    public String getLocation(){

        return location;

    }




    public Double getLatitude(){

        return latitude;

    }




    public Double getLongitude(){

        return longitude;

    }




    public LocalDateTime getExpiryTime(){

        return expiryTime;

    }




    public RescueStatus getStatus(){

        return status;

    }




    public String getUserName(){

        return userName;

    }




    public Long getUserId(){

        return userId;

    }




    public LocalDateTime getCreatedAt(){

        return createdAt;

    }



}