"use client";


interface Props {

    stats:{
        reliefPosts:number;
        bloodRequests:number;
        completedPickups:number;
    };

}



export default function ProfileStats({

    stats

}:Props){



return(

<div className="
mt-10
grid
gap-5
md:grid-cols-3
">





<div className="
rounded-2xl
bg-emerald-50
p-6
border
border-emerald-200
">


<p className="
text-sm
text-slate-600
">

📦 Relief Shared

</p>


<h2 className="
mt-2
text-3xl
font-bold
text-emerald-700
">

{stats.reliefPosts}

</h2>


</div>









<div className="
rounded-2xl
bg-red-50
p-6
border
border-red-200
">


<p className="
text-sm
text-slate-600
">

🩸 Blood Requests

</p>


<h2 className="
mt-2
text-3xl
font-bold
text-red-700
">

{stats.bloodRequests}

</h2>


</div>









<div className="
rounded-2xl
bg-blue-50
p-6
border
border-blue-200
">


<p className="
text-sm
text-slate-600
">

🚚 Completed Pickup

</p>


<h2 className="
mt-2
text-3xl
font-bold
text-blue-700
">

{stats.completedPickups}

</h2>


</div>






</div>

);


}