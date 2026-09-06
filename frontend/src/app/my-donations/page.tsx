"use client";


import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";



const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:8080";




type Donation = {

    id:number;

    requestId:number;

    donorId:number;

    status:string;

    requestOwnerId:number;

    requestOwnerName:string;

};




export default function MyDonationsPage(){


    const router = useRouter();


    const [donations,setDonations] =
        useState<Donation[]>([]);



    const [user,setUser] =
        useState<any>(null);





    useEffect(()=>{


        const savedUser =
            localStorage.getItem("user");



        if(savedUser){


            const userData =
                JSON.parse(savedUser);



            setUser(userData);


            loadDonations(
                userData.id
            );


        }


    },[]);






    async function loadDonations(
        userId:number
    ){


        try{


            const response =
                await fetch(
                    `${API_URL}/api/donation-response/donor/${userId}`
                );



          async function loadDonations(userId:number){

    try{

        const response = await fetch(
            `${API_URL}/api/donation-response/donor/${userId}`
        );


        const data = await response.json();


        console.log("DONATION RESPONSE:", data);



        if(Array.isArray(data)){

            setDonations(data);

        }
        else{

            console.log("Backend did not return array");

            setDonations([]);

        }


    }
    catch(error){

        console.log(error);

        setDonations([]);

    }

}



        }
        catch(error){


            console.log(error);


        }


    }





    return (

        <ProtectedRoute>


            <main className="min-h-screen bg-slate-50">


                <Navbar />



                <div className="mx-auto max-w-4xl px-6 py-10">


                    <div className="rounded-3xl bg-white p-8 shadow">


                        <h1 className="text-3xl font-bold">

                            ❤️ My Donations

                        </h1>





                        {
                            donations.length === 0 ?

                            (

                                <p className="mt-5 text-gray-500">

                                    You have not responded to any blood request.

                                </p>

                            )

                            :

                            (

                                <div className="mt-6 space-y-5">


                                    {
                                        donations.map((donation)=>(


                                            <div
                                            key={donation.id}
                                            className="rounded-xl border p-5"
                                            >



                   <h2 className="text-xl font-bold">

    Blood Request #{donation.requestId}

</h2>


<p className="mt-2 text-gray-600">

    Requester:
    <span className="ml-2 font-semibold">
        {donation.requestOwnerName}
    </span>

</p>




                                                <p className="mt-2">

                                                    Status:

                                                    <span className="ml-2 font-semibold text-emerald-700">

                                                        {donation.status}

                                                    </span>

                                                </p>




                                                <button


                                                onClick={()=>{


                   router.push(
 `/chat/${donation.requestId}/${donation.requestOwnerId}`
);


                                                }}



                                                className="
                                                mt-4
                                                rounded-lg
                                                bg-emerald-700
                                                px-4
                                                py-2
                                                text-white
                                                "

                                                >


                                                    💬 Chat


                                                </button>



                                            </div>


                                        ))

                                    }


                                </div>

                            )

                        }



                    </div>


                </div>


            </main>


        </ProtectedRoute>

    );


}