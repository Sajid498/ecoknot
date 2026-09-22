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



        case "REJECTED":

            return "bg-red-100 text-red-700";



        default:

            return "bg-gray-100 text-gray-700";


    }


}









function statusText(){



    switch(pickup.status){



        case "PENDING":

            return "🟡 Waiting for owner approval";



        case "APPROVED":

            return "🟢 Pickup approved";



        case "PICKED_UP":

            return "🔵 Item picked up";



        case "DELIVERED":

            return "🟣 Delivery completed";



        case "REJECTED":

            return "🔴 Request rejected";



        default:

            return pickup.status;


    }


}









function isCompleted(

    status:string

){


    const steps = [

        "PENDING",

        "APPROVED",

        "PICKED_UP",

        "DELIVERED"

    ];


    return steps.indexOf(

        pickup.status

    )

    >=

    steps.indexOf(status);


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
gap-4
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

Pickup request for this relief donation.

</p>


</div>







<span

className={`

rounded-full

px-4

py-2

text-sm

font-semibold

${getStatusStyle()}

`}

>

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

📍 Location:

<span className="
ml-1
font-semibold
text-slate-900
">

{pickup.rescueDonation.location}

</span>

</p>





</div>









{/* STATUS TIMELINE */}


<div className="
mt-6
rounded-xl
bg-slate-50
p-5
">


<h3 className="
font-bold
text-slate-900
">

Pickup Progress

</h3>





<div className="
mt-4
space-y-3
">






<div className="
flex
items-center
gap-3
">

<span>

{

isCompleted("PENDING")

?

"🟡"

:

"⚪"

}

</span>


<p>

Request Submitted

</p>


</div>







<div className="
flex
items-center
gap-3
">


<span>

{

isCompleted("APPROVED")

?

"🟢"

:

"⚪"

}

</span>


<p>

Owner Approved

</p>


</div>








<div className="
flex
items-center
gap-3
">


<span>

{

isCompleted("PICKED_UP")

?

"🔵"

:

"⚪"

}

</span>


<p>

Item Picked Up

</p>


</div>








<div className="
flex
items-center
gap-3
">


<span>

{

isCompleted("DELIVERED")

?

"🟣"

:

"⚪"

}

</span>


<p>

Delivered Successfully

</p>


</div>







</div>


</div>









<p className="
mt-5
rounded-xl
bg-slate-50
p-3
text-center
font-semibold
text-slate-700
">

{statusText()}

</p>









{

pickup.status==="APPROVED"

&&


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

pickup.status==="PICKED_UP"

&&


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

✅ Complete Delivery

</button>


}









{

pickup.status==="DELIVERED"

&&


<div className="
mt-5
rounded-xl
bg-purple-50
p-3
text-center
font-semibold
text-purple-700
">

🎉 Pickup completed successfully

</div>


}





</div>


);


}