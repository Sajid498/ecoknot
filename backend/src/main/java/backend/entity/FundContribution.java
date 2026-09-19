package backend.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import jakarta.persistence.*;

@Entity @Table(name="fund_contributions", uniqueConstraints=@UniqueConstraint(columnNames="paymentReference"))
public class FundContribution {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="campaign_id",nullable=false) private FundCampaign campaign;
 @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="donor_id",nullable=false) private User donor;
 @Column(nullable=false,precision=14,scale=2) private BigDecimal amount; @Column(nullable=false) private String paymentMethod; @Column(nullable=false) private String paymentReference;
 @Enumerated(EnumType.STRING) @Column(nullable=false) private PaymentStatus paymentStatus=PaymentStatus.PENDING; private LocalDateTime createdAt; private LocalDateTime verifiedAt;
 @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="verified_by") private User verifiedBy;
 @PrePersist void created(){createdAt=LocalDateTime.now();if(paymentStatus==null)paymentStatus=PaymentStatus.PENDING;}
 public Long getId(){return id;} public FundCampaign getCampaign(){return campaign;} public void setCampaign(FundCampaign v){campaign=v;} public User getDonor(){return donor;} public void setDonor(User v){donor=v;} public BigDecimal getAmount(){return amount;} public void setAmount(BigDecimal v){amount=v;} public String getPaymentMethod(){return paymentMethod;} public void setPaymentMethod(String v){paymentMethod=v;} public String getPaymentReference(){return paymentReference;} public void setPaymentReference(String v){paymentReference=v;} public PaymentStatus getPaymentStatus(){return paymentStatus;} public void setPaymentStatus(PaymentStatus v){paymentStatus=v;} public LocalDateTime getCreatedAt(){return createdAt;} public LocalDateTime getVerifiedAt(){return verifiedAt;} public void setVerifiedAt(LocalDateTime v){verifiedAt=v;} public User getVerifiedBy(){return verifiedBy;} public void setVerifiedBy(User v){verifiedBy=v;}
}
