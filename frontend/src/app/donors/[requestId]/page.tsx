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









// Phase 4.3

type DonorProfile = {


    id:number;


    name:string;


    bloodGroup:string;


    location:string;


    availableForDonation:boolean;


    lastDonationDate:string;


    completedDonations:number;


    reliabilityScore:number;


    reliabilityLevel:string;


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









    // Phase 4.3

    const [selectedProfile,setSelectedProfile] =

        useState<DonorProfile | null>(null);












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



                setRecommendedDonors(data);



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













    // Phase 4.3
    // Load donor public profile


    async function viewDonorProfile(

        donorId:number

    ){



        try{



            const response =

                await fetch(

`${API_URL}/api/users/donor-profile/${donorId}`

                );








            if(!response.ok){



                throw new Error(

                    "Failed to load donor profile"

                );



            }








            const data =

                await response.json();








            setSelectedProfile(data);





        }

        catch(error){



            console.log(error);



            alert(

                "Unable to load donor profile"

            );



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









            const existingResponse =

                donors.find(

                    item =>

                    item.donorId ===

                    donor.donorId

                );









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

                    "This donor was previously rejected"

                );


                return;


            }









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



                        <h1 className="
                        text-3xl
                        font-bold
                        ">

                            🩸 Blood Request

                        </h1>





                        <p className="
                        mt-3
                        text-slate-600
                        ">

                            Patient:

                            <b className="ml-2">

                                {request.patientName}

                            </b>

                        </p>





                        <p className="
                        mt-2
                        text-red-600
                        font-bold
                        ">

                            🩸

                            {

                            formatBloodGroup(

                                request.bloodGroup

                            )

                            }

                        </p>






                        <p className="
                        mt-2
                        ">

                            🏥

                            <b className="ml-2">

                                {request.hospital}

                            </b>

                        </p>






                        <p className="
                        mt-2
                        ">

                            📍

                            <b className="ml-2">

                                {request.location}

                            </b>

                        </p>




                    </div>


                }









                <div className="
                mt-8
                rounded-2xl
                border
                border-emerald-200
                bg-white
                p-6
                shadow
                ">




                    <h1 className="
                    text-3xl
                    font-bold
                    ">

                        🤖 Smart Recommended Donors

                    </h1>







                    <p className="
                    mt-2
                    text-slate-500
                    ">

                        Ranked donors based on compatibility,
                        location and reliability.

                    </p>







                    <div className="
                    mt-6
                    space-y-5
                    ">


                    {

                    recommendedDonors.map(

                    (donor,index)=>{


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

                    key={donor.donorId}

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
                        justify-between
                        ">



                            <div>


                                <h2 className="
                                text-2xl
                                font-bold
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
                                text-emerald-700
                                font-semibold
                                ">

                                    ⭐ {reliability}

                                </p>


                            </div>







                            <div>


                                <p className="
                                text-2xl
                                font-bold
                                text-emerald-700
                                ">

                                    {matchPercentage}%

                                </p>


                                <p className="
                                text-sm
                                text-gray-500
                                ">

                                    {donor.score}/130

                                </p>


                            </div>



                        </div>









                        <div className="
                        mt-5
                        grid
                        gap-4
                        md:grid-cols-2
                        ">



                            <p>

                                🩸

                                <b className="ml-2">

                                {

                                formatBloodGroup(

                                    donor.bloodGroup

                                )

                                }

                                </b>


                            </p>





                            <p>

                                📍

                                <b className="ml-2">

                                    {donor.location}

                                </b>


                            </p>


                        </div>









                        <button

                        onClick={()=>{


                            viewDonorProfile(

                                donor.donorId

                            );


                        }}


                        className="
                        mt-5
                        rounded-xl
                        bg-blue-600
                        px-5
                        py-3
                        font-bold
                        text-white
                        hover:bg-blue-700
                        "

                        >

                            👤 View Profile

                        </button>







                        {

                        request?.status === "OPEN"

                        &&

                        !acceptedExists

                        &&


                        (

                        <button

                        onClick={()=>{


                            acceptRecommendedDonor(

                                donor

                            );


                        }}


                        disabled={isAccepting}


                        className="
                        ml-3
                        mt-5
                        rounded-xl
                        bg-emerald-700
                        px-5
                        py-3
                        font-bold
                        text-white
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


                        }





                    </div>


                    );


                    }

                    )

                    }



                    </div>






                </div>
                




                {/* DONOR PROFILE VIEW */}


                {

                selectedProfile &&


                (

                <div className="
                mt-8
                rounded-2xl
                border
                border-blue-200
                bg-blue-50
                p-6
                shadow
                ">



                    <div className="
                    flex
                    items-center
                    justify-between
                    ">



                        <h1 className="
                        text-2xl
                        font-bold
                        text-slate-900
                        ">

                            👤 Donor Profile

                        </h1>





                        <button

                        onClick={()=>{

                            setSelectedProfile(null);

                        }}

                        className="
                        font-bold
                        text-red-600
                        "

                        >

                            ✕


                        </button>


                    </div>









                    <div className="
                    mt-6
                    grid
                    gap-4
                    md:grid-cols-2
                    ">



                        <div className="
                        rounded-xl
                        bg-white
                        p-4
                        ">


                            <p className="text-sm text-gray-500">

                                Name

                            </p>


                            <p className="font-bold">

                                👤 {selectedProfile.name}

                            </p>


                        </div>







                        <div className="
                        rounded-xl
                        bg-white
                        p-4
                        ">


                            <p className="text-sm text-gray-500">

                                Blood Group

                            </p>


                            <p className="
                            font-bold
                            text-red-600
                            ">

                                🩸 {selectedProfile.bloodGroup}

                            </p>


                        </div>







                        <div className="
                        rounded-xl
                        bg-white
                        p-4
                        ">


                            <p className="text-sm text-gray-500">

                                Location

                            </p>


                            <p className="font-bold">

                                📍 {selectedProfile.location}

                            </p>


                        </div>







                        <div className="
                        rounded-xl
                        bg-white
                        p-4
                        ">


                            <p className="text-sm text-gray-500">

                                Availability

                            </p>


                            <p className="font-bold">

                                {

                                selectedProfile.availableForDonation

                                ?

                                "🟢 Available"

                                :

                                "🔴 Not Available"

                                }

                            </p>


                        </div>







                        <div className="
                        rounded-xl
                        bg-white
                        p-4
                        ">


                            <p className="text-sm text-gray-500">

                                Completed Donations

                            </p>


                            <p className="font-bold">

                                ❤️ {selectedProfile.completedDonations}

                            </p>


                        </div>







                        <div className="
                        rounded-xl
                        bg-white
                        p-4
                        ">


                            <p className="text-sm text-gray-500">

                                Reliability Score

                            </p>


                            <p className="font-bold">

                                ⭐ {selectedProfile.reliabilityScore}/20

                            </p>


                        </div>







                        <div className="
                        rounded-xl
                        bg-white
                        p-4
                        ">


                            <p className="text-sm text-gray-500">

                                Reliability Level

                            </p>


                            <p className="font-bold text-emerald-700">

                                🏆 {selectedProfile.reliabilityLevel}

                            </p>


                        </div>







                        <div className="
                        rounded-xl
                        bg-white
                        p-4
                        ">


                            <p className="text-sm text-gray-500">

                                Last Donation

                            </p>


                            <p className="font-bold">

                                📅

                                {" "}

                                {

                                selectedProfile.lastDonationDate

                                ||

                                "No record"

                                }

                            </p>


                        </div>





                    </div>


                </div>


                )

                }












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
                    ">

                        Interested Donors

                    </h1>







                    {

                    donors.length === 0 ?


                    (

                    <div className="
                    mt-5
                    rounded-xl
                    bg-slate-50
                    p-5
                    text-gray-500
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
                    p-5
                    ">



                        <div className="
                        flex
                        justify-between
                        ">


                            <div>


                                <h2 className="
                                text-xl
                                font-bold
                                ">

                                    {donor.donorName}

                                </h2>



                                <p className="
                                mt-2
                                text-gray-600
                                ">

                                    📧 {donor.donorEmail || "Not provided"}

                                </p>



                                <p className="
                                text-gray-600
                                ">

                                    📞 {donor.donorPhone || "Not provided"}

                                </p>


                            </div>






                            <span className="
                            rounded-full
                            bg-yellow-100
                            px-4
                            py-2
                            font-bold
                            text-yellow-700
                            ">

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
                            font-bold
                            text-white
                            "

                            >

                                ✅ Accept

                            </button>


                            }









                            {

                            donor.status==="PENDING"

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
                            font-bold
                            text-white
                            "

                            >

                                ❌ Reject

                            </button>


                            }









                            {

                            donor.status==="ACCEPTED"

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
                            font-bold
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
                            font-bold
                            text-white
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