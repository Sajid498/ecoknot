package backend.repository;


import java.util.List;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


import backend.entity.TimeTransaction;



@Repository
public interface TimeTransactionRepository

        extends JpaRepository<TimeTransaction, Long> {






    // Get all transactions of a user

    List<TimeTransaction> findByUserIdOrderByCreatedAtDesc(

            Long userId

    );







    // Calculate total earned/spent credits

    List<TimeTransaction> findByUserId(

            Long userId

    );



}