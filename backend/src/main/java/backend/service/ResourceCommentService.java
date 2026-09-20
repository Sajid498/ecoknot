package backend.service;


import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import backend.dto.ResourceCommentDTO;
import backend.entity.Resource;
import backend.entity.ResourceComment;
import backend.entity.User;
import backend.exception.ResourceNotFoundException;
import backend.repository.ResourceCommentRepository;
import backend.repository.ResourceRepository;
import backend.repository.UserRepository;



@Service
public class ResourceCommentService {



    private final ResourceCommentRepository commentRepository;


    private final ResourceRepository resourceRepository;


    private final UserRepository userRepository;





    public ResourceCommentService(

            ResourceCommentRepository commentRepository,

            ResourceRepository resourceRepository,

            UserRepository userRepository

    ){


        this.commentRepository = commentRepository;

        this.resourceRepository = resourceRepository;

        this.userRepository = userRepository;


    }









    public ResourceCommentDTO createComment(

            Long resourceId,

            Long userId,

            ResourceComment comment

    ){



        Resource resource =

                resourceRepository

                        .findById(resourceId)

                        .orElseThrow(

                                () -> new ResourceNotFoundException(
                                        "Resource not found"
                                )

                        );





        User user =

                userRepository

                        .findById(userId)

                        .orElseThrow(

                                () -> new ResourceNotFoundException(
                                        "User not found"
                                )

                        );






        comment.setResource(resource);

        comment.setUser(user);

        comment.setCreatedAt(

                LocalDateTime.now()

        );






        ResourceComment saved =

                commentRepository.save(comment);





        return convertToDTO(saved);



    }









    public List<ResourceCommentDTO> getComments(

            Long resourceId

    ){



        return commentRepository

                .findByResourceId(resourceId)

                .stream()

                .map(this::convertToDTO)

                .toList();



    }









    public void deleteComment(

            Long commentId,

            Long userId

    ){



        ResourceComment comment =

                commentRepository

                        .findById(commentId)

                        .orElseThrow(

                                () -> new ResourceNotFoundException(
                                        "Comment not found"
                                )

                        );






        if(

            !comment.getUser()

                    .getId()

                    .equals(userId)

        ){


            throw new RuntimeException(

                    "You are not allowed to delete this comment"

            );


        }






        commentRepository.delete(comment);



    }









    private ResourceCommentDTO convertToDTO(

            ResourceComment comment

    ){



        return new ResourceCommentDTO(

                comment.getId(),

                comment.getContent(),

                comment.getUser().getName(),

                comment.getUser().getId(),

                comment.getCreatedAt()

        );



    }


}