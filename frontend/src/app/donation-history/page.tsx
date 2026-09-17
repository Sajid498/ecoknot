"use client";


import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";



const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:8080";




type DonationHistory = {


    id:number;

    requestId:number;

    patientName:string;

    bloodGroup:string;

    hospital:string;

    location:string;

    status:string;

    createdAt:string;


};





export default function DonationHistoryPage(){



    const [history,setHistory] =
        useState<DonationHistory[]>([]);



    const [user,setUser] =
        useState<any>(null);



    useEffect(()=>{


        const savedUser =
            localStorage.getItem("user");



        if(savedUser){


            const userData =
                JSON.parse(savedUser);


            setUser(userData);


            loadHistory(userData.id);


        }


    },[]);







    async function loadHistory(
        donorId:number
    ){


        try{


            const response =
                await fetch(
                    `${API_URL}/api/donation-response/history/${donorId}`
                );



            const data =
                await response.json();



            if(Array.isArray(data)){


                setHistory(data);


            }
            else{


                setHistory([]);


            }



        }
        catch(error){


            console.log(error);


        }


    }








    return(


        <main className="min-h-screen bg-slate-50">


            <Navbar />



            <div className="mx-auto max-w-5xl px-6 py-10">



                <div className="rounded-3xl bg-white p-8 shadow-lg">



                    <h1 className="text-3xl font-bold text-slate-900">

                        🩸 Donation History

                    </h1>



                    <p className="mt-2 text-slate-500">

                        Your completed blood donations

                    </p>






                    {
                        history.length===0 ?


                        (

                            <p className="mt-8 text-gray-500">

                                No completed donations yet.

                            </p>


                        )

                        :


                        (

                            <div className="mt-8 space-y-5">


                                {
                                    history.map((donation)=>(



                                        <div

                                        key={donation.id}

                                        className="
                                        rounded-xl
                                        border
                                        border-slate-200
                                        p-6
                                        "

                                        >



                                            <div className="flex justify-between">


                                                <h2 className="text-xl font-bold">

                                                    {donation.patientName}

                                                </h2>




                                                <span className="
                                                rounded-full
                                                bg-green-100
                                                px-3
                                                py-1
                                                text-sm
                                                text-green-700
                                                ">

                                                    {donation.status}

                                                </span>



                                            </div>






                                            <div className="mt-4 space-y-2 text-slate-600">


                                                <p>

                                                    Blood Group:
                                                    <span className="font-semibold">
                                                        {" "}
                                                        {donation.bloodGroup}
                                                    </span>

                                                </p>



                                                <p>

                                                    Hospital:
                                                    <span className="font-semibold">
                                                        {" "}
                                                        {donation.hospital}
                                                    </span>

                                                </p>




                                                <p>

                                                    Location:
                                                    <span className="font-semibold">
                                                        {" "}
                                                        {donation.location}
                                                    </span>

                                                </p>




                                                <p>

                                                    Request ID:
                                                    <span className="font-semibold">
                                                        {" "}
                                                        #{donation.requestId}
                                                    </span>

                                                </p>




                                                <p>

                                                    Date:
                                                    <span className="font-semibold">
                                                        {" "}
                                                        {
                                                        new Date(
                                                            donation.createdAt
                                                        )
                                                        .toLocaleDateString()
                                                        }
                                                    </span>

                                                </p>



                                            </div>



                                        </div>



                                    ))

                                }


                            </div>


                        )


                    }





                </div>




            </div>



        </main>


    );


}