"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";


const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";


type Message = {

  id: number;

  senderId: number;

  receiverId: number;

  requestId: number;

  message: string;

  timestamp: string;

};



export default function ChatPage() {


  const params = useParams();


  const requestId = Number(params.requestId);

  const userId = Number(params.userId);



  const [messages, setMessages] =
    useState<Message[]>([]);


  const [newMessage, setNewMessage] =
    useState("");



  const [currentUser, setCurrentUser] =
    useState<any>(null);




  useEffect(() => {

    const user =
      localStorage.getItem("user");


    if(user){

      setCurrentUser(
        JSON.parse(user)
      );

    }


  }, []);






  async function loadMessages(){


    if(!currentUser)
      return;



    try{


      const response =
        await fetch(
          `${API_URL}/api/chat/${currentUser.id}/${userId}/request/${requestId}`
        );



      if(!response.ok){

        throw new Error(
          "Failed to load messages"
        );

      }



      const data =
        await response.json();


      setMessages(data);


    }
    catch(error){

      console.log(error);

    }


  }





  useEffect(()=>{


    if(currentUser){

      loadMessages();

    }


  },[currentUser]);








  async function sendMessage(){


    if(!newMessage.trim())
      return;



    if(!currentUser)
      return;



    try{


      const response =
        await fetch(
          `${API_URL}/api/chat/send`,
          {

            method:"POST",

            headers:{
              "Content-Type":"application/json"
            },


            body:JSON.stringify({

              senderId:
                currentUser.id,


              receiverId:
                userId,


              requestId:
                requestId,


              message:
                newMessage


            })

          }
        );



      if(!response.ok){

        throw new Error(
          "Message sending failed"
        );

      }



      setNewMessage("");

      loadMessages();



    }
    catch(error){

      console.log(error);

    }


  }






  return (

    <main className="min-h-screen bg-slate-50 p-6">


      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow">


        <h1 className="text-2xl font-bold text-slate-900">

          💬 Blood Donation Chat

        </h1>



        <p className="mt-2 text-sm text-slate-500">

          Request ID: {requestId}

        </p>





        <div className="mt-6 h-[450px] space-y-3 overflow-y-auto rounded-xl border p-4">


          {
            messages.length === 0 ? (

              <p className="text-center text-slate-400">

                No messages yet.

              </p>

            )
            :
            (

              messages.map((msg)=>(


                <div

                  key={msg.id}

                  className={
                    msg.senderId === currentUser?.id
                    ?
                    "text-right"
                    :
                    "text-left"
                  }

                >


                  <span

                    className={
                      msg.senderId === currentUser?.id
                      ?
                      "inline-block rounded-xl bg-emerald-600 px-4 py-2 text-white"
                      :
                      "inline-block rounded-xl bg-slate-200 px-4 py-2 text-slate-800"
                    }

                  >

                    {msg.message}

                  </span>


                </div>


              ))

            )
          }


        </div>





        <div className="mt-5 flex gap-3">


          <input

            type="text"

            value={newMessage}

            onChange={
              (e)=>setNewMessage(e.target.value)
            }

            placeholder="Write a message..."

            className="flex-1 rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-600"

          />



          <button

            onClick={sendMessage}

            className="rounded-xl bg-emerald-700 px-6 font-semibold text-white hover:bg-emerald-800"

          >

            Send

          </button>



        </div>



      </div>


    </main>

  );

}