package backend.entity;


import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;



@Entity
@Table(name = "chat_messages")
public class ChatMessage {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;



    private Long senderId;


    private Long receiverId;


    private Long requestId;



    @Column(length = 1000)
    private String message;



    private LocalDateTime timestamp;



    public ChatMessage() {

    }



    public ChatMessage(
            Long senderId,
            Long receiverId,
            Long requestId,
            String message
    ){

        this.senderId = senderId;
        this.receiverId = receiverId;
        this.requestId = requestId;
        this.message = message;
        this.timestamp = LocalDateTime.now();

    }




    public Long getId() {
        return id;
    }



    public Long getSenderId() {
        return senderId;
    }



    public void setSenderId(Long senderId) {
        this.senderId = senderId;
    }



    public Long getReceiverId() {
        return receiverId;
    }



    public void setReceiverId(Long receiverId) {
        this.receiverId = receiverId;
    }



    public Long getRequestId() {
        return requestId;
    }



    public void setRequestId(Long requestId) {
        this.requestId = requestId;
    }



    public String getMessage() {
        return message;
    }



    public void setMessage(String message) {
        this.message = message;
    }



    public LocalDateTime getTimestamp() {
        return timestamp;
    }



    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

}