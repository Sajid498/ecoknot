"use client";


import { useEffect, useState } from "react";

import ProtectedRoute from "@/components/ProtectedRoute";

import Navbar from "@/components/Navbar";



const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:8080";





export default function ProfilePage(){



    const [user,setUser] =
        useState<any>(null);



    const [requests,setRequests] =
        useState<any[]>([]);



    const [location,setLocation] =
        useState("");



    const [bloodGroup,setBloodGroup] =
        useState("");



    const [availableForDonation,setAvailableForDonation] =
        useState(false);



    const [lastDonationDate,setLastDonationDate] =
        useState("");



    const [message,setMessage] =
        useState("");







    useEffect(()=>{


        const savedUser =
            localStorage.getItem("user");



        if(savedUser){


            const userData =
                JSON.parse(savedUser);



            setUser(userData);



            loadProfile(
                userData.id
            );



            loadRequests(
                userData.id
            );


        }



    },[]);









    async function loadProfile(
        id:number
    ){


        try{


            const response =
                await fetch(
                    `${API_URL}/api/users/${id}`
                );



            const data =
                await response.json();



            setUser(data);



            setLocation(
                data.location || ""
            );



            setBloodGroup(
                data.bloodGroup || ""
            );



            setAvailableForDonation(
                data.availableForDonation || false
            );



            setLastDonationDate(
                data.lastDonationDate || ""
            );



            localStorage.setItem(
                "user",
                JSON.stringify(data)
            );


        }
        catch(error){

            console.log(error);

        }


    }









    async function loadRequests(
        id:number
    ){


        try{


            const response =
                await fetch(
                    `${API_URL}/api/blood-requests/user/${id}`
                );



            const data =
                await response.json();



            setRequests(data);


        }
        catch(error){

            console.log(error);

        }


    }









    async function updateProfile(){


        try{


            const response =
                await fetch(
                    `${API_URL}/api/users/${user.id}`,
                    {

                        method:"PUT",

                        headers:{
                            "Content-Type":
                            "application/json"
                        },


                        body:JSON.stringify({

                            location,

                            bloodGroup,

                            availableForDonation,

                            lastDonationDate

                        })

                    }
                );





            if(!response.ok){

                throw new Error(
                    "Profile update failed"
                );

            }




            const updatedUser =
                await response.json();



            setUser(updatedUser);



            localStorage.setItem(
                "user",
                JSON.stringify(updatedUser)
            );



            setMessage(
                "Profile updated successfully"
            );



        }
        catch(error){


            console.log(error);


            setMessage(
                "Something went wrong"
            );


        }


    }









    return(


    <ProtectedRoute>


        <main className="min-h-screen bg-slate-50">


            <Navbar />




            <div className="mx-auto max-w-5xl px-6 py-10">







                <div className="
                rounded-3xl
                bg-white
                p-8
                shadow-lg
                border
                border-slate-200
                ">



                    <div className="flex items-center gap-5">


                        <div className="
                        flex
                        h-20
                        w-20
                        items-center
                        justify-center
                        rounded-full
                        bg-emerald-700
                        text-3xl
                        font-bold
                        text-white
                        ">


                            {
                                user?.name?.charAt(0)
                                ||
                                "U"
                            }


                        </div>




                        <div>


                            <h1 className="text-3xl font-bold">

                                {user?.name}

                            </h1>



                            <p className="text-slate-500">

                                EcoKnot Community Member

                            </p>


                        </div>


                    </div>








                    <div className="
                    mt-8
                    grid
                    gap-5
                    md:grid-cols-2
                    ">



                        <div className="rounded-xl bg-slate-50 p-5">


                            <p className="text-sm text-slate-500">

                                Email

                            </p>


                            <p className="font-semibold">

                                {user?.email}

                            </p>


                        </div>





                        <div className="rounded-xl bg-slate-50 p-5">


                            <p className="text-sm text-slate-500">

                                Role

                            </p>


                            <p className="font-semibold">

                                {user?.role}

                            </p>


                        </div>


                    </div>







                    {/* Smart Blood Profile */}


                    <div className="
                    mt-10
                    rounded-2xl
                    bg-emerald-50
                    p-6
                    ">


                        <h2 className="text-2xl font-bold">

                            🩸 Donor Information

                        </h2>






                        <div className="mt-5 space-y-5">



                            <div>


                                <label className="font-semibold">

                                    Location

                                </label>


                                <input

                                    value={location}

                                    onChange={(e)=>
                                        setLocation(
                                            e.target.value
                                        )
                                    }

                                    className="
                                    mt-2
                                    w-full
                                    rounded-lg
                                    border
                                    p-3
                                    "

                                    placeholder="Enter your location"

                                />


                            </div>








                            {/* Blood Group */}


                            <div>


                                <label className="font-semibold">

                                    Blood Group

                                </label>



                                <select


                                    value={bloodGroup}


                                    onChange={(e)=>
                                        setBloodGroup(
                                            e.target.value
                                        )
                                    }


                                    className="
                                    mt-2
                                    w-full
                                    rounded-lg
                                    border
                                    p-3
                                    "

                                >


                                    <option value="">

                                        Select Blood Group

                                    </option>


                                    <option value="A_POSITIVE">

                                        A+

                                    </option>


                                    <option value="A_NEGATIVE">

                                        A-

                                    </option>


                                    <option value="B_POSITIVE">

                                        B+

                                    </option>


                                    <option value="B_NEGATIVE">

                                        B-

                                    </option>


                                    <option value="AB_POSITIVE">

                                        AB+

                                    </option>


                                    <option value="AB_NEGATIVE">

                                        AB-

                                    </option>


                                    <option value="O_POSITIVE">

                                        O+

                                    </option>


                                    <option value="O_NEGATIVE">

                                        O-

                                    </option>


                                </select>


                            </div>








                            <div className="flex items-center gap-3">


                                <input

                                    type="checkbox"

                                    checked={
                                        availableForDonation
                                    }

                                    onChange={(e)=>
                                        setAvailableForDonation(
                                            e.target.checked
                                        )
                                    }

                                    className="h-5 w-5"

                                />


                                <span className="font-semibold">

                                    Available for Donation

                                </span>


                            </div>







                            <div>


                                <label className="font-semibold">

                                    Last Donation Date

                                </label>


                                <input

                                    type="date"

                                    value={
                                        lastDonationDate
                                    }

                                    onChange={(e)=>
                                        setLastDonationDate(
                                            e.target.value
                                        )
                                    }


                                    className="
                                    mt-2
                                    rounded-lg
                                    border
                                    p-3
                                    "

                                />


                            </div>




                            <button

                                onClick={updateProfile}


                                className="
                                rounded-xl
                                bg-emerald-700
                                px-6
                                py-3
                                font-semibold
                                text-white
                                "

                            >

                                Save Profile

                            </button>




                            {
                                message &&

                                <p className="font-semibold text-emerald-700">

                                    {message}

                                </p>

                            }



                        </div>


                    </div>







                </div>









                <div className="
                mt-10
                rounded-3xl
                bg-white
                p-8
                shadow-lg
                ">



                    <h2 className="text-2xl font-bold">

                        My Blood Requests

                    </h2>





                    {
                        requests.length===0 ?

                        (

                            <p className="mt-5 text-slate-500">

                                No blood requests created yet.

                            </p>

                        )

                        :


                        requests.map(
                            (request)=>(


                            <div

                            key={request.id}

                            className="
                            mt-5
                            rounded-xl
                            border
                            p-5
                            "

                            >


                                <h3 className="font-bold">

                                    {request.patientName}

                                </h3>


                                <p>

                                    Blood:
                                    {request.bloodGroup}

                                </p>


                                <p>

                                    Status:
                                    {request.status}

                                </p>



                            </div>


                        ))

                    }




                </div>







            </div>


        </main>


    </ProtectedRoute>


    );


}