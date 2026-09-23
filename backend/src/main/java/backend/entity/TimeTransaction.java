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
@Table(name = "time_transactions")
public class TimeTransaction {





    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;







    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;







    // Positive = Earn
    // Negative = Spend

    private Integer amount;







    @Enumerated(EnumType.STRING)
    private TransactionType type;







    private String description;







    private LocalDateTime createdAt;









    public TimeTransaction(){


    }









    public TimeTransaction(

            User user,

            Integer amount,

            TransactionType type,

            String description

    ){


        this.user = user;

        this.amount = amount;

        this.type = type;

        this.description = description;

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









    public Integer getAmount(){


        return amount;


    }









    public void setAmount(Integer amount){


        this.amount = amount;


    }









    public TransactionType getType(){


        return type;


    }









    public void setType(TransactionType type){


        this.type = type;


    }









    public String getDescription(){


        return description;


    }









    public void setDescription(String description){


        this.description = description;


    }









    public LocalDateTime getCreatedAt(){


        return createdAt;


    }









    public void setCreatedAt(LocalDateTime createdAt){


        this.createdAt = createdAt;


    }




}