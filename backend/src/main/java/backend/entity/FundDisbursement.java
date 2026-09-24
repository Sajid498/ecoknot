package backend.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import jakarta.persistence.*;

@Entity
@Table(name = "fund_disbursements")
public class FundDisbursement {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "assignment_id", nullable = false) private VolunteerAssignment assignment;
    @Column(nullable = false, precision = 14, scale = 2) private BigDecimal amount;
    @Column(nullable = false, length = 180) private String purpose;
    @Column(nullable = false, length = 255) private String usedAt;
    @Column(nullable = false, length = 1500) private String justification;
    @Column(length = 500) private String receiptUrl;
    @Enumerated(EnumType.STRING) @Column(nullable = false) private DisbursementStatus status = DisbursementStatus.PENDING_REVIEW;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "reviewed_by") private User reviewedBy;
    private String reviewNote; private LocalDateTime submittedAt; private LocalDateTime reviewedAt;
    @PrePersist void submitted(){ submittedAt=LocalDateTime.now(); }
    public Long getId(){return id;} public VolunteerAssignment getAssignment(){return assignment;} public void setAssignment(VolunteerAssignment v){assignment=v;} public BigDecimal getAmount(){return amount;} public void setAmount(BigDecimal v){amount=v;} public String getPurpose(){return purpose;} public void setPurpose(String v){purpose=v;} public String getUsedAt(){return usedAt;} public void setUsedAt(String v){usedAt=v;} public String getJustification(){return justification;} public void setJustification(String v){justification=v;} public String getReceiptUrl(){return receiptUrl;} public void setReceiptUrl(String v){receiptUrl=v;} public DisbursementStatus getStatus(){return status;} public void setStatus(DisbursementStatus v){status=v;} public User getReviewedBy(){return reviewedBy;} public void setReviewedBy(User v){reviewedBy=v;} public String getReviewNote(){return reviewNote;} public void setReviewNote(String v){reviewNote=v;} public LocalDateTime getSubmittedAt(){return submittedAt;} public LocalDateTime getReviewedAt(){return reviewedAt;} public void setReviewedAt(LocalDateTime v){reviewedAt=v;}
}
