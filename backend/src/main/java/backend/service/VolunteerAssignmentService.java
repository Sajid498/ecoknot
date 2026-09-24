package backend.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import backend.entity.*;
import backend.exception.ResourceNotFoundException;
import backend.repository.*;

@Service
@Transactional
public class VolunteerAssignmentService {
    private final VolunteerAssignmentRepository assignments;
    private final FundDisbursementRepository disbursements;
    private final UserRepository users;
    public VolunteerAssignmentService(VolunteerAssignmentRepository assignments, FundDisbursementRepository disbursements, UserRepository users){this.assignments=assignments;this.disbursements=disbursements;this.users=users;}
    private User user(Long id){return users.findById(id).orElseThrow(()->new ResourceNotFoundException("User not found"));}
    private VolunteerAssignment assignment(Long id){return assignments.findById(id).orElseThrow(()->new ResourceNotFoundException("Volunteer assignment not found"));}
    private void admin(Long id){if(!"ADMIN".equalsIgnoreCase(user(id).getRole()))throw new RuntimeException("Administrator access required");}

    public Map<String,Object> assign(Long adminId, VolunteerAssignment input){
        admin(adminId); if(input.getCampaignId()==null || input.getVolunteer()==null || input.getVolunteer().getId()==null) throw new RuntimeException("Campaign and volunteer are required");
        if(input.getApprovedBudget()==null || input.getApprovedBudget().signum()<0) throw new RuntimeException("Approved budget cannot be negative");
        VolunteerAssignment item=new VolunteerAssignment(); item.setCampaignId(input.getCampaignId()); item.setVolunteer(user(input.getVolunteer().getId())); item.setAssignedBy(user(adminId)); item.setResponsibility(input.getResponsibility()); item.setScope(input.getScope()); item.setApprovedBudget(input.getApprovedBudget()); item.setSpentBudget(BigDecimal.ZERO); item.setStatus(VolunteerAssignmentStatus.ACTIVE);
        return assignmentView(assignments.save(item));
    }
    @Transactional(readOnly=true) public List<Map<String,Object>> campaignAssignments(Long campaignId){return assignments.findByCampaignIdOrderByCreatedAtDesc(campaignId).stream().map(this::assignmentView).toList();}
    @Transactional(readOnly=true) public List<Map<String,Object>> myAssignments(Long volunteerId){return assignments.findByVolunteerIdOrderByCreatedAtDesc(volunteerId).stream().map(this::assignmentView).toList();}
    public Map<String,Object> setStatus(Long assignmentId, Long adminId, VolunteerAssignmentStatus status){admin(adminId);VolunteerAssignment item=assignment(assignmentId);item.setStatus(status);return assignmentView(assignments.save(item));}

    public Map<String,Object> submitExpense(Long assignmentId, Long volunteerId, FundDisbursement input){
        VolunteerAssignment item=assignment(assignmentId); if(!item.getVolunteer().getId().equals(volunteerId))throw new RuntimeException("Only the assigned volunteer can submit this expense"); if(item.getStatus()!=VolunteerAssignmentStatus.ACTIVE)throw new RuntimeException("This assignment is not active");
        if(input.getAmount()==null||input.getAmount().signum()<=0)throw new RuntimeException("A positive amount is required"); if(input.getPurpose()==null||input.getPurpose().isBlank()||input.getUsedAt()==null||input.getUsedAt().isBlank()||input.getJustification()==null||input.getJustification().isBlank())throw new RuntimeException("Purpose, location, and justification are required");
        BigDecimal pending=disbursements.findByAssignmentCampaignIdOrderBySubmittedAtDesc(item.getCampaignId()).stream().filter(d->d.getAssignment().getId().equals(item.getId())).filter(d->d.getStatus()==DisbursementStatus.PENDING_REVIEW||d.getStatus()==DisbursementStatus.APPROVED).map(FundDisbursement::getAmount).reduce(BigDecimal.ZERO,BigDecimal::add);
        if(item.getSpentBudget().add(pending).add(input.getAmount()).compareTo(item.getApprovedBudget())>0)throw new RuntimeException("Expense exceeds the approved assignment budget");
        FundDisbursement entry=new FundDisbursement();entry.setAssignment(item);entry.setAmount(input.getAmount());entry.setPurpose(input.getPurpose().trim());entry.setUsedAt(input.getUsedAt().trim());entry.setJustification(input.getJustification().trim());entry.setReceiptUrl(input.getReceiptUrl());entry.setStatus(DisbursementStatus.PENDING_REVIEW);return disbursementView(disbursements.save(entry));
    }
    public Map<String,Object> reviewExpense(Long expenseId, Long adminId, DisbursementStatus status, String note){
        admin(adminId);if(status!=DisbursementStatus.APPROVED&&status!=DisbursementStatus.REJECTED&&status!=DisbursementStatus.PAID)throw new RuntimeException("Invalid expense review status");FundDisbursement entry=disbursements.findById(expenseId).orElseThrow(()->new ResourceNotFoundException("Expense record not found")); if(entry.getStatus()!=DisbursementStatus.PENDING_REVIEW&&entry.getStatus()!=DisbursementStatus.APPROVED)throw new RuntimeException("Expense has already been finalized");
        if(status==DisbursementStatus.PAID && entry.getStatus()!=DisbursementStatus.APPROVED)throw new RuntimeException("An expense must be approved before it can be marked paid");entry.setStatus(status);entry.setReviewNote(note);entry.setReviewedBy(user(adminId));entry.setReviewedAt(LocalDateTime.now());if(status==DisbursementStatus.PAID){VolunteerAssignment item=entry.getAssignment();item.setSpentBudget(item.getSpentBudget().add(entry.getAmount()));assignments.save(item);}return disbursementView(disbursements.save(entry));
    }
    @Transactional(readOnly=true) public List<Map<String,Object>> ledger(Long campaignId){return disbursements.findByAssignmentCampaignIdOrderBySubmittedAtDesc(campaignId).stream().map(this::disbursementView).toList();}
    @Transactional(readOnly=true) public List<Map<String,Object>> pendingExpenses(Long adminId){admin(adminId);return disbursements.findByStatusOrderBySubmittedAtAsc(DisbursementStatus.PENDING_REVIEW).stream().map(this::disbursementView).toList();}
    private Map<String,Object> assignmentView(VolunteerAssignment a){Map<String,Object>m=new LinkedHashMap<>();m.put("id",a.getId());m.put("campaignId",a.getCampaignId());m.put("volunteerId",a.getVolunteer().getId());m.put("volunteerName",a.getVolunteer().getName());m.put("responsibility",a.getResponsibility());m.put("scope",a.getScope());m.put("approvedBudget",a.getApprovedBudget());m.put("spentBudget",a.getSpentBudget());m.put("remainingBudget",a.getApprovedBudget().subtract(a.getSpentBudget()));m.put("status",a.getStatus());m.put("assignedBy",a.getAssignedBy().getName());m.put("createdAt",a.getCreatedAt());return m;}
    private Map<String,Object> disbursementView(FundDisbursement d){Map<String,Object>m=new LinkedHashMap<>();m.put("id",d.getId());m.put("assignmentId",d.getAssignment().getId());m.put("campaignId",d.getAssignment().getCampaignId());m.put("volunteerName",d.getAssignment().getVolunteer().getName());m.put("amount",d.getAmount());m.put("purpose",d.getPurpose());m.put("usedAt",d.getUsedAt());m.put("justification",d.getJustification());m.put("receiptUrl",d.getReceiptUrl());m.put("status",d.getStatus());m.put("reviewNote",d.getReviewNote());m.put("submittedAt",d.getSubmittedAt());return m;}
}
