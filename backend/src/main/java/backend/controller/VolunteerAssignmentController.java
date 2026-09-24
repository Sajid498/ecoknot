package backend.controller;

import java.util.List;
import java.util.Map;
import org.springframework.web.bind.annotation.*;
import backend.entity.*;
import backend.service.VolunteerAssignmentService;

@RestController
@RequestMapping("/api/volunteer-assignments")
@CrossOrigin("*")
public class VolunteerAssignmentController {
    private final VolunteerAssignmentService service;
    public VolunteerAssignmentController(VolunteerAssignmentService service){this.service=service;}
    @PostMapping("/admin/{adminId}") public Map<String,Object> assign(@PathVariable Long adminId,@RequestBody VolunteerAssignment body){return service.assign(adminId,body);}
    @GetMapping("/campaign/{campaignId}") public List<Map<String,Object>> campaign(@PathVariable Long campaignId){return service.campaignAssignments(campaignId);}
    @GetMapping("/volunteer/{volunteerId}") public List<Map<String,Object>> mine(@PathVariable Long volunteerId){return service.myAssignments(volunteerId);}
    @PutMapping("/{assignmentId}/status/admin/{adminId}") public Map<String,Object> status(@PathVariable Long assignmentId,@PathVariable Long adminId,@RequestBody Map<String,String>body){return service.setStatus(assignmentId,adminId,VolunteerAssignmentStatus.valueOf(body.get("status")));}
    @PostMapping("/{assignmentId}/expenses/volunteer/{volunteerId}") public Map<String,Object> submit(@PathVariable Long assignmentId,@PathVariable Long volunteerId,@RequestBody FundDisbursement body){return service.submitExpense(assignmentId,volunteerId,body);}
    @PutMapping("/expenses/{expenseId}/review/admin/{adminId}") public Map<String,Object> review(@PathVariable Long expenseId,@PathVariable Long adminId,@RequestBody Map<String,String>body){return service.reviewExpense(expenseId,adminId,DisbursementStatus.valueOf(body.get("status")),body.get("note"));}
    @GetMapping("/campaign/{campaignId}/ledger") public List<Map<String,Object>> ledger(@PathVariable Long campaignId){return service.ledger(campaignId);}
    @GetMapping("/expenses/admin/{adminId}/pending") public List<Map<String,Object>> pending(@PathVariable Long adminId){return service.pendingExpenses(adminId);}
}
