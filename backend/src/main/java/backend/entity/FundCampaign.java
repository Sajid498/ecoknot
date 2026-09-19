package backend.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import jakarta.persistence.*;

@Entity
@Table(name = "fund_campaigns")
public class FundCampaign {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(nullable=false, length=160) private String title;
    @Enumerated(EnumType.STRING) @Column(nullable=false) private FundCategory category;
    @Column(nullable=false, length=4000) private String description;
    @Column(nullable=false) private String beneficiary;
    @Column(nullable=false) private String location;
    @Column(nullable=false) private String contactNumber;
    @Column(nullable=false, precision=14, scale=2) private BigDecimal goalAmount;
    @Column(nullable=false, precision=14, scale=2) private BigDecimal raisedAmount = BigDecimal.ZERO;
    @Enumerated(EnumType.STRING) @Column(nullable=false) private FundStatus status = FundStatus.PENDING_REVIEW;
    @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="author_id", nullable=false) private User author;
    @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="reviewed_by") private User reviewedBy;
    private String reviewNote; private LocalDateTime createdAt; private LocalDateTime updatedAt; private LocalDateTime reviewedAt;
    @PrePersist void created(){createdAt=LocalDateTime.now();updatedAt=createdAt;if(raisedAmount==null)raisedAmount=BigDecimal.ZERO;if(status==null)status=FundStatus.PENDING_REVIEW;}
    @PreUpdate void updated(){updatedAt=LocalDateTime.now();}
    public Long getId(){return id;} public String getTitle(){return title;} public void setTitle(String v){title=v;} public FundCategory getCategory(){return category;} public void setCategory(FundCategory v){category=v;} public String getDescription(){return description;} public void setDescription(String v){description=v;} public String getBeneficiary(){return beneficiary;} public void setBeneficiary(String v){beneficiary=v;} public String getLocation(){return location;} public void setLocation(String v){location=v;} public String getContactNumber(){return contactNumber;} public void setContactNumber(String v){contactNumber=v;} public BigDecimal getGoalAmount(){return goalAmount;} public void setGoalAmount(BigDecimal v){goalAmount=v;} public BigDecimal getRaisedAmount(){return raisedAmount;} public void setRaisedAmount(BigDecimal v){raisedAmount=v;} public FundStatus getStatus(){return status;} public void setStatus(FundStatus v){status=v;} public User getAuthor(){return author;} public void setAuthor(User v){author=v;} public User getReviewedBy(){return reviewedBy;} public void setReviewedBy(User v){reviewedBy=v;} public String getReviewNote(){return reviewNote;} public void setReviewNote(String v){reviewNote=v;} public LocalDateTime getCreatedAt(){return createdAt;} public LocalDateTime getUpdatedAt(){return updatedAt;} public LocalDateTime getReviewedAt(){return reviewedAt;} public void setReviewedAt(LocalDateTime v){reviewedAt=v;}
}
