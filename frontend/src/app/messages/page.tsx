"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";


const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:8080";


type Message = {

    id:number;

    senderId:number;

    receiverId:number;

    requestId:number;

    message:string;

    timestamp:string;

};



export default function MessagesPage(){


    const router = useRouter();


    const [messages,setMessages] =
        useState<Message[]>([]);


    const [user,setUser] =
        useState<any>(null);



    useEffect(()=>{


        const savedUser =
            localStorage.getItem("user");


        if(savedUser){

            const data =
                JSON.parse(savedUser);

            setUser(data);

            loadMessages(data.id);

        }


    },[]);





    async function loadMessages(userId:number){


        const response =
            await fetch(
                `${API_URL}/api/chat/inbox/${userId}`
            );


        const data =
            await response.json();


        setMessages(data);


    }





    return (

        <main className="min-h-screen bg-slate-50 p-8">


            <div className="mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow">


                <h1 className="text-3xl font-bold">

                    💬 Messages

                </h1>



                {
                    messages.length===0 ?

                    <p className="mt-5 text-gray-500">

                        No messages yet.

                    </p>

                    :

                    messages.map((msg)=>(


                        <div
                        key={msg.id}
                        className="mt-4 rounded-xl border p-4"
                        >


                            <p className="font-semibold">

                                Blood Request #{msg.requestId}

                            </p>


                            <p className="mt-2">

                                {msg.message}

                            </p>



                            <button

                            onClick={()=>{

                                router.push(
                                `/chat/${msg.requestId}/${msg.senderId}`
                                );

                            }}

                            className="
                            mt-3
                            rounded-lg
                            bg-emerald-700
                            px-4
                            py-2
                            text-white
                            "

                            >

                                Open Chat

                            </button>


                        </div>


                    ))

                }


            </div>


        </main>

    );


}