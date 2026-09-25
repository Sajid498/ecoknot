"use client";


import {
    useEffect,
    useState
} from "react";


import ProtectedRoute from "@/components/ProtectedRoute";










const API_URL =

    process.env.NEXT_PUBLIC_API_URL ||

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




        const interval =

            setInterval(()=>{


                loadNotifications();



            },10000);




        return()=>{


            clearInterval(interval);


        };



    },[]);










    async function loadNotifications(){



        try{



            const savedUser =

                localStorage.getItem("user");





            if(!savedUser){


                return;


            }






            const user =

                JSON.parse(savedUser);








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







            setNotifications(data);



        }

        catch(error){


            console.log(error);


        }



    }











    async function markAsRead(

        id:number

    ){



        try{



            const response =

                await fetch(

`${API_URL}/api/notifications/read/${id}`,

                    {

                        method:"PUT"

                    }

                );






            if(response.ok){


                loadNotifications();


            }





        }

        catch(error){


            console.log(error);


        }


    }











    function getNotificationIcon(

        type:string

    ){



        switch(type){



            case "PICKUP_REQUEST":

                return "🚚";



            case "PICKUP_APPROVED":

                return "✅";



            case "PICKUP_REJECTED":

                return "❌";



            case "BLOOD_REQUEST":

                return "🩸";



            case "DONATION_ACCEPTED":

                return "🤝";



            case "DONATION_COMPLETED":

                return "❤️";



            case "DONOR_FOUND":

                return "🧑‍⚕️";



            case "PICKUP_COMPLETED":

                return "📦";



            case "DELIVERY_COMPLETE":

                return "🎉";



            default:

                return "🔔";



        }


    }











    function getTypeName(

        type:string

    ){



        switch(type){



            case "PICKUP_REQUEST":

                return "Pickup Request";



            case "PICKUP_APPROVED":

                return "Pickup Approved";



            case "PICKUP_REJECTED":

                return "Pickup Rejected";



            case "BLOOD_REQUEST":

                return "Blood Request";



            case "DONATION_ACCEPTED":

                return "Donation Accepted";



            case "DONATION_COMPLETED":

                return "Donation Completed";



            case "DONOR_FOUND":

                return "Donor Found";



            case "PICKUP_COMPLETED":

                return "Pickup Completed";



            case "DELIVERY_COMPLETE":

                return "Delivery Complete";



            default:

                return type;



        }


    }











return(



<ProtectedRoute>



<main className="
min-h-screen
bg-slate-50
">











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

Stay updated with your community activities.

</p>








{

notifications.length===0 ?



<div className="
mt-8
rounded-xl
bg-slate-50
p-6
text-center
text-slate-500
">

No notifications available.

</div>






:



<div className="
mt-8
space-y-4
">


{

notifications.map(

(notification)=>(



<div

key={notification.id}

className={`

rounded-2xl

border

p-5

transition

${

notification.readStatus

?

"bg-white border-slate-200"

:

"bg-emerald-50 border-emerald-300 shadow"

}

`}

>






<div className="
flex
items-start
justify-between
gap-4
">





<div className="
flex
gap-3
">





<div className="
text-3xl
">

{getNotificationIcon(

notification.type

)}

</div>






<div>



<h2 className="
font-bold
text-slate-900
">

{getTypeName(

notification.type

)}

</h2>





<p className="
mt-2
text-slate-700
">

{notification.message}

</p>



</div>






</div>








<span className="
rounded-full
bg-emerald-700
px-3
py-1
text-xs
font-semibold
text-white
">

{notification.type}

</span>






</div>







<div className="
mt-4
flex
items-center
justify-between
">


<p className="
text-sm
text-slate-500
">

{

new Date(

notification.createdAt

).toLocaleString()

}

</p>






{

!notification.readStatus &&



<button

onClick={()=>markAsRead(

notification.id

)}

className="
rounded-lg
bg-emerald-700
px-4
py-2
text-sm
font-semibold
text-white
hover:bg-emerald-800
"

>

Mark as Read

</button>


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



</ProtectedRoute>



);



}