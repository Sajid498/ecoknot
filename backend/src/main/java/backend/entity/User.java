package backend.entity;


import java.time.LocalDate;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;


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



    // Donor profile information
// Donor profile information

private String location;


@Enumerated(EnumType.STRING)
private BloodGroup bloodGroup;


private boolean availableForDonation = false;


private LocalDate lastDonationDate;





    @OneToMany(mappedBy = "user")
    @JsonIgnore
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





    public String getLocation() {

        return location;

    }


public BloodGroup getBloodGroup() {

    return bloodGroup;

}


    public boolean isAvailableForDonation() {

        return availableForDonation;

    }





    public LocalDate getLastDonationDate() {

        return lastDonationDate;

    }





    public List<BloodRequest> getBloodRequests() {

        return bloodRequests;

    }








    public void setName(String name) {

        this.name = name;

    }





    public void setEmail(String email) {

        this.email = email;

    }





    public void setPassword(String password) {

        this.password = password;

    }





    public void setRole(String role) {

        this.role = role;

    }





    public void setLocation(String location) {

        this.location = location;

    }

public void setBloodGroup(BloodGroup bloodGroup) {

    this.bloodGroup = bloodGroup;

}



    public void setAvailableForDonation(boolean availableForDonation) {

        this.availableForDonation = availableForDonation;

    }





    public void setLastDonationDate(LocalDate lastDonationDate) {

        this.lastDonationDate = lastDonationDate;

    }




}