package backend.controller;

import backend.entity.BloodGroup;
import backend.entity.BloodRequest;
import backend.entity.RequestStatus;
import backend.service.BloodRequestService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/blood-requests")
@CrossOrigin(origins = "http://localhost:3000")
public class BloodRequestController {

    private final BloodRequestService bloodRequestService;

    public BloodRequestController(BloodRequestService bloodRequestService) {
        this.bloodRequestService = bloodRequestService;
    }

    @PostMapping
    public BloodRequest createBloodRequest(
            @RequestBody BloodRequest bloodRequest) {
        return bloodRequestService.createBloodRequest(bloodRequest);
    }

    @GetMapping
    public List<BloodRequest> getAllBloodRequests() {
        return bloodRequestService.getAllBloodRequests();
    }

    @GetMapping("/{id}")
    public BloodRequest getBloodRequestById(
            @PathVariable Long id) {
        return bloodRequestService.getBloodRequestById(id);
    }

    @PutMapping("/{id}")
    public BloodRequest updateBloodRequest(
            @PathVariable Long id,
            @RequestBody BloodRequest bloodRequest) {

        return bloodRequestService.updateBloodRequest(id, bloodRequest);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBloodRequest(
            @PathVariable Long id) {

        bloodRequestService.deleteBloodRequest(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/blood-group/{bloodGroup}")
    public List<BloodRequest> getByBloodGroup(
            @PathVariable BloodGroup bloodGroup) {

        return bloodRequestService.getByBloodGroup(bloodGroup);
    }

    @GetMapping("/status/{status}")
    public List<BloodRequest> getByStatus(
            @PathVariable RequestStatus status) {

        return bloodRequestService.getByStatus(status);
    }

    @GetMapping("/search")
    public List<BloodRequest> searchByLocation(
            @RequestParam String location) {

        return bloodRequestService.searchByLocation(location);
    }
}
