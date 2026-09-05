"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";


export default function ProfilePage() {


    const [user, setUser] = useState<any>(null);

    const [requests, setRequests] = useState<any[]>([]);



    useEffect(() => {


        const savedUser = localStorage.getItem("user");


        if(savedUser){


            const userData = JSON.parse(savedUser);


            setUser(userData);



            fetch(
                `http://localhost:8080/api/blood-requests/user/${userData.id}`
            )
            .then(res => res.json())
            .then(data => {

                setRequests(data);

            })
            .catch(err => {

                console.log(err);

            });


        }


    }, []);




    return (

        <ProtectedRoute>


            <main className="min-h-screen bg-slate-50">


                <Navbar />



                <div className="mx-auto max-w-5xl px-6 py-10">



                    {/* Profile Card */}

                    <div className="rounded-3xl bg-white p-8 shadow-lg border border-slate-200">


                        <div className="flex items-center gap-5">


                            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-700 text-3xl font-bold text-white">


                                {user?.name?.charAt(0) || "U"}


                            </div>




                            <div>


                                <h1 className="text-3xl font-bold text-slate-900">

                                    {user?.name}

                                </h1>


                                <p className="text-slate-500">

                                    EcoKnot Community Member

                                </p>


                            </div>


                        </div>





                        <div className="mt-8 grid gap-5 md:grid-cols-2">



                            <div className="rounded-xl bg-slate-50 p-5">


                                <p className="text-sm text-slate-500">

                                    Name

                                </p>


                                <p className="mt-1 font-semibold text-slate-900">

                                    {user?.name}

                                </p>


                            </div>






                            <div className="rounded-xl bg-slate-50 p-5">


                                <p className="text-sm text-slate-500">

                                    Email

                                </p>


                                <p className="mt-1 font-semibold text-slate-900">

                                    {user?.email}

                                </p>


                            </div>





                            <div className="rounded-xl bg-slate-50 p-5">


                                <p className="text-sm text-slate-500">

                                    User ID

                                </p>


                                <p className="mt-1 font-semibold text-slate-900">

                                    {user?.id}

                                </p>


                            </div>



                            <div className="rounded-xl bg-slate-50 p-5">


                                <p className="text-sm text-slate-500">

                                    Total Requests

                                </p>


                                <p className="mt-1 font-semibold text-slate-900">

                                    {requests.length}

                                </p>


                            </div>



                        </div>



                    </div>







                    {/* Blood Requests */}

                    <div className="mt-10 rounded-3xl bg-white p-8 shadow-lg border border-slate-200">


                        <h2 className="text-2xl font-bold text-slate-900">

                            My Blood Requests

                        </h2>




                        {

                            requests.length === 0 ?


                            (

                                <p className="mt-5 text-slate-500">

                                    No blood requests created yet.

                                </p>

                            )


                            :


                            (

                                <div className="mt-6 space-y-4">


                                    {
                                        requests.map((request)=>(


                                            <div

                                                key={request.id}

                                                className="rounded-xl border border-slate-200 p-5"


                                            >


                                                <div className="flex justify-between">


                                                    <h3 className="font-bold text-slate-900">

                                                        {request.patientName}

                                                    </h3>



                                                    <span className="rounded-full bg-red-100 px-3 py-1 text-sm text-red-700">

                                                        {request.bloodGroup}

                                                    </span>


                                                </div>




                                                <p className="mt-3 text-slate-600">

                                                    Hospital: {request.hospitalName}

                                                </p>



                                                <p className="mt-1 text-slate-600">

                                                    Status: {request.status}

                                                </p>




                                            </div>


                                        ))
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