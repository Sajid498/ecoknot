"use client";


import {
    useEffect,
    useState
} from "react";


import ProtectedRoute from "@/components/ProtectedRoute";







const API_URL =

    process.env.NEXT_PUBLIC_API_URL ||

    "http://localhost:8080";









type ReliefPost = {


    id:number;


    status:

    | "AVAILABLE"

    | "RESERVED"

    | "PICKED_UP"

    | "DELIVERED"

    | "EXPIRED";


};







type PickupRequest = {


    id:number;


    status:

    | "PENDING"

    | "APPROVED"

    | "PICKED_UP"

    | "DELIVERED"

    | "REJECTED";


};









type Stats = {


    totalPosts:number;


    activePosts:number;


    pickupRequests:number;


    pendingRequests:number;


    approvedRequests:number;


    completed:number;


};









export default function ReliefDashboardPage(){





    const [stats,setStats] =

        useState<Stats>({


            totalPosts:0,


            activePosts:0,


            pickupRequests:0,


            pendingRequests:0,


            approvedRequests:0,


            completed:0


        });







    const [loading,setLoading] =

        useState(true);









    useEffect(()=>{



        const savedUser =

            localStorage.getItem("user");




        if(savedUser){



            const userData =

                JSON.parse(savedUser);



            loadDashboard(

                userData.id

            );


        }



    },[]);













    async function loadDashboard(

        userId:number

    ){



        try{


            setLoading(true);






            const [

                reliefResponse,

                pickupResponse

            ] = await Promise.all([



                fetch(

`${API_URL}/api/rescues/user/${userId}`

                ),




                fetch(

`${API_URL}/api/pickups/owner/${userId}`

                )



            ]);









            const reliefPosts:

            ReliefPost[]

            =

            await reliefResponse.json();









            const pickupRequests:

            PickupRequest[]

            =

            await pickupResponse.json();









            const activePosts =

                reliefPosts.filter(

                    post =>


                    post.status === "AVAILABLE"

                    ||

                    post.status === "RESERVED"

                    ||

                    post.status === "PICKED_UP"


                )

                .length;









            const completed =

                reliefPosts.filter(

                    post =>


                    post.status === "DELIVERED"


                )

                .length;









            const pendingRequests =

                pickupRequests.filter(

                    pickup =>


                    pickup.status === "PENDING"


                )

                .length;









            const approvedRequests =

                pickupRequests.filter(

                    pickup =>


                    pickup.status === "APPROVED"


                )

                .length;









            setStats({


                totalPosts:

                    reliefPosts.length,



                activePosts,



                pickupRequests:

                    pickupRequests.length,



                pendingRequests,



                approvedRequests,



                completed



            });







        }

        catch(error){


            console.log(

                "Dashboard error:",

                error

            );


        }

        finally{


            setLoading(false);


        }



    }













    const cards = [



        {


            title:"Total Posts",


            value:stats.totalPosts,


            icon:"📦",


            color:"bg-blue-50"



        },





        {


            title:"Active Posts",


            value:stats.activePosts,


            icon:"🌱",


            color:"bg-emerald-50"



        },





        {


            title:"Pickup Requests",


            value:stats.pickupRequests,


            icon:"🚚",


            color:"bg-orange-50"



        },





        {


            title:"Pending Requests",


            value:stats.pendingRequests,


            icon:"⏳",


            color:"bg-yellow-50"



        },





        {


            title:"Approved Requests",


            value:stats.approvedRequests,


            icon:"🟢",


            color:"bg-green-50"



        },





        {


            title:"Completed",


            value:stats.completed,


            icon:"✅",


            color:"bg-purple-50"



        }




    ];












return(



<ProtectedRoute>



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







<div className="
rounded-3xl
bg-white
p-8
shadow-lg
">







<h1 className="
text-3xl
font-bold
text-slate-900
">

📊 Relief Dashboard

</h1>







<p className="
mt-2
text-slate-600
">

Track your community contribution and relief activities.

</p>









{

loading ?





<div className="
mt-8
rounded-xl
bg-slate-50
p-6
text-center
">

Loading dashboard...

</div>







:





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

className={`

rounded-2xl

p-6

${card.color}

`}

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
text-slate-600
">

{card.title}

</h2>







<p className="
mt-2
text-4xl
font-bold
text-slate-900
">

{card.value}

</p>







</div>





))






}



</div>





}







</div>






</div>





</main>



</ProtectedRoute>


);



}