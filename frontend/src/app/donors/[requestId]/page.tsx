"use client";


import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";



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





type RecommendedDonor = {

    donorId:number;

    name:string;

    bloodGroup:string;

    location:string;

    score:number;

    reason:string;

};





type BloodRequest = {

    patientName:string;

    bloodGroup:string;

    hospital:string;

    location:string;

    status:string;

};









export default function DonorPage(){



    const params = useParams();

    const router = useRouter();



    const requestId =
        String(params.requestId);






    const [donors,setDonors] =
        useState<DonationResponse[]>([]);




    const [recommendedDonors,setRecommendedDonors] =
        useState<RecommendedDonor[]>([]);




    const [request,setRequest] =
        useState<BloodRequest | null>(null);








    useEffect(()=>{


        if(requestId){

            loadDonors();

            loadRequest();

            loadRecommendedDonors();

        }


    },[requestId]);









    async function loadRequest(){


        try{


            const response =
                await fetch(
                    `${API_URL}/api/blood-requests/${requestId}`
                );


            const data =
                await response.json();



            setRequest(data);



        }
        catch(error){

            console.log(error);

        }


    }









    async function loadDonors(){


        try{


            const response =
                await fetch(
                    `${API_URL}/api/donation-response/request/${requestId}`
                );



            const data =
                await response.json();



            if(Array.isArray(data)){

                setDonors(data);

            }
            else{

                setDonors([]);

            }


        }
        catch(error){

            console.log(error);

        }


    }








    async function loadRecommendedDonors(){


        try{


            const response =
                await fetch(
                    `${API_URL}/api/donor-matching/${requestId}/recommended-donors`
                );



            const data =
                await response.json();




            if(Array.isArray(data)){


                setRecommendedDonors(data);


            }
            else{


                setRecommendedDonors([]);


            }



        }
        catch(error){


            console.log(error);


        }


    }









    async function updateDonationStatus(
        id:number,
        status:string
    ){


        try{


            const response =
                await fetch(
                    `${API_URL}/api/donation-response/${id}?status=${status}`,
                    {

                        method:"PUT"

                    }
                );



            if(!response.ok){


                const errorText =
                    await response.text();



                throw new Error(
                    errorText
                );

            }



            await loadDonors();

            await loadRequest();


        }
        catch(error:any){

            console.log(error);


            alert(
                error.message ||
                "Unable to update status"
            );


        }


    }









    const acceptedExists =
        donors.some(
            donor =>
            donor.status === "ACCEPTED"
        );
    return(


    <ProtectedRoute>


        <main className="min-h-screen bg-slate-50">


            <Navbar />



            <div className="mx-auto max-w-4xl px-6 py-10">






                {
                    request &&

                    <div className="
                    rounded-2xl
                    bg-white
                    p-6
                    shadow
                    ">


                        <h1 className="text-3xl font-bold">

                            🩸 Blood Request

                        </h1>



                        <div className="mt-5 grid gap-3 md:grid-cols-2">


                            <p>
                                Patient:
                                <b> {request.patientName}</b>
                            </p>



                            <p>
                                Blood Group:
                                <b> {request.bloodGroup}</b>
                            </p>



                            <p>
                                Hospital:
                                <b> {request.hospital}</b>
                            </p>



                            <p>
                                Location:
                                <b> {request.location}</b>
                            </p>



                            <p>
                                Status:
                                <b className="text-green-600">
                                    {" "}
                                    {request.status}
                                </b>
                            </p>


                        </div>



                    </div>


                }









                {/* SMART RECOMMENDED DONORS */}


                <div className="
                mt-8
                rounded-2xl
                bg-white
                p-6
                shadow
                ">



                    <h1 className="text-3xl font-bold">

                        🤖 Recommended Donors

                    </h1>



                    <p className="mt-2 text-slate-500">

                        Donors ranked by blood compatibility, location and availability.

                    </p>







                    {
                        recommendedDonors.length === 0 ?


                        (

                            <p className="mt-5 text-gray-500">

                                No recommended donors found.

                            </p>


                        )


                        :



                        recommendedDonors.map(
                            (donor)=>(


                            <div

                            key={donor.donorId}

                            className="
                            mt-5
                            rounded-xl
                            border
                            border-emerald-200
                            bg-emerald-50
                            p-5
                            "

                            >



                                <div className="flex justify-between">


                                    <h2 className="text-xl font-bold">

                                        🥇 {donor.name}

                                    </h2>




                                    <span className="
                                    rounded-full
                                    bg-emerald-700
                                    px-3
                                    py-1
                                    text-white
                                    ">

                                        {donor.score}% Match

                                    </span>



                                </div>







                                <p className="mt-3">

                                    🩸 Blood Group:

                                    <b>

                                        {" "}
                                        {donor.bloodGroup}

                                    </b>

                                </p>





                                <p>

                                    📍 Location:

                                    <b>

                                        {" "}
                                        {donor.location}

                                    </b>

                                </p>






                                <p className="mt-2 text-slate-600">

                                    {donor.reason}

                                </p>





                            </div>


                        ))


                    }




                </div>









                {/* INTERESTED DONORS */}



                <div className="
                mt-8
                rounded-2xl
                bg-white
                p-6
                shadow
                ">



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

                            className="
                            mt-5
                            rounded-xl
                            border
                            p-5
                            "

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









                                <div className="mt-4 flex flex-wrap gap-3">






                                {
                                    donor.status==="PENDING"
                                    &&

                                    !acceptedExists

                                    &&

                                    <button

                                    onClick={()=>{

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

                                }








                                {
                                    donor.status==="PENDING"
                                    &&
                                    acceptedExists
                                    &&

                                    <span className="
                                    rounded-lg
                                    bg-gray-200
                                    px-4
                                    py-2
                                    text-gray-600
                                    ">

                                        Another donor already selected

                                    </span>

                                }









                                {
                                    donor.status==="PENDING" &&


                                    <button

                                    onClick={()=>{

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


                                }









                                {
                                    donor.status==="ACCEPTED" &&


                                    <button

                                    onClick={()=>{

                                        updateDonationStatus(
                                            donor.id,
                                            "COMPLETED"
                                        );

                                    }}

                                    className="
                                    rounded-lg
                                    bg-blue-600
                                    px-4
                                    py-2
                                    text-white
                                    "

                                    >

                                        ✅ Complete Donation

                                    </button>


                                }









                                <button


                                onClick={()=>{

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





            </div>



        </main>


    </ProtectedRoute>


    );


}