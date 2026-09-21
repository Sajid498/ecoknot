package backend.entity;


import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;



@Entity
public class Resource {



    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;





    private String content;





    private String imageUrl;





    private String category;





    private int likes = 0;





    private int shares = 0;





    private LocalDateTime createdAt;





    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;









    public Resource(){


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









    public String getImageUrl(){

        return imageUrl;

    }







    public void setImageUrl(String imageUrl){

        this.imageUrl = imageUrl;

    }









    public String getCategory(){

        return category;

    }







    public void setCategory(String category){

        this.category = category;

    }









    public int getLikes(){

        return likes;

    }







    public void setLikes(int likes){

        this.likes = likes;

    }









    public int getShares(){

        return shares;

    }







    public void setShares(int shares){

        this.shares = shares;

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