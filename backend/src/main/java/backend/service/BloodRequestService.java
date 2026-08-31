package backend.service;

import backend.entity.BloodGroup;
import backend.entity.BloodRequest;
import backend.entity.RequestStatus;
import backend.repository.BloodRequestRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BloodRequestService {

    private final BloodRequestRepository bloodRequestRepository;

    public BloodRequestService(BloodRequestRepository bloodRequestRepository) {
        this.bloodRequestRepository = bloodRequestRepository;
    }

    public BloodRequest createBloodRequest(BloodRequest bloodRequest) {
        return bloodRequestRepository.save(bloodRequest);
    }

    public List<BloodRequest> getAllBloodRequests() {
        return bloodRequestRepository.findAll();
    }

    public BloodRequest getBloodRequestById(Long id) {
        return bloodRequestRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Blood request not found with id: " + id));
    }

    public BloodRequest updateBloodRequest(Long id, BloodRequest updatedRequest) {

        BloodRequest existingRequest = getBloodRequestById(id);

        existingRequest.setPatientName(updatedRequest.getPatientName());
        existingRequest.setBloodGroup(updatedRequest.getBloodGroup());
        existingRequest.setHospital(updatedRequest.getHospital());
        existingRequest.setLocation(updatedRequest.getLocation());
        existingRequest.setContactNumber(updatedRequest.getContactNumber());
        existingRequest.setRequiredDate(updatedRequest.getRequiredDate());
        existingRequest.setUnitsNeeded(updatedRequest.getUnitsNeeded());
        existingRequest.setUrgency(updatedRequest.getUrgency());
        existingRequest.setDescription(updatedRequest.getDescription());
        existingRequest.setStatus(updatedRequest.getStatus());

        return bloodRequestRepository.save(existingRequest);
    }

    public void deleteBloodRequest(Long id) {
        BloodRequest existingRequest = getBloodRequestById(id);
        bloodRequestRepository.delete(existingRequest);
    }

    public List<BloodRequest> getByBloodGroup(BloodGroup bloodGroup) {
        return bloodRequestRepository.findByBloodGroup(bloodGroup);
    }

    public List<BloodRequest> getByStatus(RequestStatus status) {
        return bloodRequestRepository.findByStatus(status);
    }

    public List<BloodRequest> searchByLocation(String location) {
        return bloodRequestRepository
                .findByLocationContainingIgnoreCase(location);
    }
}