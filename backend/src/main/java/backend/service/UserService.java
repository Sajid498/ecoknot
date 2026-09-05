package backend.service;


import org.springframework.stereotype.Service;

import backend.entity.User;
import backend.repository.UserRepository;


@Service
public class UserService {


    private final UserRepository userRepository;



    public UserService(UserRepository userRepository) {

        this.userRepository = userRepository;

    }



    // Signup
    public User signup(User user) {


        if(userRepository.findByEmail(user.getEmail()).isPresent()) {

            throw new RuntimeException("Email already exists");

        }


        return userRepository.save(user);

    }



    // Login
    public User login(String email, String password) {


        User user = userRepository.findByEmail(email)
                .orElseThrow(
                        () -> new RuntimeException("User not found")
                );



        if(!user.getPassword().equals(password)) {

            throw new RuntimeException("Invalid password");

        }



        return user;

    }


}