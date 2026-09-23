"use client";


import {
    useState
} from "react";


import toast from "react-hot-toast";


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







    const [updating,setUpdating] =

        useState(false);












    async function updateStatus(

        action:string

    ){



        try{



            setUpdating(true);







            const response =

                await fetch(

`${API_URL}/api/pickups/${pickup.id}/${action}`,

                {

                    method:"PUT"

                }

            );









            if(response.ok){



                toast.success(

                    "Pickup status updated successfully 🚚"

                );



                onUpdate();



            }

            else{



                toast.error(

                    "Failed to update pickup status"

                );


            }



        }

        catch(error){



            console.log(error);



            toast.error(

                "Something went wrong"

            );



        }

        finally{



            setUpdating(false);



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


                return "bg-slate-100 text-slate-700";


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






        return (

            steps.indexOf(

                pickup.status

            )

            >=

            steps.indexOf(status)

        );


    }













    function getStepIcon(

        status:string

    ){



        if(isCompleted(status)){



            switch(status){



                case "PENDING":

                    return "🟡";



                case "APPROVED":

                    return "🟢";



                case "PICKED_UP":

                    return "🔵";



                case "DELIVERED":

                    return "🟣";



            }


        }





        return "⚪";


    }













    function statusText(){



        switch(pickup.status){



            case "PENDING":


                return "Waiting for owner approval ⏳";





            case "APPROVED":


                return "Pickup approved. Ready to collect 🚚";





            case "PICKED_UP":


                return "Item collected. Deliver to destination 📦";





            case "DELIVERED":


                return "Delivery completed successfully 🎉";





            case "REJECTED":


                return "Pickup request rejected ❌";





            default:


                return pickup.status;


        }


    }
    return(



<div className="
rounded-2xl
bg-white
p-6
shadow-md
border
border-slate-100
transition
hover:shadow-lg
">







<div className="
flex
items-start
justify-between
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
mt-6
grid
gap-4
md:grid-cols-2
">







<div className="
rounded-xl
bg-slate-50
p-4
">

<p className="
text-sm
text-slate-500
">

🍱 Relief Type

</p>


<p className="
mt-1
font-bold
text-slate-900
">

{pickup.rescueDonation.type}

</p>


</div>








<div className="
rounded-xl
bg-slate-50
p-4
">

<p className="
text-sm
text-slate-500
">

📦 Quantity

</p>


<p className="
mt-1
font-bold
text-slate-900
">

{pickup.rescueDonation.quantity}

</p>


</div>








<div className="
rounded-xl
bg-slate-50
p-4
">

<p className="
text-sm
text-slate-500
">

📍 Pickup Location

</p>


<p className="
mt-1
font-bold
text-slate-900
">

{pickup.rescueDonation.location}

</p>


</div>









<div className="
rounded-xl
bg-slate-50
p-4
">

<p className="
text-sm
text-slate-500
">

👤 Volunteer

</p>


<p className="
mt-1
font-bold
text-slate-900
">

{pickup.volunteer?.name || "Volunteer"}

</p>


</div>






</div>









{/* STATUS TIMELINE */}



<div className="
mt-8
rounded-2xl
bg-slate-50
p-6
">





<h3 className="
text-lg
font-bold
text-slate-900
">

🚚 Pickup Progress

</h3>








<div className="
mt-6
space-y-5
">






<div className="
flex
items-center
gap-3
">


<span className="text-xl">

{

getStepIcon(

"PENDING"

)

}

</span>


<div>

<p className="
font-semibold
">

Request Submitted

</p>


<p className="
text-sm
text-slate-500
">

Volunteer requested pickup

</p>


</div>


</div>









<div className="
ml-2
h-6
border-l-2
border-slate-300
">

</div>









<div className="
flex
items-center
gap-3
">


<span className="text-xl">

{

getStepIcon(

"APPROVED"

)

}

</span>


<div>

<p className="
font-semibold
">

Owner Approved

</p>


<p className="
text-sm
text-slate-500
">

Donation owner accepted request

</p>


</div>


</div>









<div className="
ml-2
h-6
border-l-2
border-slate-300
">

</div>









<div className="
flex
items-center
gap-3
">


<span className="text-xl">

{

getStepIcon(

"PICKED_UP"

)

}

</span>


<div>

<p className="
font-semibold
">

Item Picked Up

</p>


<p className="
text-sm
text-slate-500
">

Volunteer collected the item

</p>


</div>


</div>









<div className="
ml-2
h-6
border-l-2
border-slate-300
">

</div>








<div className="
flex
items-center
gap-3
">


<span className="text-xl">

{

getStepIcon(

"DELIVERED"

)

}

</span>


<div>

<p className="
font-semibold
">

Delivered Successfully

</p>


<p className="
text-sm
text-slate-500
">

Relief reached destination

</p>


</div>


</div>







</div>





</div>









<p className="
mt-5
rounded-xl
bg-emerald-50
p-4
text-center
font-semibold
text-emerald-700
">

{statusText()}

</p>









{

pickup.status==="APPROVED"

&&


<button

onClick={()=>updateStatus("pickup")}

disabled={updating}

className="
mt-5
w-full
rounded-xl
bg-blue-600
px-5
py-3
font-semibold
text-white
transition
hover:bg-blue-700
disabled:bg-gray-300
"

>

{

updating

?

"Updating..."

:

"🚚 Confirm Pickup"

}


</button>


}









{

pickup.status==="PICKED_UP"

&&


<button

onClick={()=>updateStatus("deliver")}

disabled={updating}

className="
mt-5
w-full
rounded-xl
bg-purple-600
px-5
py-3
font-semibold
text-white
transition
hover:bg-purple-700
disabled:bg-gray-300
"

>

{

updating

?

"Updating..."

:

"✅ Complete Delivery"

}


</button>


}









{

pickup.status==="DELIVERED"

&&


<div className="
mt-5
rounded-xl
bg-purple-50
p-4
text-center
font-bold
text-purple-700
">

🎉 Relief delivery completed

</div>


}









</div>



);


}