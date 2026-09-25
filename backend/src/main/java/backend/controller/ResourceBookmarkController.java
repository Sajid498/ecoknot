package backend.controller;


import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import backend.entity.ResourceBookmark;
import backend.service.ResourceBookmarkService;





@RestController
@RequestMapping("/api/bookmarks")
public class ResourceBookmarkController {





    private final ResourceBookmarkService resourceBookmarkService;







    public ResourceBookmarkController(

            ResourceBookmarkService resourceBookmarkService

    ){


        this.resourceBookmarkService =
                resourceBookmarkService;


    }









    // Save resource

    @PostMapping("/save")
    public ResponseEntity<?> saveBookmark(


            @RequestParam Long userId,


            @RequestParam Long resourceId


    ){



        ResourceBookmark bookmark =

                resourceBookmarkService

                .addBookmark(

                        userId,

                        resourceId

                );





        return ResponseEntity.ok(

                bookmark

        );


    }









    // Remove saved resource

    @DeleteMapping("/remove")
    public ResponseEntity<?> removeBookmark(


            @RequestParam Long userId,


            @RequestParam Long resourceId


    ){



        resourceBookmarkService

        .removeBookmark(

                userId,

                resourceId

        );





        return ResponseEntity.ok(

                "Bookmark removed"

        );


    }









    // Check if resource is already bookmarked

    @GetMapping("/check")
    public ResponseEntity<Boolean> checkBookmark(


            @RequestParam Long userId,


            @RequestParam Long resourceId


    ){



        return ResponseEntity.ok(

                resourceBookmarkService

                .isBookmarked(

                        userId,

                        resourceId

                )

        );


    }









    // Get user's saved resources

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ResourceBookmark>> getUserBookmarks(


            @PathVariable Long userId


    ){





        return ResponseEntity.ok(

                resourceBookmarkService

                .getUserBookmarks(

                        userId

                )

        );


    }





}