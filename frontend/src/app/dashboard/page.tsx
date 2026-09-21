"use client";


import {
    useEffect,
    useState
} from "react";


import Navbar from "@/components/Navbar";






const API_URL =

    process.env.NEXT_PUBLIC_API_URL ||

    "http://localhost:8080";









interface DashboardStats{


    totalRelief:number;


    foodDonations:number;


    medicineDonations:number;


    completedDeliveries:number;


    totalUsers:number;


}









export default function DashboardPage(){





    const [stats,setStats] =

        useState<DashboardStats | null>(null);




    const [loading,setLoading] =

        useState(true);









    useEffect(()=>{


        loadDashboard();


    },[]);









    async function loadDashboard(){



        try{



            const response =

                await fetch(

                    `${API_URL}/api/dashboard/stats`

                );







            if(!response.ok){


                throw new Error(

                    "Failed to load dashboard"

                );


            }







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









    const cards = [



        {

            title:"Total Relief Posts",

            value:stats?.totalRelief,

            icon:"🌱"

        },




        {

            title:"Food Donations",

            value:stats?.foodDonations,

            icon:"🍱"

        },




        {

            title:"Medicine Donations",

            value:stats?.medicineDonations,

            icon:"💊"

        },




        {

            title:"Completed Deliveries",

            value:stats?.completedDeliveries,

            icon:"🚚"

        },




        {

            title:"Community Users",

            value:stats?.totalUsers,

            icon:"👥"

        }



    ];









return(



<main className="

min-h-screen

bg-slate-50

">





<Navbar />







<div className="

mx-auto

max-w-6xl

px-6

py-10

">







<h1 className="

text-3xl

font-bold

text-slate-900

">

📊 EcoKnot Dashboard

</h1>








<p className="

mt-2

text-slate-600

">

Overview of community activities and relief operations.

</p>









<div className="

mt-8

grid

gap-6

sm:grid-cols-2

lg:grid-cols-3

">







{

cards.map((card)=>(



<div

key={card.title}

className="

rounded-2xl

bg-white

p-6

shadow-md

transition

hover:shadow-lg

"

>




<div className="

text-4xl

">

{card.icon}

</div>







<h2 className="

mt-4

text-sm

font-semibold

text-slate-500

">

{card.title}

</h2>







<p className="

mt-2

text-3xl

font-bold

text-slate-900

">


{

loading

?

"..."

:

card.value

}



</p>





</div>



))



}







</div>









</div>







</main>



);



}