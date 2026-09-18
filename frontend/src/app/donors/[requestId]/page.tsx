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



    const params =
        useParams();



    const router =
        useRouter();



    const requestId =
        String(
            params.requestId
        );






    const [donors,setDonors] =
        useState<DonationResponse[]>([]);




    const [
        recommendedDonors,
        setRecommendedDonors
    ] =
        useState<RecommendedDonor[]>([]);




    const [request,setRequest] =
        useState<BloodRequest | null>(null);




    const [
        acceptingRecommendedId,
        setAcceptingRecommendedId
    ] =
        useState<number | null>(null);








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



            if(!response.ok){


                throw new Error(
                    "Failed to load blood request"
                );


            }



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



            if(!response.ok){


                throw new Error(
                    "Failed to load donors"
                );


            }



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


            setDonors([]);


        }


    }









    async function loadRecommendedDonors(){


        try{


            const response =
                await fetch(
                    `${API_URL}/api/donor-matching/${requestId}/recommended-donors`
                );



            if(!response.ok){


                throw new Error(
                    "Failed to load recommended donors"
                );


            }



            const data =
                await response.json();



            if(Array.isArray(data)){


                setRecommendedDonors(
                    data
                );


            }
            else{


                setRecommendedDonors([]);


            }


        }
        catch(error){


            console.log(error);


            setRecommendedDonors([]);


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


            await loadRecommendedDonors();


        }
        catch(error:any){


            console.log(error);



            alert(
                error.message ||
                "Unable to update status"
            );


        }


    }









    async function acceptRecommendedDonor(
        donor:RecommendedDonor
    ){


        try{


            setAcceptingRecommendedId(
                donor.donorId
            );





            // Check whether this recommended donor
            // already applied for this request.

            const existingResponse =
                donors.find(
                    item =>
                        item.donorId ===
                        donor.donorId
                );






            // If donor already applied and is pending,
            // accept existing response instead of
            // creating a duplicate response.

            if(
                existingResponse &&
                existingResponse.status === "PENDING"
            ){


                await updateDonationStatus(
                    existingResponse.id,
                    "ACCEPTED"
                );


                alert(
                    "Recommended donor accepted successfully"
                );


                return;


            }






            if(
                existingResponse &&
                existingResponse.status === "ACCEPTED"
            ){


                alert(
                    "This donor is already accepted"
                );


                return;


            }






            if(
                existingResponse &&
                existingResponse.status === "COMPLETED"
            ){


                alert(
                    "This donation is already completed"
                );


                return;


            }






            if(
                existingResponse &&
                existingResponse.status === "REJECTED"
            ){


                alert(
                    "This donor was previously rejected for this request"
                );


                return;


            }






            // Donor has not applied before.
            // Create an ACCEPTED response directly.

            const response =
                await fetch(
                    `${API_URL}/api/donation-response/accept-recommended`,
                    {


                        method:"POST",


                        headers:{

                            "Content-Type":
                                "application/json"

                        },


                        body:JSON.stringify({


                            requestId:
                                Number(requestId),


                            donorId:
                                donor.donorId,


                            donorName:
                                donor.name,


                            donorEmail:
                                "",


                            donorPhone:
                                ""


                        })


                    }
                );






            if(!response.ok){


                const errorText =
                    await response.text();



                throw new Error(
                    errorText
                );


            }






            alert(
                "Recommended donor accepted successfully"
            );





            await loadDonors();


            await loadRequest();


            await loadRecommendedDonors();


        }
        catch(error:any){


            console.log(error);



            alert(
                error.message ||
                "Failed to accept recommended donor"
            );


        }
        finally{


            setAcceptingRecommendedId(
                null
            );


        }


    }









    function formatBloodGroup(
        bloodGroup:string
    ){


        if(!bloodGroup){


            return "Unknown";


        }



        return bloodGroup

            .replace(
                "_POSITIVE",
                "+"
            )

            .replace(
                "_NEGATIVE",
                "-"
            );


    }









    function getMatchPercentage(
        score:number
    ){


        const maximumScore =
            130;



        const percentage =
            Math.round(
                (
                    score /
                    maximumScore
                )
                *
                100
            );



        return Math.min(
            100,
            percentage
        );


    }









    function getReliabilityLabel(
        donor:RecommendedDonor
    ){


        if(
            donor.reason
                .toLowerCase()
                .includes(
                    "highly reliable"
                )
        ){


            return "Highly Reliable";


        }



        if(
            donor.reason
                .toLowerCase()
                .includes(
                    "previous donation history"
                )
        ){


            return "Reliable";


        }



        return "New Donor";


    }









    function getRankEmoji(
        index:number
    ){


        if(index === 0){


            return "🥇";


        }



        if(index === 1){


            return "🥈";


        }



        if(index === 2){


            return "🥉";


        }



        return "⭐";


    }









    const acceptedExists =
        donors.some(
            donor =>
                donor.status ===
                "ACCEPTED"
        );









    return(


    <ProtectedRoute>


        <main className="
        min-h-screen
        bg-slate-50
        ">


            <Navbar />






            <div className="
            mx-auto
            max-w-5xl
            px-6
            py-10
            ">







                {/* BLOOD REQUEST */}


                {
                    request &&


                    <div className="
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    p-6
                    shadow
                    ">


                        <div className="
                        flex
                        flex-wrap
                        items-start
                        justify-between
                        gap-4
                        ">



                            <div>


                                <h1 className="
                                text-3xl
                                font-bold
                                text-slate-900
                                ">

                                    🩸 Blood Request

                                </h1>



                                <p className="
                                mt-2
                                text-slate-500
                                ">

                                    Review the request and choose the most suitable donor.

                                </p>


                            </div>





                            <span className="
                            rounded-full
                            bg-emerald-100
                            px-4
                            py-2
                            text-sm
                            font-bold
                            text-emerald-700
                            ">

                                {request.status}

                            </span>


                        </div>






                        <div className="
                        mt-6
                        grid
                        gap-4
                        md:grid-cols-2
                        ">



                            <div className="
                            rounded-xl
                            bg-slate-50
                            p-4
                            ">

                                <p className="
                                text-sm
                                text-slate-500
                                ">

                                    Patient

                                </p>


                                <p className="
                                mt-1
                                font-bold
                                text-slate-900
                                ">

                                    {request.patientName}

                                </p>

                            </div>






                            <div className="
                            rounded-xl
                            bg-red-50
                            p-4
                            ">

                                <p className="
                                text-sm
                                text-red-500
                                ">

                                    Blood Group

                                </p>


                                <p className="
                                mt-1
                                text-xl
                                font-bold
                                text-red-700
                                ">

                                    🩸{" "}
                                    {
                                        formatBloodGroup(
                                            request.bloodGroup
                                        )
                                    }

                                </p>

                            </div>






                            <div className="
                            rounded-xl
                            bg-slate-50
                            p-4
                            ">

                                <p className="
                                text-sm
                                text-slate-500
                                ">

                                    Hospital

                                </p>


                                <p className="
                                mt-1
                                font-semibold
                                ">

                                    {request.hospital}

                                </p>

                            </div>






                            <div className="
                            rounded-xl
                            bg-slate-50
                            p-4
                            ">

                                <p className="
                                text-sm
                                text-slate-500
                                ">

                                    Location

                                </p>


                                <p className="
                                mt-1
                                font-semibold
                                ">

                                    📍 {request.location}

                                </p>

                            </div>



                        </div>


                    </div>


                }









                {/* SMART RECOMMENDED DONORS */}


                <div className="
                mt-8
                rounded-2xl
                border
                border-emerald-200
                bg-white
                p-6
                shadow
                ">



                    <div>


                        <h1 className="
                        text-3xl
                        font-bold
                        text-slate-900
                        ">

                            🤖 Smart Recommended Donors

                        </h1>



                        <p className="
                        mt-2
                        text-slate-500
                        ">

                            Ranked using blood compatibility, location, eligibility,
                            availability, urgency and donation reliability.

                        </p>


                    </div>








                    {
                        recommendedDonors.length === 0 ?


                        (

                            <div className="
                            mt-6
                            rounded-xl
                            bg-slate-50
                            p-5
                            text-slate-500
                            ">

                                No recommended donors found.

                            </div>

                        )


                        :


                        (

                            <div className="
                            mt-6
                            space-y-5
                            ">


                                {
                                    recommendedDonors.map(
                                        (
                                            donor,
                                            index
                                        )=>{


                                            const matchPercentage =
                                                getMatchPercentage(
                                                    donor.score
                                                );



                                            const reliability =
                                                getReliabilityLabel(
                                                    donor
                                                );



                                            const isAccepting =
                                                acceptingRecommendedId ===
                                                donor.donorId;



                                            return(


                                                <div

                                                key={
                                                    donor.donorId
                                                }

                                                className="
                                                rounded-2xl
                                                border
                                                border-emerald-200
                                                bg-emerald-50
                                                p-6
                                                "

                                                >






                                                    <div className="
                                                    flex
                                                    flex-wrap
                                                    items-start
                                                    justify-between
                                                    gap-4
                                                    ">




                                                        <div>


                                                            <h2 className="
                                                            text-2xl
                                                            font-bold
                                                            text-slate-900
                                                            ">

                                                                {
                                                                    getRankEmoji(
                                                                        index
                                                                    )
                                                                }

                                                                {" "}

                                                                {donor.name}

                                                            </h2>





                                                            <p className="
                                                            mt-2
                                                            text-sm
                                                            font-semibold
                                                            text-emerald-700
                                                            ">

                                                                ⭐ {reliability}

                                                            </p>


                                                        </div>






                                                        <div className="
                                                        text-right
                                                        ">


                                                            <p className="
                                                            text-2xl
                                                            font-bold
                                                            text-emerald-700
                                                            ">

                                                                {
                                                                    matchPercentage
                                                                }%

                                                            </p>


                                                            <p className="
                                                            text-xs
                                                            text-slate-500
                                                            ">

                                                                Match Score:
                                                                {" "}
                                                                {donor.score}
                                                                /130

                                                            </p>


                                                        </div>


                                                    </div>








                                                    <div className="
                                                    mt-5
                                                    h-3
                                                    overflow-hidden
                                                    rounded-full
                                                    bg-emerald-100
                                                    ">


                                                        <div

                                                        className="
                                                        h-full
                                                        rounded-full
                                                        bg-emerald-600
                                                        transition-all
                                                        "

                                                        style={{
                                                            width:
                                                                `${matchPercentage}%`
                                                        }}

                                                        />


                                                    </div>








                                                    <div className="
                                                    mt-5
                                                    grid
                                                    gap-4
                                                    sm:grid-cols-2
                                                    ">



                                                        <div className="
                                                        rounded-xl
                                                        bg-white
                                                        p-4
                                                        ">


                                                            <p className="
                                                            text-sm
                                                            text-slate-500
                                                            ">

                                                                Blood Group

                                                            </p>


                                                            <p className="
                                                            mt-1
                                                            text-lg
                                                            font-bold
                                                            text-red-600
                                                            ">

                                                                🩸{" "}
                                                                {
                                                                    formatBloodGroup(
                                                                        donor.bloodGroup
                                                                    )
                                                                }

                                                            </p>


                                                        </div>






                                                        <div className="
                                                        rounded-xl
                                                        bg-white
                                                        p-4
                                                        ">


                                                            <p className="
                                                            text-sm
                                                            text-slate-500
                                                            ">

                                                                Location

                                                            </p>


                                                            <p className="
                                                            mt-1
                                                            font-bold
                                                            text-slate-800
                                                            ">

                                                                📍{" "}
                                                                {
                                                                    donor.location ||
                                                                    "Not provided"
                                                                }

                                                            </p>


                                                        </div>


                                                    </div>








                                                    <div className="
                                                    mt-5
                                                    rounded-xl
                                                    bg-white
                                                    p-4
                                                    ">


                                                        <p className="
                                                        font-bold
                                                        text-slate-800
                                                        ">

                                                            Why recommended?

                                                        </p>



                                                        <p className="
                                                        mt-2
                                                        leading-7
                                                        text-slate-600
                                                        ">

                                                            {donor.reason}

                                                        </p>


                                                    </div>








                                                    {
                                                        request?.status === "OPEN"
                                                        &&
                                                        !acceptedExists
                                                        ?


                                                        (

                                                            <button

                                                            onClick={()=>{

                                                                acceptRecommendedDonor(
                                                                    donor
                                                                );

                                                            }}

                                                            disabled={
                                                                isAccepting
                                                            }

                                                            className="
                                                            mt-5
                                                            rounded-xl
                                                            bg-emerald-700
                                                            px-5
                                                            py-3
                                                            font-bold
                                                            text-white
                                                            transition
                                                            hover:bg-emerald-800
                                                            disabled:cursor-not-allowed
                                                            disabled:opacity-50
                                                            "

                                                            >


                                                                {
                                                                    isAccepting
                                                                    ?
                                                                    "Accepting..."
                                                                    :
                                                                    "✅ Accept Recommended Donor"
                                                                }


                                                            </button>


                                                        )


                                                        :


                                                        (

                                                            <div className="
                                                            mt-5
                                                            inline-block
                                                            rounded-xl
                                                            bg-slate-200
                                                            px-4
                                                            py-3
                                                            text-sm
                                                            font-semibold
                                                            text-slate-600
                                                            ">

                                                                {
                                                                    acceptedExists
                                                                    ?
                                                                    "A donor has already been selected"
                                                                    :
                                                                    "This request is no longer open"
                                                                }

                                                            </div>

                                                        )

                                                    }





                                                </div>


                                            );


                                        }
                                    )
                                }


                            </div>

                        )

                    }



                </div>









                {/* INTERESTED DONORS */}


                <div className="
                mt-8
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-6
                shadow
                ">



                    <h1 className="
                    text-3xl
                    font-bold
                    text-slate-900
                    ">

                        Interested Donors

                    </h1>



                    <p className="
                    mt-2
                    text-slate-500
                    ">

                        Donors who manually expressed interest in this blood request.

                    </p>








                    {
                        donors.length===0 ?


                        (

                            <div className="
                            mt-6
                            rounded-xl
                            bg-slate-50
                            p-5
                            text-slate-500
                            ">

                                No donors yet.

                            </div>

                        )


                        :


                        (

                            <div className="
                            mt-6
                            space-y-5
                            ">


                                {
                                    donors.map(
                                        (donor)=>(



                                            <div

                                            key={donor.id}

                                            className="
                                            rounded-xl
                                            border
                                            border-slate-200
                                            p-5
                                            "

                                            >





                                                <div className="
                                                flex
                                                flex-wrap
                                                items-start
                                                justify-between
                                                gap-3
                                                ">


                                                    <div>


                                                        <h2 className="
                                                        text-xl
                                                        font-bold
                                                        text-slate-900
                                                        ">

                                                            {donor.donorName}

                                                        </h2>



                                                        <p className="
                                                        mt-2
                                                        text-sm
                                                        text-slate-600
                                                        ">

                                                            Email:
                                                            {" "}
                                                            {
                                                                donor.donorEmail ||
                                                                "Not provided"
                                                            }

                                                        </p>



                                                        <p className="
                                                        mt-1
                                                        text-sm
                                                        text-slate-600
                                                        ">

                                                            Phone:
                                                            {" "}
                                                            {
                                                                donor.donorPhone ||
                                                                "Not provided"
                                                            }

                                                        </p>


                                                    </div>






                                                    <span className={`
                                                    rounded-full
                                                    px-3
                                                    py-1
                                                    text-sm
                                                    font-bold

                                                    ${
                                                        donor.status ===
                                                        "ACCEPTED"

                                                        ?

                                                        "bg-green-100 text-green-700"

                                                        :

                                                        donor.status ===
                                                        "COMPLETED"

                                                        ?

                                                        "bg-blue-100 text-blue-700"

                                                        :

                                                        donor.status ===
                                                        "REJECTED"

                                                        ?

                                                        "bg-red-100 text-red-700"

                                                        :

                                                        "bg-yellow-100 text-yellow-700"
                                                    }
                                                    `}>

                                                        {donor.status}

                                                    </span>


                                                </div>








                                                <div className="
                                                mt-5
                                                flex
                                                flex-wrap
                                                gap-3
                                                ">






                                                    {
                                                        donor.status === "PENDING"
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
                                                        font-semibold
                                                        text-white
                                                        hover:bg-green-700
                                                        "

                                                        >

                                                            ✅ Accept

                                                        </button>


                                                    }







                                                    {
                                                        donor.status === "PENDING"
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
                                                        donor.status === "PENDING"
                                                        &&


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
                                                        font-semibold
                                                        text-white
                                                        hover:bg-red-700
                                                        "

                                                        >

                                                            ❌ Reject

                                                        </button>


                                                    }







                                                    {
                                                        donor.status === "ACCEPTED"
                                                        &&


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
                                                        font-semibold
                                                        text-white
                                                        hover:bg-blue-700
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
                                                    font-semibold
                                                    text-white
                                                    hover:bg-emerald-800
                                                    "

                                                    >

                                                        💬 Chat

                                                    </button>




                                                </div>


                                            </div>


                                        )
                                    )
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