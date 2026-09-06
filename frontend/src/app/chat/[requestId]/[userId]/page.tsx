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


    const savedUser =
      localStorage.getItem("user");


    if(savedUser){

      setCurrentUser(
        JSON.parse(savedUser)
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







  // Initial load + auto refresh

  useEffect(()=>{


    if(currentUser){


      loadMessages();



      const interval =
        setInterval(()=>{

          loadMessages();

        },3000);



      return ()=>clearInterval(interval);


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
          "Failed to send message"
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



        {/* Header */}

        <div>


          <h1 className="text-2xl font-bold text-slate-900">

            💬 Blood Donation Chat

          </h1>



          <p className="mt-1 text-sm text-slate-500">

            Request ID: {requestId}

          </p>


        </div>







        {/* Messages */}


        <div className="mt-6 h-[450px] space-y-4 overflow-y-auto rounded-xl border p-4">



          {
            messages.length === 0 ?


            (

              <p className="text-center text-slate-400">

                No messages yet.

              </p>

            )


            :


            (


              messages.map((msg)=>(



                <div

                  key={msg.id}

                  className={`flex ${
                    
                    msg.senderId === currentUser?.id

                    ?

                    "justify-end"

                    :

                    "justify-start"

                  }`}

                >





                  <div


                    className={`max-w-xs rounded-2xl px-4 py-3 ${


                      msg.senderId === currentUser?.id


                      ?


                      "bg-emerald-700 text-white"


                      :


                      "bg-slate-200 text-slate-900"


                    }`}


                  >



                    <p>

                      {msg.message}

                    </p>



                    <p

                    className="mt-1 text-xs opacity-70"

                    >

                      {
                        new Date(
                          msg.timestamp
                        )
                        .toLocaleTimeString()
                      }


                    </p>



                  </div>




                </div>



              ))


            )

          }



        </div>









        {/* Send Message */}


        <div className="mt-5 flex gap-3">



          <input


            type="text"


            value={newMessage}


            onChange={
              (e)=>
              setNewMessage(e.target.value)
            }


            onKeyDown={
              (e)=>{

                if(e.key==="Enter"){

                  sendMessage();

                }

              }
            }


            placeholder="Write a message..."


            className="
            flex-1
            rounded-xl
            border
            border-slate-300
            px-4
            py-3
            outline-none
            focus:border-emerald-600
            "


          />






          <button


            onClick={sendMessage}


            className="
            rounded-xl
            bg-emerald-700
            px-6
            font-semibold
            text-white
            hover:bg-emerald-800
            "


          >

            Send

          </button>



        </div>





      </div>


    </main>


  );


}