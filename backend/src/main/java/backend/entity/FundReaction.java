package backend.entity;

import java.time.LocalDateTime;
import jakarta.persistence.*;

@Entity @Table(name="fund_reactions", uniqueConstraints=@UniqueConstraint(columnNames={"campaign_id","user_id"}))
public class FundReaction {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="campaign_id",nullable=false) private FundCampaign campaign;
 @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="user_id",nullable=false) private User user; private LocalDateTime createdAt;
 @PrePersist void created(){createdAt=LocalDateTime.now();}
 public Long getId(){return id;} public FundCampaign getCampaign(){return campaign;} public void setCampaign(FundCampaign v){campaign=v;} public User getUser(){return user;} public void setUser(User v){user=v;} public LocalDateTime getCreatedAt(){return createdAt;}
}
