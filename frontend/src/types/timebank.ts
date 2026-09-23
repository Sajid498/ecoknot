export interface TimeOffer {


    id:number;


    title:string;


    description:string;


    skillCategory:string;


    availableHours:number;


    status:
    |
    "AVAILABLE"
    |
    "REQUESTED"
    |
    "COMPLETED"
    |
    "CANCELLED";



    userName?:string;


    createdAt?:string;


}









export interface TimeTransaction {


    id:number;


    amount:number;


    type:
    |
    "EARN"
    |
    "SPEND";



    description:string;


    createdAt:string;


}









export interface TimeBankStats {


    balance:number;


    totalOffers:number;


    totalTransactions:number;


}