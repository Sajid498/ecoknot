package backend.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import jakarta.persistence.*;

@Entity
@Table(name = "volunteer_assignments", uniqueConstraints = @UniqueConstraint(columnNames = {"campaign_id", "volunteer_id"}))
public class VolunteerAssignment {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(name = "campaign_id", nullable = false) private Long campaignId;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "volunteer_id", nullable = false) private User volunteer;
    @Column(nullable = false, length = 120) private String responsibility;
    @Column(length = 1500) private String scope;
    @Column(nullable = false, precision = 14, scale = 2) private BigDecimal approvedBudget = BigDecimal.ZERO;
    @Column(nullable = false, precision = 14, scale = 2) private BigDecimal spentBudget = BigDecimal.ZERO;
    @Enumerated(EnumType.STRING) @Column(nullable = false) private VolunteerAssignmentStatus status = VolunteerAssignmentStatus.PENDING;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "assigned_by", nullable = false) private User assignedBy;
    private LocalDateTime createdAt; private LocalDateTime updatedAt;
    @PrePersist void created(){ createdAt=LocalDateTime.now(); updatedAt=createdAt; }
    @PreUpdate void updated(){ updatedAt=LocalDateTime.now(); }
    public Long getId(){return id;} public Long getCampaignId(){return campaignId;} public void setCampaignId(Long v){campaignId=v;} public User getVolunteer(){return volunteer;} public void setVolunteer(User v){volunteer=v;} public String getResponsibility(){return responsibility;} public void setResponsibility(String v){responsibility=v;} public String getScope(){return scope;} public void setScope(String v){scope=v;} public BigDecimal getApprovedBudget(){return approvedBudget;} public void setApprovedBudget(BigDecimal v){approvedBudget=v;} public BigDecimal getSpentBudget(){return spentBudget;} public void setSpentBudget(BigDecimal v){spentBudget=v;} public VolunteerAssignmentStatus getStatus(){return status;} public void setStatus(VolunteerAssignmentStatus v){status=v;} public User getAssignedBy(){return assignedBy;} public void setAssignedBy(User v){assignedBy=v;} public LocalDateTime getCreatedAt(){return createdAt;} public LocalDateTime getUpdatedAt(){return updatedAt;}
}
