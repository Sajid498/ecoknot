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







<p>

⏳ Available Until:

<span className="
ml-1
font-semibold
text-slate-900
">

{new Date(

rescue.expiryTime

).toLocaleString()}

</span>

</p>







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








</div>



);


}