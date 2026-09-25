"use client";


import {
    TimeOffer
} from "@/types/timebank";





interface Props {


    offer: TimeOffer;


}









export default function TimeOfferCard(

{

offer

}:Props

){







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
gap-4
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

📅 Posted:

<span className="
ml-1
font-semibold
text-slate-900
">

{
    new Date(
        offer.createdAt
    ).toLocaleDateString()
}

</span>

</p>





</div>








<div className="
mt-5
rounded-xl
bg-emerald-50
px-4
py-3
text-sm
font-medium
text-emerald-800
">

🤝 This skill is currently available to the community.

</div>






</div>



);


}