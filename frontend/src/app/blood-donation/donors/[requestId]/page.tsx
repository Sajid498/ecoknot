"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";


const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:8080";



type DonationResponse = {

    id: number;

    donorId: number;

    donorName: string;

    donorEmail: string;

    donorPhone: string;

    status: string;

};




export default function DonorPage() {


    const params = useParams();

    const router = useRouter();


    const requestId = params.requestId;



    const [donors, setDonors] =
        useState<DonationResponse[]>([]);




    useEffect(() => {

        loadDonors();

    }, []);







    async function loadDonors() {


        try {


            const response =
                await fetch(
                    `${API_URL}/api/donation-response/request/${requestId}`
                );


            const data =
                await response.json();


            setDonors(data);


        }
        catch (error) {

            console.log(error);

        }


    }








    async function updateDonationStatus(
        id: number,
        status: string
    ) {


        try {


            const response =
                await fetch(
                    `${API_URL}/api/donation-response/${id}?status=${status}`,
                    {

                        method: "PUT"

                    }
                );



            if (!response.ok) {

                throw new Error(
                    "Status update failed"
                );

            }



            loadDonors();



        }
        catch (error) {

            console.log(error);

        }


    }







    return (


        <main className="min-h-screen bg-slate-50 p-10">


            <div className="mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow">



                <h1 className="text-3xl font-bold">

                    Interested Donors

                </h1>





                {

                    donors.length === 0 ?

                        (

                            <p className="mt-5 text-gray-500">

                                No donors yet.

                            </p>

                        )

                        :


                        donors.map((donor) => (



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





                                <p className="mt-2 font-semibold">

                                    Status:

                                    <span className="ml-2 text-emerald-600">

                                        {donor.status}

                                    </span>

                                </p>







                                <div className="mt-4 flex gap-3">





                                    {
                                        donor.status === "PENDING" &&

                                        <>


                                            <button

                                                onClick={() => {

                                                    updateDonationStatus(
                                                        donor.id,
                                                        "ACCEPTED"
                                                    );

                                                }}

                                                className="
                                    rounded-lg
                                    bg-green-600
                                    px-4
                                    py-2
                                    text-white
                                    "

                                            >

                                                ✅ Accept

                                            </button>






                                            <button

                                                onClick={() => {

                                                    updateDonationStatus(
                                                        donor.id,
                                                        "REJECTED"
                                                    );

                                                }}

                                                className="
                                    rounded-lg
                                    bg-red-600
                                    px-4
                                    py-2
                                    text-white
                                    "

                                            >

                                                ❌ Reject

                                            </button>


                                        </>


                                    }







                                    <button


                                        onClick={() => {

                                            router.push(
                                                `/chat/${requestId}/${donor.donorId}`
                                            );

                                        }}



                                        className="
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





                            </div>



                        ))


                }





            </div>



        </main>


    );


}