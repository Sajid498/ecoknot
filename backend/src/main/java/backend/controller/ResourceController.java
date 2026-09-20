package backend.controller;


import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import backend.dto.ResourceDTO;
import backend.entity.Resource;
import backend.service.ResourceService;





@RestController
@RequestMapping("/api/resources")
@CrossOrigin("*")
public class ResourceController {




    private final ResourceService resourceService;






    public ResourceController(

            ResourceService resourceService

    ){


        this.resourceService = resourceService;


    }









    // Create new resource post

    @PostMapping
    public ResourceDTO createResource(


            @RequestParam Long userId,


            @RequestBody Resource resource


    ){



        return resourceService.createResource(

                userId,

                resource

        );



    }









    // Facebook style feed

    @GetMapping
    public List<ResourceDTO> getAllResources(){



        return resourceService

                .getAllResources();



    }









    // Get single post

    @GetMapping("/{id}")
    public ResourceDTO getResourceById(


            @PathVariable Long id


    ){



        return resourceService

                .getResourceById(id);



    }









    // Like post

    @PutMapping("/{id}/like")
    public ResourceDTO likeResource(


            @PathVariable Long id


    ){



        return resourceService

                .likeResource(id);



    }









    // Share post

    @PutMapping("/{id}/share")
    public ResourceDTO shareResource(


            @PathVariable Long id


    ){



        return resourceService

                .shareResource(id);



    }









    // Delete post
@DeleteMapping("/{id}")
public String deleteResource(

        @PathVariable Long id,

        @RequestParam Long userId

){


    resourceService.deleteResource(

            id,

            userId

    );


    return "Resource deleted successfully";

}





}