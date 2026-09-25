"use client";

import {
    useEffect,
    useState
} from "react";

import {
    useRouter
} from "next/navigation";


const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:8080";


type Message = {

    id: number;

    senderId: number;

    receiverId: number;

    requestId: number;

    message: string;

    timestamp: string;

};


type Conversation = {

    requestId: number;

    otherUserId: number;

    latestMessage: string;

    latestTimestamp: string;

};


type LoggedInUser = {

    id: number;

    name?: string;

    email?: string;

};


export default function MessagesPage(){


    const router =
        useRouter();


    const [conversations,setConversations] =
        useState<Conversation[]>([]);


    const [user,setUser] =
        useState<LoggedInUser | null>(null);


    const [loading,setLoading] =
        useState(true);


    const [error,setError] =
        useState("");



    useEffect(()=>{


        const savedUser =
            localStorage.getItem("user");


        if(!savedUser){


            setError(
                "Please login to view your messages."
            );


            setLoading(false);


            return;


        }


        try{


            const data:LoggedInUser =
                JSON.parse(savedUser);


            setUser(data);


            loadMessages(data.id);


        }
        catch(error){


            console.log(
                "Unable to parse user:",
                error
            );


            setError(
                "Unable to load user information."
            );


            setLoading(false);


        }


    },[]);





    async function loadMessages(
        userId:number
    ){


        try{


            setLoading(true);

            setError("");


            const response =
                await fetch(
                    `${API_URL}/api/chat/inbox/${userId}`
                );


            if(!response.ok){


                const message =
                    await response.text();


                throw new Error(
                    message ||
                    "Failed to load messages."
                );


            }


            const data:Message[] =
                await response.json();


            if(!Array.isArray(data)){


                setConversations([]);


                return;


            }


            const conversationMap =
                new Map<string,Conversation>();


            data.forEach(
                message => {


                    const otherUserId =

                        message.senderId === userId

                            ?

                            message.receiverId

                            :

                            message.senderId;


                    const key =
                        `${message.requestId}-${otherUserId}`;


                    const existing =
                        conversationMap.get(key);


                    if(
                        !existing ||
                        new Date(message.timestamp).getTime() >
                        new Date(existing.latestTimestamp).getTime()
                    ){


                        conversationMap.set(
                            key,
                            {

                                requestId:
                                    message.requestId,

                                otherUserId:
                                    otherUserId,

                                latestMessage:
                                    message.message,

                                latestTimestamp:
                                    message.timestamp

                            }
                        );


                    }


                }
            );


            const grouped =
                Array.from(
                    conversationMap.values()
                )
                .sort(
                    (a,b) =>

                        new Date(
                            b.latestTimestamp
                        ).getTime()

                        -

                        new Date(
                            a.latestTimestamp
                        ).getTime()
                );


            setConversations(grouped);


        }
        catch(error){


            console.log(error);


            setError(

                error instanceof Error

                    ?

                    error.message

                    :

                    "Failed to load messages."

            );


            setConversations([]);


        }
        finally{


            setLoading(false);


        }


    }





    if(loading){


        return(


            <main className="
            min-h-screen
            bg-slate-50
            p-8
            ">


                <div className="
                mx-auto
                max-w-3xl
                rounded-2xl
                bg-white
                p-6
                shadow
                ">


                    Loading messages...


                </div>


            </main>


        );


    }





    return (

        <main className="
        min-h-screen
        bg-slate-50
        p-8
        ">


            <div className="
            mx-auto
            max-w-3xl
            rounded-2xl
            bg-white
            p-6
            shadow
            ">


                <h1 className="
                text-3xl
                font-bold
                ">

                    💬 Messages

                </h1>



                <p className="
                mt-2
                text-slate-500
                ">

                    Continue conversations related to blood donation requests.

                </p>



                {
                    error &&


                    <div className="
                    mt-5
                    rounded-xl
                    border
                    border-red-200
                    bg-red-50
                    p-4
                    text-red-700
                    ">

                        {error}

                    </div>
                }



                {
                    conversations.length === 0

                        ?

                        <p className="
                        mt-5
                        text-gray-500
                        ">

                            No messages yet.

                        </p>

                        :

                        conversations.map(
                            conversation => (


                                <div
                                    key={
                                        `${conversation.requestId}-${conversation.otherUserId}`
                                    }
                                    className="
                                    mt-4
                                    rounded-xl
                                    border
                                    p-4
                                    "
                                >


                                    <div className="
                                    flex
                                    items-start
                                    justify-between
                                    gap-4
                                    ">


                                        <div>


                                            <p className="
                                            font-semibold
                                            ">

                                                Blood Request #{conversation.requestId}

                                            </p>


                                            <p className="
                                            mt-2
                                            text-slate-700
                                            ">

                                                {conversation.latestMessage}

                                            </p>


                                            <p className="
                                            mt-2
                                            text-xs
                                            text-slate-400
                                            ">

                                                {
                                                    new Date(
                                                        conversation.latestTimestamp
                                                    ).toLocaleString()
                                                }

                                            </p>


                                        </div>


                                        <span className="
                                        rounded-full
                                        bg-slate-100
                                        px-3
                                        py-1
                                        text-xs
                                        font-semibold
                                        text-slate-600
                                        ">

                                            User #{conversation.otherUserId}

                                        </span>


                                    </div>



                                    <button

                                        onClick={()=>{


                                            router.push(

                                                `/chat/${conversation.requestId}/${conversation.otherUserId}`

                                            );


                                        }}

                                        className="
                                        mt-4
                                        rounded-lg
                                        bg-emerald-700
                                        px-4
                                        py-2
                                        text-white
                                        hover:bg-emerald-800
                                        "

                                    >

                                        Open Chat

                                    </button>


                                </div>


                            )
                        )

                }


            </div>


        </main>

    );


}