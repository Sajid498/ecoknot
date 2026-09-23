package backend.entity;


import java.time.LocalDateTime;


import com.fasterxml.jackson.annotation.JsonIgnore;


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
@Table(name = "time_offers")
public class TimeOffer {




    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;





    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;





    private String title;





    private String description;





    private String skillCategory;





    private Integer availableHours;





    @Enumerated(EnumType.STRING)
    private TimeOfferStatus status = TimeOfferStatus.AVAILABLE;





    private LocalDateTime createdAt;








    public TimeOffer(){


    }









    public TimeOffer(

            User user,

            String title,

            String description,

            String skillCategory,

            Integer availableHours

    ){


        this.user = user;

        this.title = title;

        this.description = description;

        this.skillCategory = skillCategory;

        this.availableHours = availableHours;

        this.status = TimeOfferStatus.AVAILABLE;

        this.createdAt = LocalDateTime.now();


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








    public String getSkillCategory(){

        return skillCategory;

    }








    public void setSkillCategory(String skillCategory){

        this.skillCategory = skillCategory;

    }








    public Integer getAvailableHours(){

        return availableHours;

    }








    public void setAvailableHours(Integer availableHours){

        this.availableHours = availableHours;

    }








    public TimeOfferStatus getStatus(){

        return status;

    }








    public void setStatus(TimeOfferStatus status){

        this.status = status;

    }








    public LocalDateTime getCreatedAt(){

        return createdAt;

    }








    public void setCreatedAt(LocalDateTime createdAt){

        this.createdAt = createdAt;

    }



}