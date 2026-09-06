package backend.dto;


import java.time.LocalDateTime;


public class ChatMessageDTO {


    private Long id;

    private Long senderId;

    private Long receiverId;

    private Long requestId;

    private String message;

    private LocalDateTime timestamp;



    public ChatMessageDTO(
            Long id,
            Long senderId,
            Long receiverId,
            Long requestId,
            String message,
            LocalDateTime timestamp
    ){

        this.id = id;
        this.senderId = senderId;
        this.receiverId = receiverId;
        this.requestId = requestId;
        this.message = message;
        this.timestamp = timestamp;

    }




    public Long getId(){
        return id;
    }


    public Long getSenderId(){
        return senderId;
    }


    public Long getReceiverId(){
        return receiverId;
    }


    public Long getRequestId(){
        return requestId;
    }


    public String getMessage(){
        return message;
    }


    public LocalDateTime getTimestamp(){
        return timestamp;
    }

}