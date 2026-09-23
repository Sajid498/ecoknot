package backend.entity;


import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;



@Entity
@Table(name = "notifications")
public class Notification {





    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;







    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;







    private String message;







    private String type;







    private boolean readStatus = false;







    private LocalDateTime createdAt;







    private LocalDateTime readAt;












    public Notification(){


    }









    // New constructor (User relationship)

    public Notification(

            User user,

            String message,

            String type

    ){


        this.user = user;

        this.message = message;

        this.type = type;

        this.createdAt = LocalDateTime.now();

        this.readStatus = false;


    }









    // Backward compatible constructor
    // Used by existing services

    public Notification(

            Long userId,

            String message,

            String type

    ){


        this.message = message;

        this.type = type;

        this.createdAt = LocalDateTime.now();

        this.readStatus = false;


    }









    public Long getId(){


        return id;


    }









    public User getUser(){


        return user;


    }









    public void setUser(User user){


        this.user = user;


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









    public LocalDateTime getReadAt(){


        return readAt;


    }









    public void setReadAt(LocalDateTime readAt){


        this.readAt = readAt;


    }




}