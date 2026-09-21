"use client";


import {
    RescueDonation
} from "@/types/rescue";





interface Props{


    rescue:RescueDonation;


}








export default function RescueCard(

{

rescue

}:Props

){






    function getTypeIcon(){


        if(rescue.type==="FOOD"){

            return "🍱";

        }


        return "💊";


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
items-center
justify-between
">


<div>


<span className="
text-3xl
">

{getTypeIcon()}

</span>



<h2 className="
mt-3
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

{rescue.status}

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
space-y-2
text-sm
text-slate-600
">



<p>

📦 Quantity:

<span className="
font-semibold
">

{rescue.quantity}

</span>

</p>





<p>

📍 Location:

<span className="
font-semibold
">

{rescue.location}

</span>

</p>






<p>

⏳ Expiry:

<span className="
font-semibold
">

{new Date(

rescue.expiryTime

).toLocaleString()}

</span>

</p>





<p>

👤 Posted by:

<span className="
font-semibold
">

{rescue.userName}

</span>

</p>




</div>







</div>



);


}