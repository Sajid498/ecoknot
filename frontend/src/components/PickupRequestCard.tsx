"use client";


import {
    PickupRequest
} from "@/types/pickup";





interface Props{


    pickup:PickupRequest;


    onUpdate:()=>void;


    userId:number;


}






const API_URL =

    process.env.NEXT_PUBLIC_API_URL ||

    "http://localhost:8080";









export default function PickupRequestCard(

{

pickup,

onUpdate,

userId

}:Props

){







async function updateRequest(

    action:string

){


    try{


        const response =

            await fetch(

`${API_URL}/api/pickups/${pickup.id}/${action}?userId=${userId}`,

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



        case "REJECTED":

            return "bg-red-100 text-red-700";



        case "PICKED_UP":

            return "bg-blue-100 text-blue-700";



        case "DELIVERED":

            return "bg-purple-100 text-purple-700";



        default:

            return "bg-gray-100 text-gray-700";


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
items-start
justify-between
">






<div>


<h2 className="
text-xl
font-bold
text-slate-900
">

🚚 Pickup Request

</h2>







<div className="
mt-3
space-y-2
text-sm
text-slate-600
">



<p>

👤 Volunteer:

<span className="
ml-1
font-semibold
text-slate-900
">

{pickup.volunteer.name}

</span>

</p>





<p>

📧 Email:

<span className="
ml-1
font-semibold
text-slate-900
">

{pickup.volunteer.email}

</span>

</p>





<p>

📍 Volunteer Location:

<span className="
ml-1
font-semibold
text-slate-900
">

{pickup.volunteer.location}

</span>

</p>





</div>





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
rounded-xl
bg-slate-50
p-4
space-y-3
text-sm
">








<p>

🍱 Resource:

<span className="
ml-1
font-semibold
text-slate-900
">

{pickup.rescueDonation.title}

</span>

</p>








<p>

🏷️ Type:

<span className="
ml-1
font-semibold
text-slate-900
">

{pickup.rescueDonation.type}

</span>

</p>








<p>

📦 Quantity:

<span className="
ml-1
font-semibold
text-slate-900
">

{pickup.rescueDonation.quantity}

</span>

</p>








<p>

📍 Pickup Location:

<span className="
ml-1
font-semibold
text-slate-900
">

{pickup.rescueDonation.location}

</span>

</p>







</div>









{

pickup.status==="PENDING" &&



<div className="
mt-5
flex
gap-3
">





<button

onClick={()=>updateRequest("approve")}

className="
flex-1
rounded-xl
bg-emerald-700
px-4
py-3
font-semibold
text-white
hover:bg-emerald-800
"

>

✅ Approve

</button>







<button

onClick={()=>updateRequest("reject")}

className="
flex-1
rounded-xl
bg-red-600
px-4
py-3
font-semibold
text-white
hover:bg-red-700
"

>

❌ Reject

</button>







</div>


}








</div>



);


}