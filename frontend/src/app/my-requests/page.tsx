"use client";


import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Navbar from "@/components/Navbar";
import toast from "react-hot-toast";





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


    requiredDate:string;





    donorId?:number;


    donorName?:string;


    donorBloodGroup?:string;


    donorLocation?:string;





    // Phase 4.1

    donationResponseId?:number;



};












export default function MyRequestsPage(){



    const router = useRouter();








    const [requests,setRequests] =

        useState<BloodRequest[]>([]);







    const [loading,setLoading] =

        useState(true);







    const [user,setUser] =

        useState<any>(null);













    useEffect(()=>{



        const savedUser =

            localStorage.getItem("user");








        if(savedUser){



            const parsedUser =

                JSON.parse(savedUser);






            setUser(parsedUser);







            loadRequests(

                parsedUser.id

            );



        }




    },[]);













    async function loadRequests(


        userId:number


    ){



        try{



            setLoading(true);







            const response =

                await fetch(

`${API_URL}/api/blood-requests/user/${userId}`

                );







            if(!response.ok){


                throw new Error(

                    "Failed to load requests"

                );


            }








            const data =

                await response.json();








            setRequests(data);






        }

        catch(error){



            console.log(error);



            toast.error(

                "Failed to load requests"

            );



        }

        finally{


            setLoading(false);


        }



    }













    async function cancelRequest(


        requestId:number


    ){



        if(!user){


            return;


        }








        const confirmCancel =

            window.confirm(

                "Are you sure you want to cancel this request?"

            );







        if(!confirmCancel){


            return;


        }









        try{



            const response =

                await fetch(

`${API_URL}/api/blood-requests/${requestId}/user/${user.id}`,

                    {


                        method:"DELETE"


                    }


                );








            if(!response.ok){


                throw new Error(

                    "Cancel failed"

                );


            }









            toast.success(

                "Blood request cancelled"

            );







            loadRequests(

                user.id

            );





        }

        catch(error){



            console.log(error);



            toast.error(

                "Something went wrong"

            );



        }



    }
    








    // ==================================================
    // PHASE 4.1
    // Requester confirms donation completion
    // ==================================================


    async function confirmDonationCompleted(

        donationResponseId:number

    ){



        if(!user){


            return;


        }








        const confirmAction =

            window.confirm(

                "Confirm that blood donation has been completed?"

            );








        if(!confirmAction){


            return;


        }









        try{



            const response =

                await fetch(

`${API_URL}/api/donation-response/${donationResponseId}/complete?requesterId=${user.id}`,

                    {

                        method:"PUT"

                    }

                );









            if(!response.ok){


                throw new Error(

                    "Completion failed"

                );


            }









            toast.success(

                "Donation completed successfully"

            );









            loadRequests(

                user.id

            );






        }

        catch(error){



            console.log(error);



            toast.error(

                "Failed to complete donation"

            );


        }



    }













    // ==================================================
    // Phase 4.2
    // Status color handling
    // ==================================================


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







        return "bg-red-100 text-red-700";


    }













    function showTimeline(

        status:string

    ){



        return (



            <div className="
            mt-5
            space-y-3
            text-sm
            ">








                <div

                className={

                status==="OPEN"

                ?

                "text-green-600 font-bold"

                :

                "text-gray-400"

                }

                >

                    🟢 Request Created

                </div>








                <div

                className={

                status==="DONOR_FOUND"

                ||

                status==="FULFILLED"

                ?

                "text-blue-600 font-bold"

                :

                "text-gray-400"

                }

                >

                    🔵 Donor Found

                </div>








                <div

                className={

                status==="FULFILLED"

                ?

                "text-gray-700 font-bold"

                :

                "text-gray-400"

                }

                >

                    ✅ Donation Completed

                </div>








                <div

                className={

                status==="EXPIRED"

                ?

                "text-red-600 font-bold"

                :

                "text-gray-400"

                }

                >

                    ❌ Request Expired

                </div>






            </div>


        );


    }













    function showDonorInfo(

        request:BloodRequest

    ){



        if(

            request.status !== "DONOR_FOUND"

            &&

            request.status !== "FULFILLED"

        ){


            return null;


        }








        if(!request.donorName){


            return null;


        }









        return (



            <div className="
            mt-6
            rounded-2xl
            border
            border-emerald-200
            bg-emerald-50
            p-5
            ">






                <h3 className="
                text-lg
                font-bold
                text-emerald-800
                ">

                    🤝 Selected Donor

                </h3>








                <div className="
                mt-3
                space-y-2
                text-slate-700
                ">







                    <p>

                        👤 Name:

                        <b className="ml-2">

                            {request.donorName}

                        </b>


                    </p>








                    <p>

                        🩸 Blood Group:

                        <b className="ml-2">

                            {request.donorBloodGroup}

                        </b>


                    </p>








                    <p>

                        📍 Location:

                        <b className="ml-2">

                            {request.donorLocation}

                        </b>


                    </p>






                </div>






            </div>


        );


    }













    return(



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







                <div className="
                rounded-3xl
                bg-white
                p-8
                shadow
                ">






                    <h1 className="
                    text-3xl
                    font-bold
                    ">

                        🩸 My Blood Requests

                    </h1>







                    <p className="
                    mt-2
                    text-slate-500
                    ">

                        Manage your created blood requests

                    </p>








                    {
                    
                    loading

                    ?

                    (

                    <p className="
                    mt-8
                    ">

                        Loading...

                    </p>


                    )

                    :

                    requests.length === 0

                    ?

                    (

                    <p className="
                    mt-8
                    text-gray-500
                    ">

                        You have no blood requests.

                    </p>


                    )

                    :



                    <div className="
                    mt-8
                    space-y-5
                    ">                    {


                    requests.map(

                    (request)=>(



                    <div

                    key={request.id}

                    className="
                    rounded-2xl
                    border
                    border-slate-200
                    p-6
                    ">









                        <div className="
                        flex
                        items-start
                        justify-between
                        ">






                            <div>



                                <h2 className="
                                text-xl
                                font-bold
                                ">


                                    {request.patientName}


                                </h2>








                                <p className="
                                mt-2
                                font-bold
                                text-red-600
                                ">


                                    🩸 {request.bloodGroup}


                                </p>






                            </div>








                            <span

                            className={`

                            rounded-full

                            px-4

                            py-2

                            text-sm

                            font-semibold

                            ${getStatusStyle(

                                request.status

                            )}

                            `}

                            >

                                {request.status}


                            </span>





                        </div>













                        {

                        showTimeline(

                            request.status

                        )

                        }













                        <div className="
                        mt-5
                        space-y-2
                        text-slate-600
                        ">







                            <p>


                                🏥 Hospital:

                                <b className="ml-2">

                                    {request.hospital}

                                </b>


                            </p>








                            <p>


                                📍 Location:

                                <b className="ml-2">

                                    {request.location}

                                </b>


                            </p>








                            <p>


                                ⚠️ Urgency:

                                <b className="ml-2">

                                    {request.urgency}

                                </b>


                            </p>








                            <p>


                                🩸 Units:

                                <b className="ml-2">

                                    {request.unitsNeeded}

                                </b>


                            </p>








                            <p>


                                📅 Required Date:

                                <b className="ml-2">

                                    {request.requiredDate}

                                </b>


                            </p>





                        </div>












                        {


                        showDonorInfo(

                            request

                        )


                        }













                        <div className="
                        mt-6
                        flex
                        flex-wrap
                        gap-3
                        ">









                            {/* Phase 4.4 */}

                            <button


                            onClick={()=>{


                                router.push(

                                    `/request-details/${request.id}`

                                );


                            }}



                            className="
                            rounded-xl
                            bg-blue-600
                            px-5
                            py-3
                            font-semibold
                            text-white
                            hover:bg-blue-700
                            "


                            >

                                📄 View Details


                            </button>














                            {


                            request.status !== "EXPIRED"

                            &&


                            (

                            <button


                            onClick={()=>{


                                router.push(

                                    `/donors/${request.id}`

                                );


                            }}



                            className="
                            rounded-xl
                            bg-emerald-700
                            px-5
                            py-3
                            font-semibold
                            text-white
                            hover:bg-emerald-800
                            "


                            >

                                👥 Manage Donors


                            </button>


                            )


                            }














                            {


                            request.status === "DONOR_FOUND"

                            &&

                            request.donationResponseId

                            &&


                            (

                            <button


                            onClick={()=>{


                                confirmDonationCompleted(

                                    request.donationResponseId!

                                );


                            }}



                            className="
                            rounded-xl
                            bg-blue-600
                            px-5
                            py-3
                            font-semibold
                            text-white
                            hover:bg-blue-700
                            "


                            >

                                ✅ Confirm Donation Completed


                            </button>


                            )


                            }














                            {


                            request.status !== "FULFILLED"

                            &&

                            request.status !== "CANCELLED"

                            &&

                            request.status !== "EXPIRED"

                            &&


                            (

                            <button


                            onClick={()=>{


                                cancelRequest(

                                    request.id

                                );


                            }}



                            className="
                            rounded-xl
                            bg-red-600
                            px-5
                            py-3
                            font-semibold
                            text-white
                            hover:bg-red-700
                            "


                            >

                                ❌ Cancel


                            </button>


                            )


                            }














                            {


                            request.status === "FULFILLED"

                            &&


                            (

                            <span className="
                            rounded-xl
                            bg-gray-100
                            px-5
                            py-3
                            font-semibold
                            text-gray-700
                            ">


                                ✅ Completed


                            </span>


                            )


                            }













                            {


                            request.status === "EXPIRED"

                            &&


                            (

                            <span className="
                            rounded-xl
                            bg-red-100
                            px-5
                            py-3
                            font-semibold
                            text-red-700
                            ">


                                ❌ Expired


                            </span>


                            )


                            }









                        </div>









                    </div>



                    )


                    )


                    }



                    </div>


                    }





                </div>






            </div>






        </main>


    );


}