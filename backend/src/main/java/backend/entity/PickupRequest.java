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
@Table(name="pickup_requests")
public class PickupRequest {



    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;





    @ManyToOne
    @JoinColumn(name="rescue_id")
    private RescueDonation rescueDonation;







    @ManyToOne
    @JoinColumn(name="volunteer_id")
    private User volunteer;







    @Enumerated(EnumType.STRING)
    private PickupStatus status = PickupStatus.PENDING;







    private LocalDateTime requestedAt;





    private LocalDateTime approvedAt;





    private LocalDateTime completedAt;









    public PickupRequest(){



    }








    public Long getId(){


        return id;


    }








    public RescueDonation getRescueDonation(){


        return rescueDonation;


    }







    public void setRescueDonation(RescueDonation rescueDonation){


        this.rescueDonation = rescueDonation;


    }








    public User getVolunteer(){


        return volunteer;


    }







    public void setVolunteer(User volunteer){


        this.volunteer = volunteer;


    }








    public PickupStatus getStatus(){


        return status;


    }







    public void setStatus(PickupStatus status){


        this.status = status;


    }








    public LocalDateTime getRequestedAt(){


        return requestedAt;


    }







    public void setRequestedAt(LocalDateTime requestedAt){


        this.requestedAt = requestedAt;


    }








    public LocalDateTime getApprovedAt(){


        return approvedAt;


    }







    public void setApprovedAt(LocalDateTime approvedAt){


        this.approvedAt = approvedAt;


    }








    public LocalDateTime getCompletedAt(){


        return completedAt;


    }







    public void setCompletedAt(LocalDateTime completedAt){


        this.completedAt = completedAt;


    }



}