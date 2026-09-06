package backend.repository;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import backend.entity.ChatMessage;



public interface ChatMessageRepository 
        extends JpaRepository<ChatMessage, Long> {


    List<ChatMessage> findByRequestIdAndSenderIdAndReceiverIdOrRequestIdAndReceiverIdAndSenderId(
            Long requestId1,
            Long senderId,
            Long receiverId,

            Long requestId2,
            Long receiverId2,
            Long senderId2
    );



    List<ChatMessage> findByReceiverIdOrSenderId(
            Long receiverId,
            Long senderId
    );


}