package backend.service;


import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import backend.dto.ResourceDTO;
import backend.entity.Resource;
import backend.entity.User;
import backend.exception.ResourceNotFoundException;
import backend.repository.ResourceRepository;
import backend.repository.UserRepository;



@Service
public class ResourceService {



    private final ResourceRepository resourceRepository;


    private final UserRepository userRepository;





    public ResourceService(

            ResourceRepository resourceRepository,

            UserRepository userRepository

    ){


        this.resourceRepository =
                resourceRepository;


        this.userRepository =
                userRepository;


    }









    public ResourceDTO createResource(

            Long userId,

            Resource resource

    ){



        User user =

                userRepository

                        .findById(userId)

                        .orElseThrow(

                                () -> new ResourceNotFoundException(
                                        "User not found"
                                )

                        );






        resource.setUser(user);


        resource.setCreatedAt(

                LocalDateTime.now()

        );



        Resource saved =

                resourceRepository.save(

                        resource

                );





        return convertToDTO(saved);



    }









    public List<ResourceDTO> getAllResources(){



        return resourceRepository

                .findAll()

                .stream()

                .map(this::convertToDTO)

                .toList();



    }









    public ResourceDTO getResourceById(

            Long id

    ){



        Resource resource =


                resourceRepository

                        .findById(id)

                        .orElseThrow(

                                () -> new ResourceNotFoundException(
                                        "Resource not found"
                                )

                        );





        return convertToDTO(resource);



    }









    public ResourceDTO likeResource(

            Long id

    ){



        Resource resource =

                resourceRepository

                        .findById(id)

                        .orElseThrow(

                                () -> new ResourceNotFoundException(
                                        "Resource not found"
                                )

                        );






        resource.setLikes(

                resource.getLikes()+1

        );





        Resource updated =

                resourceRepository.save(

                        resource

                );





        return convertToDTO(updated);



    }









    public ResourceDTO shareResource(

            Long id

    ){



        Resource resource =

                resourceRepository

                        .findById(id)

                        .orElseThrow(

                                () -> new ResourceNotFoundException(
                                        "Resource not found"
                                )

                        );






        resource.setShares(

                resource.getShares()+1

        );





        Resource updated =

                resourceRepository.save(

                        resource

                );





        return convertToDTO(updated);



    }









    // Delete only by owner

    public void deleteResource(

            Long resourceId,

            Long userId

    ){



        Resource resource =

                resourceRepository

                        .findById(resourceId)

                        .orElseThrow(

                                () -> new ResourceNotFoundException(
                                        "Resource not found"
                                )

                        );








        if(

            !resource.getUser()

                    .getId()

                    .equals(userId)

        ){



            throw new RuntimeException(

                    "You are not allowed to delete this resource"

            );


        }







        resourceRepository.delete(

                resource

        );


    }









    private ResourceDTO convertToDTO(

            Resource resource

    ){



        return new ResourceDTO(

                resource.getId(),

                resource.getContent(),

                resource.getImageUrl(),

                resource.getUser().getName(),

                resource.getUser().getId(),

                resource.getLikes(),

                resource.getShares(),

                resource.getCreatedAt()

        );


    }



}