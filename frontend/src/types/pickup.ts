import {
    RescueDonation
} from "./rescue";




export interface PickupRequest {



    id:number;




    rescueDonation:RescueDonation;




    volunteerId:number;




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