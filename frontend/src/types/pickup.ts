export interface PickupRequest {



    id:number;




    rescueDonation:{


        id:number;


        title:string;


        type:string;


        quantity:number;


        location:string;


    };







    volunteer:{


        id:number;


        name:string;


        email:string;


        location:string;


    };







    status:

        | "PENDING"

        | "APPROVED"

        | "PICKED_UP"

        | "DELIVERED"

        | "REJECTED";







    requestedAt:string;




    approvedAt:string | null;




    completedAt:string | null;



}