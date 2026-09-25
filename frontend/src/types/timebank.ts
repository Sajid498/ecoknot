export interface TimeRequest {

    id: number;


    requester: {

        id: number;

        name: string;

        email: string;

    };



    title: string;



    description: string;



    category: string;



    requiredHours: number;



    status: string;



    createdAt: string;



}





export interface TimeOffer {

    id: number;



    title: string;



    description: string;



    skillCategory: string;



    availableHours: number;



    status: string;



    createdAt: string;



}





export interface TimeTransaction {

    id: number;



    provider: {


        id: number;

        name: string;

        email: string;

    };



    requester: {


        id: number;

        name: string;

        email: string;

    };



    hours: number;



    description: string;



    transactionType: string;



    createdAt: string;



}





export interface TimeBalance {

    balance: number;

}