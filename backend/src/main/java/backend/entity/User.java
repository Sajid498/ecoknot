package backend.entity;

import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    private String name;


    private String email;


    private String password;


    private String role;


    @OneToMany(mappedBy = "user")
    private List<BloodRequest> bloodRequests;


    public Long getId() {
        return id;
    }


    public String getName() {
        return name;
    }


    public String getEmail() {
        return email;
    }


    public String getPassword() {
        return password;
    }


    public String getRole() {
        return role;
    }


    public List<BloodRequest> getBloodRequests() {
        return bloodRequests;
    }
}