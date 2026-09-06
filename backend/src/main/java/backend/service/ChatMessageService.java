package backend.service;


import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import backend.dto.ChatMessageDTO;
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





    // Send message

    public ChatMessage sendMessage(
            ChatMessage message
    ){

        message.setTimestamp(
                LocalDateTime.now()
        );


        return chatMessageRepository.save(message);

    }







    // Get conversation between two users

   public List<ChatMessageDTO> getConversation(
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
            )
            .stream()
            .map(message ->

                new ChatMessageDTO(

                    message.getId(),

                    message.getSenderId(),

                    message.getReceiverId(),

                    message.getRequestId(),

                    message.getMessage(),

                    message.getTimestamp()

                )

            )
            .toList();

}







    // Inbox messages

    public List<ChatMessage> getInbox(
            Long userId
    ){

        return chatMessageRepository
                .findByReceiverIdOrSenderId(
                        userId,
                        userId
                );

    }


}