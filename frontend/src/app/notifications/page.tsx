"use client";


import { useEffect, useState } from "react";

import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";





const API_URL =
    "http://localhost:8080";





type Notification = {


    id:number;


    userId:number;


    message:string;


    type:string;


    readStatus:boolean;


    createdAt:string;


};







export default function NotificationsPage(){



    const [notifications,setNotifications] =
        useState<Notification[]>([]);






    useEffect(()=>{


        loadNotifications();


    },[]);







    async function loadNotifications(){



        try{


            const savedUser =
                localStorage.getItem(
                    "user"
                );



            if(!savedUser){

                return;

            }





            const user =
                JSON.parse(
                    savedUser
                );





            const response =
                await fetch(

                    `${API_URL}/api/notifications/user/${user.id}`

                );






            if(!response.ok){


                throw new Error(
                    "Failed to load notifications"
                );


            }





            const data =
                await response.json();





            setNotifications(
                data
            );



        }
        catch(error){


            console.log(error);


        }


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
            max-w-4xl
            px-6
            py-10
            ">





                <div className="
                rounded-3xl
                bg-white
                p-8
                shadow-lg
                border
                border-slate-200
                ">



                    <h1 className="
                    text-3xl
                    font-bold
                    text-slate-900
                    ">

                        🔔 Notifications

                    </h1>



                    <p className="
                    mt-2
                    text-slate-500
                    ">

                        Blood donation requests and important updates.

                    </p>









                    {
                        notifications.length === 0 ?


                        (

                            <div className="
                            mt-8
                            rounded-xl
                            bg-slate-50
                            p-5
                            text-slate-500
                            ">

                                No notifications available.

                            </div>


                        )

                        :


                        (

                            <div className="
                            mt-8
                            space-y-4
                            ">


                            {
                                notifications.map(
                                    (
                                        notification
                                    )=>(


                                    <div

                                    key={
                                        notification.id
                                    }

                                    className="
                                    rounded-xl
                                    border
                                    border-emerald-200
                                    bg-emerald-50
                                    p-5
                                    "

                                    >




                                        <div className="
                                        flex
                                        justify-between
                                        gap-3
                                        ">



                                            <h2 className="
                                            font-bold
                                            text-slate-900
                                            ">

                                                🩸 Blood Request Alert

                                            </h2>



                                            <span className="
                                            rounded-full
                                            bg-emerald-700
                                            px-3
                                            py-1
                                            text-xs
                                            text-white
                                            ">

                                                {
                                                    notification.type
                                                }

                                            </span>



                                        </div>






                                        <p className="
                                        mt-3
                                        text-slate-700
                                        ">

                                            {
                                                notification.message
                                            }

                                        </p>






                                        <p className="
                                        mt-3
                                        text-sm
                                        text-slate-500
                                        ">

                                            {
                                                notification.createdAt
                                            }

                                        </p>





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