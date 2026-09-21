"use client";


import {
    PickupRequest
} from "@/types/pickup";





interface Props{

    pickup:PickupRequest;

    onUpdate:()=>void;

}







const API_URL =

    process.env.NEXT_PUBLIC_API_URL ||

    "http://localhost:8080";









export default function PickupCard(

{

pickup,

onUpdate

}:Props

){







async function updateStatus(

    action:string

){



    try{



        const response =

            await fetch(

`${API_URL}/api/pickups/${pickup.id}/${action}`,

                {

                    method:"PUT"

                }

            );







        if(response.ok){


            onUpdate();


        }



    }

    catch(error){


        console.log(error);


    }


}









function getStatusStyle(){



    switch(pickup.status){


        case "PENDING":

            return "bg-yellow-100 text-yellow-700";



        case "APPROVED":

            return "bg-emerald-100 text-emerald-700";



        case "PICKED_UP":

            return "bg-blue-100 text-blue-700";



        case "DELIVERED":

            return "bg-purple-100 text-purple-700";



        default:

            return "bg-red-100 text-red-700";


    }


}









return(



<div className="
rounded-2xl
bg-white
p-6
shadow-md
">








<div className="
flex
justify-between
items-start
">






<div>


<h2 className="
text-xl
font-bold
text-slate-900
">

🚚 {pickup.rescueDonation.title}

</h2>







<p className="
mt-2
text-slate-600
">

{pickup.rescueDonation.description}

</p>



</div>







<span className={`

rounded-full

px-4

py-2

text-sm

font-semibold

${getStatusStyle()}

`}>

{pickup.status}

</span>







</div>









<div className="
mt-5
space-y-2
text-sm
text-slate-600
">





<p>

🍱 Type:

<span className="
font-semibold
text-slate-900
">

{pickup.rescueDonation.type}

</span>

</p>







<p>

📦 Quantity:

<span className="
font-semibold
text-slate-900
">

{pickup.rescueDonation.quantity}

</span>

</p>







<p>

📍 Location:

<span className="
font-semibold
text-slate-900
">

{pickup.rescueDonation.location}

</span>

</p>






</div>









{

pickup.status==="PENDING" &&


<p className="
mt-5
rounded-xl
bg-yellow-50
p-3
text-center
font-semibold
text-yellow-700
">

Waiting for donor approval ⏳

</p>


}









{

pickup.status==="APPROVED" &&


<button

onClick={()=>updateStatus("pickup")}

className="
mt-5
w-full
rounded-xl
bg-blue-600
px-5
py-3
font-semibold
text-white
hover:bg-blue-700
"

>

🚚 Mark Picked Up

</button>


}









{

pickup.status==="PICKED_UP" &&


<button

onClick={()=>updateStatus("deliver")}

className="
mt-5
w-full
rounded-xl
bg-purple-600
px-5
py-3
font-semibold
text-white
hover:bg-purple-700
"

>

✅ Mark Delivered

</button>


}








</div>


);


}