package backend.controller;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import org.springframework.web.bind.annotation.*;
import backend.entity.FundCampaign;
import backend.entity.FundStatus;
import backend.entity.PaymentStatus;
import backend.service.FundraisingService;

@RestController
@RequestMapping("/api/funds")
@CrossOrigin("*")
public class FundraisingController {
 private final FundraisingService service;
 public FundraisingController(FundraisingService service){this.service=service;}
 @PostMapping("/user/{userId}") public Map<String,Object> create(@PathVariable Long userId,@RequestBody FundCampaign campaign){return service.create(userId,campaign);}
 @GetMapping public List<Map<String,Object>> approved(){return service.approved();}
 @GetMapping("/{campaignId}") public Map<String,Object> details(@PathVariable Long campaignId){return service.details(campaignId);}
 @GetMapping("/user/{userId}") public List<Map<String,Object>> mine(@PathVariable Long userId){return service.mine(userId);}
 @GetMapping("/admin/{adminId}/pending") public List<Map<String,Object>> pending(@PathVariable Long adminId){return service.pending(adminId);}
 @PutMapping("/{campaignId}/review/admin/{adminId}") public Map<String,Object> review(@PathVariable Long campaignId,@PathVariable Long adminId,@RequestBody Map<String,String> body){return service.review(campaignId,adminId,FundStatus.valueOf(body.get("status")),body.get("note"));}
 @PutMapping("/{campaignId}/close/user/{userId}") public Map<String,Object> close(@PathVariable Long campaignId,@PathVariable Long userId){return service.close(campaignId,userId);}
 @PostMapping("/{campaignId}/reactions/user/{userId}") public Map<String,Object> reaction(@PathVariable Long campaignId,@PathVariable Long userId){return service.toggleReaction(campaignId,userId);}
 @PostMapping("/{campaignId}/comments/user/{userId}") public Map<String,Object> comment(@PathVariable Long campaignId,@PathVariable Long userId,@RequestBody Map<String,Object> body){Long replyToId=body.get("replyToId")==null?null:Long.valueOf(body.get("replyToId").toString());return service.comment(campaignId,userId,(String)body.get("body"),replyToId);}
 @PostMapping("/{campaignId}/contributions/user/{userId}") public Map<String,Object> contribute(@PathVariable Long campaignId,@PathVariable Long userId,@RequestBody Map<String,String> body){return service.createContribution(campaignId,userId,new BigDecimal(body.get("amount")),body.get("paymentMethod"),body.get("paymentReference"));}
 @PutMapping("/contributions/{contributionId}/verify/admin/{adminId}") public Map<String,Object> verify(@PathVariable Long contributionId,@PathVariable Long adminId,@RequestBody Map<String,String> body){return service.verifyContribution(contributionId,adminId,PaymentStatus.valueOf(body.get("status")));}
 @GetMapping("/contributions/{contributionId}/receipt/user/{userId}") public Map<String,Object> receipt(@PathVariable Long contributionId,@PathVariable Long userId){return service.receipt(contributionId,userId);}
 @GetMapping("/admin/{adminId}/contributions") public List<Map<String,Object>> monitoring(@PathVariable Long adminId){return service.monitoring(adminId);}
}
