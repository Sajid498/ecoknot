package backend.controller;


import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
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


    public UserController(UserService userService) {

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

}