package backend.repository;


import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import backend.entity.BloodGroup;
import backend.entity.User;



public interface UserRepository extends JpaRepository<User, Long> {




    Optional<User> findByEmail(
            String email
    );








    // Find donors who are available

    List<User> findByAvailableForDonationTrue();









    // Search available donors by blood group

    List<User> findByBloodGroupAndAvailableForDonationTrue(

            BloodGroup bloodGroup

    );









    // Search available donors by location

    List<User> findByLocationContainingIgnoreCaseAndAvailableForDonationTrue(

            String location

    );









    // Search available donors by blood group and location

    List<User> findByBloodGroupAndLocationContainingIgnoreCaseAndAvailableForDonationTrue(

            BloodGroup bloodGroup,

            String location

    );



}