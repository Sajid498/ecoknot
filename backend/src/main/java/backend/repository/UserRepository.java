package backend.repository;


import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import backend.entity.User;



public interface UserRepository extends JpaRepository<User, Long> {



    Optional<User> findByEmail(
            String email
    );





    // Find donors who are available

    List<User> findByAvailableForDonationTrue();



}