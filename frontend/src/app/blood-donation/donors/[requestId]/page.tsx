"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";


const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:8080";


type DonationResponse = {

    id:number;

    donorId:number;

    donorName:string;

    donorEmail:string;

    donorPhone:string;

    status:string;

};



export default function DonorPage(){

    const params = useParams();

    const router = useRouter();


    const requestId = params.requestId;



    const [donors,setDonors] =
        useState<DonationResponse[]>([]);



    useEffect(()=>{

        loadDonors();

    },[]);



    async function loadDonors(){

        const response =
        await fetch(
            `${API_URL}/api/donation-response/request/${requestId}`
        );


        const data =
            await response.json();


        setDonors(data);

    }



    return(

        <main className="min-h-screen bg-slate-50 p-10">


            <div className="mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow">


                <h1 className="text-3xl font-bold">
                    Interested Donors
                </h1>



                {
                    donors.length===0 ?

                    (
                        <p className="mt-5 text-gray-500">
                            No donors yet.
                        </p>
                    )

                    :

                    donors.map((donor)=>(


                        <div
                        key={donor.id}
                        className="mt-5 rounded-xl border p-5"
                        >


                            <h2 className="text-xl font-bold">
                                {donor.donorName}
                            </h2>


                            <p>
                                Email:
                                {donor.donorEmail}
                            </p>


                            <p>
                                Phone:
                                {donor.donorPhone}
                            </p>


                            <p className="mt-2 text-green-600">
                                {donor.status}
                            </p>



                            <button

                            onClick={()=>{

                                router.push(
                                `/chat/${requestId}/${donor.donorId}`
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


        </main>

    );


}