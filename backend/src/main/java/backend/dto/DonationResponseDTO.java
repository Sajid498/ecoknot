package backend.dto;


public class DonationResponseDTO {


    private Long id;

    private Long requestId;

    private Long donorId;

    private String status;

    private Long requestOwnerId;

    private String requestOwnerName;



    public DonationResponseDTO(
            Long id,
            Long requestId,
            Long donorId,
            String status,
            Long requestOwnerId,
            String requestOwnerName
    ){

        this.id = id;
        this.requestId = requestId;
        this.donorId = donorId;
        this.status = status;
        this.requestOwnerId = requestOwnerId;
        this.requestOwnerName = requestOwnerName;

    }




    public Long getId() {
        return id;
    }


    public Long getRequestId() {
        return requestId;
    }


    public Long getDonorId() {
        return donorId;
    }


    public String getStatus() {
        return status;
    }


    public Long getRequestOwnerId() {
        return requestOwnerId;
    }


    public String getRequestOwnerName() {
        return requestOwnerName;
    }

}