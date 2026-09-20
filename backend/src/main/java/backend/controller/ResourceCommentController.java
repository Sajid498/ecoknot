package backend.controller;


import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import backend.dto.ResourceCommentDTO;
import backend.entity.ResourceComment;
import backend.service.ResourceCommentService;





@RestController
@RequestMapping("/api")
public class ResourceCommentController {





    private final ResourceCommentService commentService;







    public ResourceCommentController(

            ResourceCommentService commentService

    ){


        this.commentService = commentService;


    }









    // Create comment

    @PostMapping("/resources/{resourceId}/comments")
    public ResourceCommentDTO createComment(

            @PathVariable Long resourceId,

            @RequestParam Long userId,

            @RequestBody ResourceComment comment

    ){



        return commentService.createComment(

                resourceId,

                userId,

                comment

        );



    }









    // Get comments of a resource

    @GetMapping("/resources/{resourceId}/comments")
    public List<ResourceCommentDTO> getComments(

            @PathVariable Long resourceId

    ){



        return commentService.getComments(

                resourceId

        );


    }









    // Delete own comment

    @DeleteMapping("/comments/{commentId}")
    public String deleteComment(

            @PathVariable Long commentId,

            @RequestParam Long userId

    ){



        commentService.deleteComment(

                commentId,

                userId

        );




        return "Comment deleted successfully";


    }



}