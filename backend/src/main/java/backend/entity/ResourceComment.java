package backend.entity;


import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;



@Entity
public class ResourceComment {



    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;



    private String content;



    private LocalDateTime createdAt;





    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;






    @ManyToOne
    @JoinColumn(name = "resource_id")
    private Resource resource;







    public ResourceComment(){


    }








    public Long getId(){

        return id;

    }







    public String getContent(){

        return content;

    }







    public void setContent(String content){

        this.content = content;

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







    public Resource getResource(){

        return resource;

    }







    public void setResource(Resource resource){

        this.resource = resource;

    }


}