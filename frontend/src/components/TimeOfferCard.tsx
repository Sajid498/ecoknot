"use client";


import {
    TimeOffer
} from "@/types/timebank";





interface Props {


    offer: TimeOffer;


    onComplete?:()=>void;


}









export default function TimeOfferCard(

{

offer,

onComplete

}:Props

){







async function completeOffer(){



    try{


        const user =

            JSON.parse(

                localStorage.getItem("user") || "{}"

            );





        const response =

            await fetch(

`http://localhost:8080/api/time-bank/complete/${offer.id}?userId=${user.id}`,

                {

                    method:"PUT"

                }

            );







        if(response.ok){


            if(onComplete){

                onComplete();

            }


        }



    }

    catch(error){


        console.log(error);


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
"

>





<div>


<h2 className="
text-xl
font-bold
text-slate-900
">

⏳ {offer.title}

</h2>



<p className="
mt-2
text-sm
text-slate-600
">

{offer.description}

</p>



</div>







<span className="
rounded-full
bg-emerald-100
px-3
py-1
text-sm
font-semibold
text-emerald-700
">

{offer.status}

</span>





</div>









<div className="
mt-5
space-y-2
rounded-xl
bg-slate-50
p-4
text-sm
"

>



<p>

🛠 Skill:

<span className="
ml-1
font-semibold
text-slate-900
">

{offer.skillCategory}

</span>

</p>







<p>

⏱ Available Time:

<span className="
ml-1
font-semibold
text-slate-900
">

{offer.availableHours} hours

</span>

</p>







<p>

👤 Volunteer:

<span className="
ml-1
font-semibold
text-slate-900
">

{offer.userName || "Community Member"}

</span>

</p>





</div>









{

offer.status === "AVAILABLE"

&&


<button

onClick={completeOffer}

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
"

>

🤝 Complete Exchange

</button>



}






</div>



);


}