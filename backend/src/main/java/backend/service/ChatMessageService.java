package backend.service;


import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import backend.entity.ChatMessage;
import backend.repository.ChatMessageRepository;



@Service
public class ChatMessageService {



    private final ChatMessageRepository chatMessageRepository;



    public ChatMessageService(
            ChatMessageRepository chatMessageRepository
    ){

        this.chatMessageRepository = chatMessageRepository;

    }




    public ChatMessage sendMessage(
            ChatMessage message
    ){

        message.setTimestamp(
                LocalDateTime.now()
        );


        return chatMessageRepository.save(message);

    }






public List<ChatMessage> getConversation(
        Long senderId,
        Long receiverId,
        Long requestId
){

    return chatMessageRepository
            .findByRequestIdAndSenderIdAndReceiverIdOrRequestIdAndReceiverIdAndSenderId(
                    requestId,
                    senderId,
                    receiverId,
                    requestId,
                    receiverId,
                    senderId
            );

}
public List<ChatMessage> getInbox(Long userId){

    return chatMessageRepository
            .findByReceiverId(userId);

}

}