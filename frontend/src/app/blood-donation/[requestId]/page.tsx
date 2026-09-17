"use client";


import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
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

    contactNumber:string;

    requiredDate:string;

    unitsNeeded:number;

    urgency:string;

    description:string;

    status:string;

};




type DonationResponse = {

    id:number;

    requestId:number;

    donorId:number;

    status:string;

};







export default function BloodRequestDetailsPage(){



    const params = useParams();


    const requestId =
        Number(params.requestId);



    const [request,setRequest] =
        useState<BloodRequest | null>(null);



    const [user,setUser] =
        useState<any>(null);



    const [donation,setDonation] =
        useState<DonationResponse | null>(null);



    const [loading,setLoading] =
        useState(false);







    useEffect(()=>{


        const savedUser =
            localStorage.getItem("user");


        if(savedUser){

            const userData =
                JSON.parse(savedUser);


            setUser(userData);


            checkDonation(
                userData.id
            );

        }



        loadRequest();



    },[]);









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









    async function checkDonation(
        donorId:number
    ){


        try{


            const response =
                await fetch(
                    `${API_URL}/api/donation-response/donor/${donorId}`
                );


            const data =
                await response.json();



            if(Array.isArray(data)){


                const found =
                    data.find(
                        (item:any)=>
                            item.requestId === requestId
                    );


                if(found){

                    setDonation(found);

                }


            }


        }
        catch(error){

            console.log(error);

        }


    }









    async function donate(){


        if(!user){

            alert(
                "Please login first"
            );

            return;

        }




        setLoading(true);



        try{


            const response =
                await fetch(
                    `${API_URL}/api/donation-response`,
                    {


                        method:"POST",


                        headers:{
                            "Content-Type":"application/json"
                        },


                        body:JSON.stringify({


                            requestId:


                                requestId,


                            donorId:


                                user.id,


                            donorName:


                                user.name,


                            donorEmail:


                                user.email,


                            donorPhone:


                                user.phone || "Not provided"


                        })

                    }
                );





            if(!response.ok){


                throw new Error(
                    "Donation failed"
                );

            }




            const data =
                await response.json();



            setDonation(data);



            alert(
                "Donation request sent successfully"
            );



        }
        catch(error){


            alert(
                "You already applied for this request"
            );


        }
        finally{

            setLoading(false);

        }


    }








    if(!request){


        return(

            <>

            <Navbar />

            <p className="p-10">
                Loading...
            </p>


            </>

        );

    }







    return(


        <main className="min-h-screen bg-slate-50">


            <Navbar />



            <div className="mx-auto max-w-4xl px-6 py-10">


                <div className="rounded-3xl bg-white p-8 shadow">



                    <div className="flex justify-between">


                        <div>

                            <span className="
                            rounded-lg
                            bg-red-100
                            px-3
                            py-1
                            font-bold
                            text-red-700
                            ">

                                {request.bloodGroup}

                            </span>



                            <h1 className="mt-5 text-3xl font-bold">

                                {request.patientName}

                            </h1>


                        </div>



                        <span className="
                        rounded-full
                        bg-yellow-100
                        px-4
                        py-2
                        font-semibold
                        text-yellow-700
                        ">

                            {request.urgency}

                        </span>



                    </div>







                    <div className="mt-8 space-y-3">


                        <p>
                            🏥 Hospital:
                            <b> {request.hospital}</b>
                        </p>


                        <p>
                            📍 Location:
                            <b> {request.location}</b>
                        </p>


                        <p>
                            📅 Required Date:
                            <b> {request.requiredDate}</b>
                        </p>


                        <p>
                            🩸 Units Needed:
                            <b> {request.unitsNeeded}</b>
                        </p>


                        <p>
                            📞 Contact:
                            <b> {request.contactNumber}</b>
                        </p>


                        <p>
                            Status:
                            <b className="text-green-600">
                                {" "}
                                {request.status}
                            </b>
                        </p>



                    </div>








                    {
                        request.description &&


                        <div className="mt-6 rounded-xl bg-slate-100 p-4">


                            {request.description}


                        </div>


                    }








                    <div className="mt-8">


                    {
                        donation ?


                        (

                            <div className="
                            rounded-xl
                            bg-green-100
                            p-5
                            text-green-700
                            ">


                                <h2 className="font-bold">

                                    ✅ Donation Sent

                                </h2>


                                <p>

                                    Status:
                                    {" "}
                                    {donation.status}

                                </p>



                            </div>

                        )


                        :


                        (

                            <button

                            onClick={donate}

                            disabled={loading}

                            className="
                            rounded-xl
                            bg-red-600
                            px-6
                            py-3
                            font-semibold
                            text-white
                            disabled:opacity-50
                            "

                            >

                                {
                                    loading
                                    ?
                                    "Sending..."
                                    :
                                    "🩸 I Want To Donate"
                                }

                            </button>

                        )

                    }


                    </div>




                </div>



            </div>



        </main>


    );


}