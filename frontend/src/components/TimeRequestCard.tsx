"use client";


import {
    TimeRequest
} from "@/types/timebank";





interface Props {


    request: TimeRequest;


    onAccept: (

        id:number

    ) => void;


}







export default function TimeRequestCard({

    request,

    onAccept

}:Props){





return (


<div

className="
rounded-2xl
bg-white
p-6
shadow-md
border
border-slate-200
"

>




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

{request.title}

</h2>




<p className="
mt-2
text-sm
text-slate-600
">

{request.description}

</p>


</div>





<span

className="
rounded-full
bg-emerald-100
px-3
py-1
text-sm
font-semibold
text-emerald-700
"

>

{request.status}

</span>



</div>








<div className="
mt-5
space-y-2
text-sm
text-slate-700
">


<p>

👤 Requested by:

<strong>

{" "}

{request.requester.name}

</strong>

</p>




<p>

🛠 Category:

<strong>

{" "}

{request.category}

</strong>

</p>




<p>

⏳ Required Time:

<strong>

{" "}

{request.requiredHours}

hours

</strong>

</p>



</div>









{

request.status === "OPEN" &&



<button

onClick={()=>onAccept(request.id)}

className="
mt-6
w-full
rounded-xl
bg-emerald-700
py-3
font-semibold
text-white
transition
hover:bg-emerald-800
"

>

Accept Help Request

</button>



}





</div>


);


}