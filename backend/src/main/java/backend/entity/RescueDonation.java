package backend.entity;


import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;



@Entity
@Table(name = "rescue_donations")
public class RescueDonation {



    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;





    private String title;





    private String description;





    @Enumerated(EnumType.STRING)
    private RescueType type;





    private Integer quantity;





    private String location;





    private Double latitude;





    private Double longitude;





    private LocalDateTime expiryTime;





    @Enumerated(EnumType.STRING)
    private RescueStatus status = RescueStatus.AVAILABLE;





    private LocalDateTime createdAt;








    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;









    public RescueDonation(){


    }









    public Long getId(){

        return id;

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








    public RescueType getType(){

        return type;

    }








    public void setType(RescueType type){

        this.type = type;

    }








    public Integer getQuantity(){

        return quantity;

    }








    public void setQuantity(Integer quantity){

        this.quantity = quantity;

    }








    public String getLocation(){

        return location;

    }








    public void setLocation(String location){

        this.location = location;

    }








    public Double getLatitude(){

        return latitude;

    }








    public void setLatitude(Double latitude){

        this.latitude = latitude;

    }








    public Double getLongitude(){

        return longitude;

    }








    public void setLongitude(Double longitude){

        this.longitude = longitude;

    }








    public LocalDateTime getExpiryTime(){

        return expiryTime;

    }








    public void setExpiryTime(LocalDateTime expiryTime){

        this.expiryTime = expiryTime;

    }








    public RescueStatus getStatus(){

        return status;

    }








    public void setStatus(RescueStatus status){

        this.status = status;

    }








    public LocalDateTime getCreatedAt(){

        return createdAt;

    }








    public void setCreatedAt(LocalDateTime createdAt){

        this.createdAt = createdAt;

    }








    public User getUser(){

        return user;

    }








    public void setUser(User user){

        this.user = user;

    }



}