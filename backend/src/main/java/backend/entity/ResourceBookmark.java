package backend.entity;


import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;



@Entity
public class ResourceBookmark {



    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;



    @ManyToOne
    @JoinColumn(name="user_id")
    private User user;



    @ManyToOne
    @JoinColumn(name="resource_id")
    private Resource resource;



    private LocalDateTime createdAt;



    public ResourceBookmark(){

    }






    public Long getId(){

        return id;

    }





    public User getUser(){

        return user;

    }





    public void setUser(User user){

        this.user=user;

    }






    public Resource getResource(){

        return resource;

    }





    public void setResource(Resource resource){

        this.resource=resource;

    }






    public LocalDateTime getCreatedAt(){

        return createdAt;

    }





    public void setCreatedAt(LocalDateTime createdAt){

        this.createdAt=createdAt;

    }


}