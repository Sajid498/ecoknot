package backend.entity;


import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;



@Entity
@Table(name = "notifications")
public class Notification {



    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;



    private Long userId;



    private String message;



    private String type;



    private boolean readStatus = false;



    private LocalDateTime createdAt;






    public Notification(){

    }







    public Notification(
            Long userId,
            String message,
            String type
    ){

        this.userId = userId;

        this.message = message;

        this.type = type;

        this.createdAt = LocalDateTime.now();

    }







    public Long getId(){

        return id;

    }






    public Long getUserId(){

        return userId;

    }




    public void setUserId(Long userId){

        this.userId = userId;

    }






    public String getMessage(){

        return message;

    }





    public void setMessage(String message){

        this.message = message;

    }






    public String getType(){

        return type;

    }





    public void setType(String type){

        this.type = type;

    }






    public boolean isReadStatus(){

        return readStatus;

    }





    public void setReadStatus(boolean readStatus){

        this.readStatus = readStatus;

    }






    public LocalDateTime getCreatedAt(){

        return createdAt;

    }





    public void setCreatedAt(LocalDateTime createdAt){

        this.createdAt = createdAt;

    }



}