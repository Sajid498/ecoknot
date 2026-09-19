"use client";


import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";





const API_URL =

    process.env.NEXT_PUBLIC_API_URL ||

    "http://localhost:8080";









type BloodRequest = {


    id:number;


    patientName:string;


    bloodGroup:string;


    hospital:string;


    location:string;


    contactNumber:string;


    requiredDate:string;


    unitsNeeded:number;


    urgency:string;


    description:string;


    status:string;



    donorId?:number;


    donorName?:string;


    donorBloodGroup?:string;


    donorLocation?:string;


    donationResponseId?:number;


};









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












export default function RequestDetailsPage(){



    const params = useParams();



    const requestId =

        String(params.id);







    const [request,setRequest] =

        useState<BloodRequest | null>(null);







    const [donorProfile,setDonorProfile] =

        useState<DonorProfile | null>(null);







    const [loading,setLoading] =

        useState(true);









    useEffect(()=>{


        if(requestId){


            loadRequestDetails();


        }


    },[requestId]);












    async function loadRequestDetails(){



        try{



            setLoading(true);





            const response =

                await fetch(

`${API_URL}/api/blood-requests/${requestId}`

                );







            if(!response.ok){


                throw new Error(

                    "Failed to load request"

                );


            }







            const data =

                await response.json();







            setRequest(data);







            if(data.donorId){



                loadDonorProfile(

                    data.donorId

                );


            }





        }

        catch(error){



            console.log(error);



        }

        finally{


            setLoading(false);


        }



    }













    async function loadDonorProfile(

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







            setDonorProfile(data);





        }

        catch(error){



            console.log(error);



        }



    }












    function getStatusStyle(

        status:string

    ){



        if(status==="OPEN"){



            return "bg-green-100 text-green-700";


        }






        if(status==="DONOR_FOUND"){



            return "bg-blue-100 text-blue-700";


        }







        if(status==="FULFILLED"){



            return "bg-gray-100 text-gray-700";


        }







        if(status==="EXPIRED"){



            return "bg-red-100 text-red-700";


        }






        return "bg-gray-100 text-gray-700";


    }













    function showBloodGroup(

        value:string

    ){



        if(!value){


            return "N/A";


        }







        return value

            .replace(

                "_POSITIVE",

                "+"

            )

            .replace(

                "_NEGATIVE",

                "-"

            );


    }













    function statusTimeline(){



        if(!request){


            return null;


        }






        return (

            <div className="
            mt-6
            space-y-3
            ">



                <p className="

                text-green-600

                font-bold

                ">

                    🟢 Request Created

                </p>






                {

                request.status === "DONOR_FOUND"

                ||

                request.status === "FULFILLED"

                ?

                (

                <p className="

                text-blue-600

                font-bold

                ">

                    🔵 Donor Found

                </p>

                )

                :

                null

                }







                {

                request.status === "FULFILLED"

                ?

                (

                <p className="

                text-gray-700

                font-bold

                ">

                    ✅ Donation Completed

                </p>

                )

                :

                null

                }







                {

                request.status === "EXPIRED"

                ?

                (

                <p className="

                text-red-600

                font-bold

                ">

                    ❌ Request Expired

                </p>

                )

                :

                null

                }





            </div>

        );


    }
    



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

            loading

            ?

            (

                <div className="
                rounded-2xl
                bg-white
                p-8
                shadow
                ">


                    <p className="
                    text-center
                    text-gray-500
                    ">

                        Loading request details...

                    </p>


                </div>

            )

            :



            request &&



            (



            <div className="
            space-y-6
            ">









                {/* REQUEST HEADER */}


                <div className="
                rounded-3xl
                bg-white
                p-8
                shadow
                ">





                    <div className="
                    flex
                    flex-wrap
                    items-center
                    justify-between
                    gap-4
                    ">





                        <div>


                            <h1 className="
                            text-3xl
                            font-bold
                            ">

                                🩸 Blood Request Details

                            </h1>





                            <p className="
                            mt-2
                            text-gray-500
                            ">

                                Complete information about this blood request

                            </p>


                        </div>








                        <span

                        className={`

                        rounded-full

                        px-5

                        py-2

                        font-bold

                        ${getStatusStyle(

                            request.status

                        )}

                        `}

                        >

                            {request.status}

                        </span>





                    </div>






                </div>













                {/* PATIENT INFORMATION */}



                <div className="
                rounded-3xl
                bg-white
                p-8
                shadow
                ">




                    <h2 className="
                    text-2xl
                    font-bold
                    ">

                        👤 Patient Information

                    </h2>








                    <div className="
                    mt-6
                    grid
                    gap-5
                    md:grid-cols-2
                    ">







                        <div className="
                        rounded-xl
                        bg-slate-50
                        p-5
                        ">


                            <p className="
                            text-sm
                            text-gray-500
                            ">

                                Patient Name

                            </p>



                            <p className="
                            mt-1
                            font-bold
                            ">

                                {request.patientName}

                            </p>



                        </div>









                        <div className="
                        rounded-xl
                        bg-red-50
                        p-5
                        ">


                            <p className="
                            text-sm
                            text-gray-500
                            ">

                                Blood Group

                            </p>



                            <p className="
                            mt-1
                            font-bold
                            text-red-600
                            ">

                                🩸

                                {" "}

                                {

                                showBloodGroup(

                                    request.bloodGroup

                                )

                                }


                            </p>



                        </div>








                        <div className="
                        rounded-xl
                        bg-slate-50
                        p-5
                        ">


                            <p className="
                            text-sm
                            text-gray-500
                            ">

                                Hospital

                            </p>



                            <p className="
                            mt-1
                            font-bold
                            ">

                                🏥 {request.hospital}

                            </p>



                        </div>









                        <div className="
                        rounded-xl
                        bg-slate-50
                        p-5
                        ">


                            <p className="
                            text-sm
                            text-gray-500
                            ">

                                Location

                            </p>



                            <p className="
                            mt-1
                            font-bold
                            ">

                                📍 {request.location}

                            </p>



                        </div>









                        <div className="
                        rounded-xl
                        bg-slate-50
                        p-5
                        ">


                            <p className="
                            text-sm
                            text-gray-500
                            ">

                                Contact Number

                            </p>



                            <p className="
                            mt-1
                            font-bold
                            ">

                                📞 {request.contactNumber}

                            </p>



                        </div>









                        <div className="
                        rounded-xl
                        bg-slate-50
                        p-5
                        ">


                            <p className="
                            text-sm
                            text-gray-500
                            ">

                                Required Date

                            </p>



                            <p className="
                            mt-1
                            font-bold
                            ">

                                📅 {request.requiredDate}

                            </p>



                        </div>









                        <div className="
                        rounded-xl
                        bg-slate-50
                        p-5
                        ">


                            <p className="
                            text-sm
                            text-gray-500
                            ">

                                Units Needed

                            </p>



                            <p className="
                            mt-1
                            font-bold
                            ">

                                🩸 {request.unitsNeeded} Units

                            </p>



                        </div>









                        <div className="
                        rounded-xl
                        bg-orange-50
                        p-5
                        ">


                            <p className="
                            text-sm
                            text-gray-500
                            ">

                                Urgency

                            </p>



                            <p className="
                            mt-1
                            font-bold
                            text-orange-600
                            ">

                                ⚠️ {request.urgency}

                            </p>



                        </div>





                    </div>





                </div>












                {/* DESCRIPTION */}



                <div className="
                rounded-3xl
                bg-white
                p-8
                shadow
                ">



                    <h2 className="
                    text-2xl
                    font-bold
                    ">

                        📝 Description

                    </h2>





                    <p className="
                    mt-4
                    text-gray-600
                    ">

                        {

                        request.description

                        ||

                        "No description provided"

                        }

                    </p>



                </div>












                {/* STATUS TIMELINE */}



                <div className="
                rounded-3xl
                bg-white
                p-8
                shadow
                ">




                    <h2 className="
                    text-2xl
                    font-bold
                    ">

                        📌 Donation Progress

                    </h2>





                    {

                    statusTimeline()

                    }





                </div>
                







                {/* ACCEPTED DONOR SECTION */}



                {

                request.donorId

                ?

                (

                <div className="
                rounded-3xl
                bg-white
                p-8
                shadow
                ">




                    <h2 className="
                    text-2xl
                    font-bold
                    ">

                        🤝 Accepted Donor

                    </h2>







                    <div className="
                    mt-6
                    grid
                    gap-5
                    md:grid-cols-2
                    ">








                        <div className="
                        rounded-xl
                        bg-emerald-50
                        p-5
                        ">


                            <p className="
                            text-sm
                            text-gray-500
                            ">

                                Donor Name

                            </p>



                            <p className="
                            mt-2
                            font-bold
                            text-xl
                            ">

                                👤

                                {

                                request.donorName

                                }

                            </p>



                        </div>









                        <div className="
                        rounded-xl
                        bg-red-50
                        p-5
                        ">


                            <p className="
                            text-sm
                            text-gray-500
                            ">

                                Blood Group

                            </p>



                            <p className="
                            mt-2
                            font-bold
                            text-red-600
                            ">

                                🩸

                                {

                                showBloodGroup(

                                    request.donorBloodGroup ||

                                    ""

                                )

                                }

                            </p>



                        </div>









                        <div className="
                        rounded-xl
                        bg-slate-50
                        p-5
                        ">


                            <p className="
                            text-sm
                            text-gray-500
                            ">

                                Location

                            </p>



                            <p className="
                            mt-2
                            font-bold
                            ">

                                📍

                                {

                                request.donorLocation

                                }

                            </p>



                        </div>








                        <div className="
                        rounded-xl
                        bg-slate-50
                        p-5
                        ">


                            <p className="
                            text-sm
                            text-gray-500
                            ">

                                Donation Response ID

                            </p>



                            <p className="
                            mt-2
                            font-bold
                            ">

                                #

                                {

                                request.donationResponseId

                                ||

                                "N/A"

                                }

                            </p>



                        </div>






                    </div>









                    {/* RELIABILITY VIEW */}



                    {

                    donorProfile

                    &&


                    (

                    <div className="
                    mt-8
                    rounded-2xl
                    border
                    border-blue-200
                    bg-blue-50
                    p-6
                    ">





                        <h3 className="
                        text-xl
                        font-bold
                        ">

                            ⭐ Donor Reliability

                        </h3>






                        <div className="
                        mt-5
                        grid
                        gap-4
                        md:grid-cols-3
                        ">






                            <div className="
                            rounded-xl
                            bg-white
                            p-4
                            ">


                                <p className="
                                text-sm
                                text-gray-500
                                ">

                                    Completed Donations

                                </p>



                                <p className="
                                mt-2
                                font-bold
                                ">

                                    ❤️

                                    {

                                    donorProfile.completedDonations

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
                                text-gray-500
                                ">

                                    Reliability Score

                                </p>



                                <p className="
                                mt-2
                                font-bold
                                ">

                                    ⭐

                                    {

                                    donorProfile.reliabilityScore

                                    }

                                    /20

                                </p>


                            </div>









                            <div className="
                            rounded-xl
                            bg-white
                            p-4
                            ">


                                <p className="
                                text-sm
                                text-gray-500
                                ">

                                    Level

                                </p>



                                <p className="
                                mt-2
                                font-bold
                                text-emerald-700
                                ">


                                    🏆

                                    {

                                    donorProfile.reliabilityLevel

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
                            text-sm
                            text-gray-500
                            ">

                                Last Donation Date

                            </p>



                            <p className="
                            mt-2
                            font-bold
                            ">


                                📅

                                {

                                donorProfile.lastDonationDate

                                ||

                                "No record"

                                }


                            </p>


                        </div>






                    </div>


                    )

                    }





                </div>


                )



                :



                (

                <div className="
                rounded-3xl
                bg-white
                p-8
                text-center
                shadow
                ">



                    <h2 className="
                    text-xl
                    font-bold
                    ">

                        🤍 Waiting for Donor

                    </h2>





                    <p className="
                    mt-2
                    text-gray-500
                    ">

                        No donor has accepted this request yet.

                    </p>




                </div>


                )

                }












            </div>



            )

            }



            </div>




        </main>


    </ProtectedRoute>


    );


}