package backend.entity;

import java.time.LocalDateTime;
import jakarta.persistence.*;

@Entity @Table(name="fund_comments")
public class FundComment {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="campaign_id",nullable=false) private FundCampaign campaign;
 @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="author_id",nullable=false) private User author;
 @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="reply_to_id") private FundComment replyTo;
 @Column(nullable=false,length=1500) private String body; private LocalDateTime createdAt;
 @PrePersist void created(){createdAt=LocalDateTime.now();}
 public Long getId(){return id;} public FundCampaign getCampaign(){return campaign;} public void setCampaign(FundCampaign v){campaign=v;} public User getAuthor(){return author;} public void setAuthor(User v){author=v;} public FundComment getReplyTo(){return replyTo;} public void setReplyTo(FundComment v){replyTo=v;} public String getBody(){return body;} public void setBody(String v){body=v;} public LocalDateTime getCreatedAt(){return createdAt;}
}
