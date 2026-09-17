"use client";


import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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

    userId:number;

};





type DonationResponse = {

    id:number;

    requestId:number;

    donorId:number;

    donorName:string;

    donorEmail:string;

    donorPhone:string;

    status:string;

};







export default function BloodRequestDetailsPage(){



    const params = useParams();

    const router = useRouter();



    const requestId =
        Number(params.requestId);




    const [request,setRequest] =
        useState<BloodRequest | null>(null);



    const [user,setUser] =
        useState<any>(null);



    const [myDonation,setMyDonation] =
        useState<DonationResponse | null>(null);



    const [donors,setDonors] =
        useState<DonationResponse[]>([]);



    const [loading,setLoading] =
        useState(false);







    useEffect(()=>{


        const savedUser =
            localStorage.getItem("user");


        if(savedUser){

            const userData =
                JSON.parse(savedUser);


            setUser(userData);


        }



        loadRequest();


        loadDonors();



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



        }
        catch(error){


            console.log(error);


        }


    }









    async function checkMyDonation(
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
                            item.requestId===requestId
                    );



                if(found){

                    setMyDonation(found);

                }


            }



        }
        catch(error){


            console.log(error);


        }


    }








    useEffect(()=>{


        if(user){

            checkMyDonation(
                user.id
            );

        }


    },[user]);









    async function donate(){


        if(!user){


            alert(
                "Please login first"
            );


            return;

        }






        try{


            setLoading(true);



            const response =
                await fetch(
                    `${API_URL}/api/donation-response`,
                    {


                        method:"POST",


                        headers:{

                            "Content-Type":
                            "application/json"

                        },


                        body:JSON.stringify({

                            requestId,

                            donorId:user.id,

                            donorName:user.name,

                            donorEmail:user.email,

                            donorPhone:
                            user.phone ||
                            "Not provided"

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



            setMyDonation(data);



            alert(
                "Donation request sent"
            );



            loadDonors();



        }
        catch(error:any){


            alert(
                error.message ||
                "Already applied"
            );


        }
        finally{


            setLoading(false);


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


                throw new Error(
                    "Update failed"
                );


            }




            loadDonors();

            loadRequest();



        }
        catch(error){


            console.log(error);


            alert(
                "Something went wrong"
            );


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








    const isOwner =
        user &&
        user.id === request.userId;









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





                    <div className="
                    flex
                    justify-between
                    ">



                        <div>


                            <span className="
                            rounded-lg
                            bg-red-100
                            px-3
                            py-1
                            font-bold
                            text-red-700
                            ">

                                🩸 {request.bloodGroup}

                            </span>



                            <h1 className="
                            mt-5
                            text-3xl
                            font-bold
                            ">

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

                            {request.status}

                        </span>



                    </div>








                    <div className="
                    mt-8
                    space-y-3
                    text-slate-600
                    ">


                        <p>
                            🏥 Hospital:
                            <b> {request.hospital}</b>
                        </p>


                        <p>
                            📍 Location:
                            <b> {request.location}</b>
                        </p>


                        <p>
                            📅 Date:
                            <b> {request.requiredDate}</b>
                        </p>


                        <p>
                            🩸 Units:
                            <b> {request.unitsNeeded}</b>
                        </p>


                        <p>
                            ⚠️ Urgency:
                            <b> {request.urgency}</b>
                        </p>


                        <p>
                            📞 Contact:
                            <b> {request.contactNumber}</b>
                        </p>


                    </div>








                    {
                        request.description &&

                        <div className="
                        mt-6
                        rounded-xl
                        bg-slate-100
                        p-4
                        ">

                            {request.description}

                        </div>

                    }









                    {
                        !isOwner &&


                        <div className="mt-8">


                            {
                                myDonation ?


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
                                        {myDonation.status}

                                    </p>


                                </div>



                                :


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


                            }



                        </div>

                    }









                    {
                        isOwner &&


                        <div className="mt-10">


                            <h2 className="
                            text-2xl
                            font-bold
                            ">

                                Interested Donors

                            </h2>






                            {
                                donors.length===0 ?


                                <p className="
                                mt-5
                                text-gray-500
                                ">

                                    No donors yet.

                                </p>



                                :



                                donors.map((donor)=>(



                                    <div

                                    key={donor.id}

                                    className="
                                    mt-5
                                    rounded-xl
                                    border
                                    p-5
                                    ">


                                        <h3 className="
                                        text-xl
                                        font-bold
                                        ">

                                            {donor.donorName}

                                        </h3>



                                        <p>
                                            Email:
                                            {donor.donorEmail}
                                        </p>


                                        <p>
                                            Phone:
                                            {donor.donorPhone}
                                        </p>


                                        <p>

                                            Status:
                                            {" "}
                                            {donor.status}

                                        </p>






                                        <div className="
                                        mt-4
                                        flex
                                        gap-3
                                        flex-wrap
                                        ">


                                        {
                                            donor.status==="PENDING" &&

                                            <>


                                            <button

                                            onClick={()=>updateDonationStatus(
                                                donor.id,
                                                "ACCEPTED"
                                            )}

                                            className="
                                            rounded-lg
                                            bg-green-600
                                            px-4
                                            py-2
                                            text-white
                                            "

                                            >

                                                Accept

                                            </button>




                                            <button

                                            onClick={()=>updateDonationStatus(
                                                donor.id,
                                                "REJECTED"
                                            )}

                                            className="
                                            rounded-lg
                                            bg-red-600
                                            px-4
                                            py-2
                                            text-white
                                            "

                                            >

                                                Reject

                                            </button>


                                            </>

                                        }






                                        {
                                            donor.status==="ACCEPTED" &&


                                            <button

                                            onClick={()=>updateDonationStatus(
                                                donor.id,
                                                "COMPLETED"
                                            )}

                                            className="
                                            rounded-lg
                                            bg-blue-600
                                            px-4
                                            py-2
                                            text-white
                                            "

                                            >

                                                Complete Donation

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


                    }





                </div>



            </div>



        </main>


    );


}