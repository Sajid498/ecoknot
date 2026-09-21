"use client";


import {
    useEffect,
    useState
} from "react";


import {
    RescueDonation
} from "@/types/rescue";







const API_URL =

    process.env.NEXT_PUBLIC_API_URL ||

    "http://localhost:8080";







interface Props{


    rescue:RescueDonation;


}









export default function RescueCard(

{

rescue

}:Props

){







const [remainingTime,setRemainingTime] =

useState("");





const [timeStatus,setTimeStatus] =

useState("");





const [user,setUser] =

useState<any>(null);





const [pickupMessage,setPickupMessage] =

useState("");









useEffect(()=>{


    const savedUser =

        localStorage.getItem("user");



    if(savedUser){


        setUser(

            JSON.parse(savedUser)

        );


    }


},[]);









function calculateRemainingTime(){



    const now = new Date().getTime();



    const expiry =

        new Date(

            rescue.expiryTime

        ).getTime();





    const difference =

        expiry - now;






    if(difference <= 0){


        setRemainingTime(

            "Expired"

        );


        setTimeStatus(

            "expired"

        );


        return;


    }







    const hours =

        Math.floor(

            difference /

            (1000 * 60 * 60)

        );







    const minutes =

        Math.floor(

            (difference %

            (1000 * 60 * 60))

            /

            (1000 * 60)

        );







    setRemainingTime(

        `${hours} hours ${minutes} minutes`

    );








    if(hours < 24){


        setTimeStatus(

            "urgent"

        );


    }

    else{


        setTimeStatus(

            "safe"

        );


    }


}









useEffect(()=>{


    calculateRemainingTime();



    const timer =

        setInterval(

            calculateRemainingTime,

            60000

        );




    return()=>{


        clearInterval(timer);


    };


},[]);









async function requestPickup(){



    if(!user){


        setPickupMessage(

            "Please login first"

        );


        return;


    }








    try{



        const response =

            await fetch(

`${API_URL}/api/pickups?rescueId=${rescue.id}&volunteerId=${user.id}`,

                {

                    method:"POST"

                }

            );







        if(response.ok){


            setPickupMessage(

                "Pickup request sent successfully 🚚"

            );


        }

        else{


            setPickupMessage(

                "Pickup request failed"

            );


        }



    }

    catch(error){


        console.log(error);


        setPickupMessage(

            "Something went wrong"

        );


    }



}









function getTypeIcon(){


    if(rescue.type==="FOOD"){


        return "🍱";


    }


    return "💊";


}









function getTypeName(){


    if(rescue.type==="FOOD"){


        return "Food Support";


    }


    return "Medicine Support";


}









function getStatusStyle(){



    switch(rescue.status){



        case "AVAILABLE":

            return "bg-emerald-100 text-emerald-700";



        case "RESERVED":

            return "bg-yellow-100 text-yellow-700";



        case "PICKED_UP":

            return "bg-blue-100 text-blue-700";



        case "DELIVERED":

            return "bg-purple-100 text-purple-700";



        default:

            return "bg-red-100 text-red-700";


    }


}









function getExpiryStyle(){



    if(timeStatus==="expired"){


        return "bg-red-100 text-red-700";


    }



    if(timeStatus==="urgent"){


        return "bg-yellow-100 text-yellow-700";


    }



    return "bg-emerald-100 text-emerald-700";


}









return(



<div className="
rounded-2xl
bg-white
p-6
shadow-md
transition
hover:shadow-lg
">









<div className="
flex
items-start
justify-between
">





<div>


<div className="
flex
items-center
gap-3
">


<span className="
text-3xl
">

{getTypeIcon()}

</span>






<span className="
rounded-full
bg-emerald-100
px-3
py-1
text-sm
font-semibold
text-emerald-700
">

{getTypeName()}

</span>



</div>







<h2 className="
mt-4
text-xl
font-bold
text-slate-900
">

{rescue.title}

</h2>






</div>







<span className={`

rounded-full

px-4

py-2

text-sm

font-semibold

${getStatusStyle()}

`}>

🌱 {rescue.status}

</span>







</div>









<p className="
mt-4
text-slate-600
">

{rescue.description}

</p>









<div className="
mt-5
space-y-3
rounded-xl
bg-slate-50
p-4
text-sm
text-slate-600
">






<p>

📦 Quantity:

<span className="
ml-1
font-semibold
text-slate-900
">

{rescue.quantity}

</span>

</p>








<p>

📍 Location:

<span className="
ml-1
font-semibold
text-slate-900
">

{rescue.location}

</span>

</p>









<div className="
flex
items-center
gap-2
">

⏳ Remaining Time:


<span className={`

rounded-full

px-3

py-1

font-semibold

${getExpiryStyle()}

`}>

{remainingTime}

</span>


</div>








<p>

👤 Shared By:

<span className="
ml-1
font-semibold
text-slate-900
">

{rescue.userName}

</span>

</p>







</div>









<button

onClick={requestPickup}

disabled={
    rescue.status !== "AVAILABLE"
}

className="
mt-5
w-full
rounded-xl
bg-emerald-700
px-5
py-3
font-semibold
text-white
transition
hover:bg-emerald-800
disabled:bg-gray-300
"

>

🚚 Request Pickup

</button>








{

pickupMessage &&


<p className="
mt-3
text-center
text-sm
font-semibold
text-emerald-700
">

{pickupMessage}

</p>


}









</div>



);


}