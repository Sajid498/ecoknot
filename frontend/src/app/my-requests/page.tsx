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

    requiredDate:string;

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


            loadRequests(parsedUser.id);

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



            const data =
                await response.json();



            setRequests(data);



        }
        catch(error){


            console.log(error);


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




            alert(
                "Blood request cancelled"
            );



            loadRequests(user.id);



        }
        catch(error){


            console.log(error);


            alert(
                "Something went wrong"
            );


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



        return "bg-red-100 text-red-700";


    }









    function showTimeline(
        status:string
    ){



        return (

            <div className="mt-5 flex items-center gap-3 text-sm">


                <span
                className={
                    status==="OPEN"
                    ?
                    "font-bold text-green-600"
                    :
                    "text-gray-400"
                }
                >

                    🟢 Open

                </span>



                <span>
                    →
                </span>




                <span
                className={
                    status==="DONOR_FOUND"
                    ||
                    status==="FULFILLED"
                    ?
                    "font-bold text-blue-600"
                    :
                    "text-gray-400"
                }
                >

                    🔵 Donor Found

                </span>



                <span>
                    →
                </span>




                <span
                className={
                    status==="FULFILLED"
                    ?
                    "font-bold text-gray-700"
                    :
                    "text-gray-400"
                }
                >

                    ⚪ Fulfilled

                </span>



            </div>

        );


    }









    return(


        <main className="min-h-screen bg-slate-50">


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
                        loading ?


                        (

                            <p className="mt-8">

                                Loading...

                            </p>

                        )


                        :


                        requests.length===0 ?


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
                        ">


                            {

                                requests.map(
                                    (request)=>(


                                    <div

                                    key={request.id}

                                    className="
                                    rounded-2xl
                                    border
                                    border-slate-200
                                    p-6
                                    "

                                    >





                                        <div className="
                                        flex
                                        justify-between
                                        items-start
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

                                                🩸 Units:

                                                <b>
                                                    {" "}
                                                    {request.unitsNeeded}
                                                </b>

                                            </p>





                                            <p>

                                                📅 Required:

                                                <b>
                                                    {" "}
                                                    {request.requiredDate}
                                                </b>

                                            </p>



                                        </div>









                                        <div className="
                                        mt-6
                                        flex
                                        flex-wrap
                                        gap-3
                                        ">






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
                                            "

                                            >

                                                👥 Manage Donors

                                            </button>







                                            {
                                                request.status!=="FULFILLED"
                                                &&
                                                request.status!=="CANCELLED"
                                                &&


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
                                                "

                                                >

                                                    ❌ Cancel

                                                </button>

                                            }








                                            {
                                                request.status==="FULFILLED"
                                                &&


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