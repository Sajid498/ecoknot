"use client";


import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";



const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:8080";





type BloodRequest = {


    id:number;

    patientName:string;

    bloodGroup:string;

    hospital:string;

    location:string;

    unitsNeeded:number;

    urgency:string;

    status:string;


};





type RequestWithDonorCount = BloodRequest & {


    donorCount:number;


};







export default function MyRequestsPage(){



    const router = useRouter();



    const [requests,setRequests] =
        useState<RequestWithDonorCount[]>([]);



    const [loading,setLoading] =
        useState(true);







    useEffect(()=>{


        loadRequests();


    },[]);








    async function loadRequests(){


        try{


            const savedUser =
                localStorage.getItem("user");



            if(!savedUser){

                return;

            }



            const user =
                JSON.parse(savedUser);




            const response =
                await fetch(
                    `${API_URL}/api/blood-requests/user/${user.id}`
                );




            const data =
                await response.json();





            const updatedRequests =
                await Promise.all(

                    data.map(
                        async (request:BloodRequest)=>{


                            const donorResponse =
                                await fetch(
                                    `${API_URL}/api/donation-response/request/${request.id}`
                                );



                            const donors =
                                await donorResponse.json();




                            return {

                                ...request,

                                donorCount:
                                    Array.isArray(donors)
                                    ?
                                    donors.length
                                    :
                                    0

                            };


                        }

                    )

                );




            setRequests(
                updatedRequests
            );



        }
        catch(error){


            console.log(error);


        }
        finally{


            setLoading(false);


        }


    }









    return(


        <main className="min-h-screen bg-slate-50">


            <Navbar />



            <div className="mx-auto max-w-5xl px-6 py-10">



                <div className="rounded-3xl bg-white p-8 shadow">



                    <h1 className="text-3xl font-bold">

                        🩸 My Blood Requests

                    </h1>



                    <p className="mt-2 text-slate-500">

                        Manage your created blood requests

                    </p>







                    {
                        loading ?


                        (

                            <p className="mt-8">

                                Loading...

                            </p>

                        )

                        :


                        requests.length===0 ?


                        (

                            <p className="mt-8 text-gray-500">

                                You have no blood requests.

                            </p>

                        )


                        :



                        (

                            <div className="mt-8 space-y-5">


                                {
                                    requests.map((request)=>(



                                        <div

                                        key={request.id}

                                        className="
                                        rounded-2xl
                                        border
                                        border-slate-200
                                        p-6
                                        "

                                        >




                                            <div className="flex justify-between">


                                                <div>


                                                    <h2 className="text-xl font-bold">

                                                        {request.patientName}

                                                    </h2>



                                                    <p className="mt-1 text-red-600 font-semibold">

                                                        🩸 {request.bloodGroup}

                                                    </p>


                                                </div>




                                                <span className="
                                                rounded-full
                                                bg-green-100
                                                px-4
                                                py-2
                                                text-sm
                                                font-semibold
                                                text-green-700
                                                ">

                                                    {request.status}

                                                </span>




                                            </div>







                                            <div className="mt-5 space-y-2 text-slate-600">



                                                <p>

                                                    🏥 Hospital:

                                                    <b>
                                                        {" "}
                                                        {request.hospital}
                                                    </b>

                                                </p>





                                                <p>

                                                    📍 Location:

                                                    <b>
                                                        {" "}
                                                        {request.location}
                                                    </b>

                                                </p>





                                                <p>

                                                    ⚠️ Urgency:

                                                    <b>
                                                        {" "}
                                                        {request.urgency}
                                                    </b>

                                                </p>





                                                <p>

                                                    🩸 Units Needed:

                                                    <b>
                                                        {" "}
                                                        {request.unitsNeeded}
                                                    </b>

                                                </p>





                                                <p>

                                                    👥 Interested Donors:

                                                    <b>
                                                        {" "}
                                                        {request.donorCount}
                                                    </b>

                                                </p>




                                            </div>









                                            <button


                                            onClick={()=>{


                                                router.push(
                                                    `/donors/${request.id}`
                                                );


                                            }}



                                            className="
                                            mt-5
                                            rounded-xl
                                            bg-emerald-700
                                            px-5
                                            py-3
                                            font-semibold
                                            text-white
                                            hover:bg-emerald-800
                                            "


                                            >


                                                Manage Donors


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


    );


}