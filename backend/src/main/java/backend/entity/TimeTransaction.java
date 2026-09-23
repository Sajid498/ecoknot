package backend.entity;


import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;



@Entity
@Table(name = "time_transactions")
public class TimeTransaction {



    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;





    // Person who provided help and earned credits
    @ManyToOne
    @JoinColumn(name = "provider_id")
    private User provider;





    // Person who requested help and used credits
    @ManyToOne
    @JoinColumn(name = "requester_id")
    private User requester;





    private Integer hours;





    private String description;





    private String transactionType;





    private LocalDateTime createdAt;






    public TimeTransaction(){


    }









    public TimeTransaction(

            User provider,

            User requester,

            Integer hours,

            String description,

            String transactionType

    ){


        this.provider = provider;

        this.requester = requester;

        this.hours = hours;

        this.description = description;

        this.transactionType = transactionType;

        this.createdAt = LocalDateTime.now();


    }









    public Long getId(){


        return id;


    }









    public User getProvider(){


        return provider;


    }






    public void setProvider(User provider){


        this.provider = provider;


    }









    public User getRequester(){


        return requester;


    }






    public void setRequester(User requester){


        this.requester = requester;


    }









    public Integer getHours(){


        return hours;


    }






    public void setHours(Integer hours){


        this.hours = hours;


    }









    public String getDescription(){


        return description;


    }






    public void setDescription(String description){


        this.description = description;


    }









    public String getTransactionType(){


        return transactionType;


    }






    public void setTransactionType(String transactionType){


        this.transactionType = transactionType;


    }









    public LocalDateTime getCreatedAt(){


        return createdAt;


    }






    public void setCreatedAt(LocalDateTime createdAt){


        this.createdAt = createdAt;


    }



}