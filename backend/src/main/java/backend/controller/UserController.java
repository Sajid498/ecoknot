package backend.controller;


import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import backend.entity.User;
import backend.service.UserService;



@RestController
@RequestMapping("/api/users")
@CrossOrigin("*")
public class UserController {




    private final UserService userService;




    public UserController(
            UserService userService
    ){

        this.userService = userService;

    }








    @PostMapping("/signup")
    public User signup(
            @RequestBody User user
    ){

        return userService.signup(user);

    }









    @PostMapping("/login")
    public User login(
            @RequestBody User user
    ){

        return userService.login(
                user.getEmail(),
                user.getPassword()
        );

    }









    // Get profile

    @GetMapping("/{id}")
    public User getUser(
            @PathVariable Long id
    ){

        return userService.getUserById(id);

    }









    // Update donor profile

    @PutMapping("/{id}")
    public User updateProfile(
            @PathVariable Long id,
            @RequestBody User user
    ){

        return userService.updateProfile(
                id,
                user
        );

    }




}