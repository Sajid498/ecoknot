package backend.entity;


public enum RequestStatus {


    OPEN,


    DONOR_FOUND,


    FULFILLED,


    CANCELLED,


    // Phase 4.2
    // Blood request expired because required date passed

    EXPIRED


}