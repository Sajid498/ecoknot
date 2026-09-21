export interface RescueDonation {


    id:number;


    title:string;


    description:string;


    type:"FOOD" | "MEDICINE";


    quantity:number;


    location:string;


    latitude:number | null;


    longitude:number | null;


    expiryTime:string;


    status:
    "AVAILABLE"
    |
    "RESERVED"
    |
    "PICKED_UP"
    |
    "DELIVERED"
    |
    "EXPIRED";


    userName:string;


    userId:number;


    createdAt:string;


}