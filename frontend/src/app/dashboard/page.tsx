"use client";


import {
    useEffect,
    useState
} from "react";




const API_URL =

    process.env.NEXT_PUBLIC_API_URL ||

    "http://localhost:8080";






interface Stats{


    totalRelief:number;

    foodDonations:number;

    medicineDonations:number;

    completedDeliveries:number;

    totalUsers:number;


}









export default function DashboardPage(){





    const [stats,setStats] =

        useState<Stats | null>(null);





    const [loading,setLoading] =

        useState(true);






    useEffect(()=>{


        loadStats();


    },[]);









    async function loadStats(){



        try{



            const response =

                await fetch(

`${API_URL}/api/dashboard/stats`

                );






            const data =

                await response.json();






            setStats(data);



        }


        catch(error){


            console.log(error);


        }


        finally{


            setLoading(false);


        }


    }









    if(loading){


        return(

            <main className="
            min-h-screen
            bg-slate-50
            flex
            items-center
            justify-center
            ">

                <div className="
                rounded-xl
                bg-white
                p-8
                shadow
                ">

                    Loading dashboard...

                </div>


            </main>

        );


    }











return(



<main className="
min-h-screen
bg-slate-50
p-6
md:p-10
">





<div className="
mx-auto
max-w-6xl
">







<h1 className="
text-3xl
font-bold
text-slate-900
">

🌱 EcoKnot Community Dashboard

</h1>



<p className="
mt-2
text-slate-600
">

See the impact created by our community.

</p>









<div className="
mt-10
grid
grid-cols-1
gap-6
sm:grid-cols-2
lg:grid-cols-5
">







<Card

title="Total Users"

value={stats?.totalUsers || 0}

icon="👥"

/>







<Card

title="Relief Posts"

value={stats?.totalRelief || 0}

icon="📦"

/>







<Card

title="Food Donations"

value={stats?.foodDonations || 0}

icon="🍱"

/>







<Card

title="Medicine"

value={stats?.medicineDonations || 0}

icon="💊"

/>







<Card

title="Completed"

value={stats?.completedDeliveries || 0}

icon="🚚"

/>






</div>








<div className="
mt-10
rounded-3xl
bg-white
p-8
shadow
">



<h2 className="
text-2xl
font-bold
text-slate-900
">

Community Impact

</h2>




<div className="
mt-5
grid
gap-4
md:grid-cols-3
">



<div className="
rounded-xl
bg-emerald-50
p-5
">

🌱 Helping people through relief sharing

</div>



<div className="
rounded-xl
bg-red-50
p-5
">

🩸 Supporting blood donation activities

</div>



<div className="
rounded-xl
bg-blue-50
p-5
">

🚚 Delivering resources to communities

</div>



</div>



</div>







</div>


</main>


);


}









function Card({

title,

value,

icon

}:{

title:string;

value:number;

icon:string;

}){


return(


<div className="
rounded-3xl
bg-white
p-6
shadow
transition
hover:-translate-y-1
">


<div className="
text-3xl
">

{icon}

</div>



<h3 className="
mt-4
text-sm
text-slate-600
">

{title}

</h3>



<p className="
mt-2
text-3xl
font-bold
text-emerald-700
">

{value}

</p>



</div>


);


}