package backend.service;


import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import backend.entity.Resource;
import backend.entity.ResourceBookmark;
import backend.entity.User;
import backend.repository.ResourceBookmarkRepository;
import backend.repository.ResourceRepository;
import backend.repository.UserRepository;





@Service
public class ResourceBookmarkService {




    private final ResourceBookmarkRepository resourceBookmarkRepository;


    private final ResourceRepository resourceRepository;


    private final UserRepository userRepository;







    public ResourceBookmarkService(


            ResourceBookmarkRepository resourceBookmarkRepository,


            ResourceRepository resourceRepository,


            UserRepository userRepository


    ){


        this.resourceBookmarkRepository =
                resourceBookmarkRepository;


        this.resourceRepository =
                resourceRepository;


        this.userRepository =
                userRepository;


    }









    // Add bookmark

    public ResourceBookmark addBookmark(


            Long userId,


            Long resourceId


    ){





        boolean exists =

                resourceBookmarkRepository

                .existsByUserIdAndResourceId(

                        userId,

                        resourceId

                );







        if(exists){


            throw new RuntimeException(

                    "Resource already bookmarked"

            );


        }








        User user =


                userRepository

                .findById(userId)

                .orElseThrow(

                        () -> new RuntimeException(

                                "User not found"

                        )

                );









        Resource resource =


                resourceRepository

                .findById(resourceId)

                .orElseThrow(

                        () -> new RuntimeException(

                                "Resource not found"

                        )

                );









        ResourceBookmark bookmark =

                new ResourceBookmark();








        bookmark.setUser(user);


        bookmark.setResource(resource);


        bookmark.setCreatedAt(

                LocalDateTime.now()

        );









        return resourceBookmarkRepository.save(

                bookmark

        );



    }












    // Remove bookmark


    public void removeBookmark(


            Long userId,


            Long resourceId


    ){



        resourceBookmarkRepository

        .deleteByUserIdAndResourceId(

                userId,

                resourceId

        );



    }












    // Get user's saved resources


    public List<ResourceBookmark> getUserBookmarks(


            Long userId


    ){



        User user =


                userRepository

                .findById(userId)

                .orElseThrow(

                        () -> new RuntimeException(

                                "User not found"

                        )

                );






        return resourceBookmarkRepository

                .findByUser(user);



    }





}