"use client";


import {
    useEffect,
    useState
} from "react";


import Link from "next/link";


import RescueCard from "@/components/RescueCard";


import dynamic from "next/dynamic";


import {
    RescueDonation
} from "@/types/rescue";





const ReliefMap = dynamic(

    ()=>import("@/components/ReliefMap"),

    {
        ssr:false
    }

);






const API_URL =

    process.env.NEXT_PUBLIC_API_URL ||

    "http://localhost:8080";









export default function ReliefHubPage(){





    const [rescues,setRescues] =

        useState<RescueDonation[]>([]);




    const [loading,setLoading] =

        useState(true);




    const [filter,setFilter] =

        useState("ALL");




    const [userLat,setUserLat] =

        useState<number | null>(null);




    const [userLng,setUserLng] =

        useState<number | null>(null);




    const [nearbyMode,setNearbyMode] =

        useState(false);









    useEffect(()=>{


        loadReliefPosts();


    },[]);









    async function loadReliefPosts(){


        try{


            setLoading(true);



            const response =

                await fetch(

                    `${API_URL}/api/rescues`

                );





            if(!response.ok){


                throw new Error(

                    "Failed to load relief posts"

                );


            }






            const data =

                await response.json();





            setRescues(data);



        }

        catch(error){


            console.log(error);


        }

        finally{


            setLoading(false);


        }


    }









    function isUrgent(

        relief:RescueDonation

    ){



        const now =

            new Date().getTime();




        const expiry =

            new Date(

                relief.expiryTime

            ).getTime();





        const remaining =

            expiry-now;





        const oneDay =

            24 *

            60 *

            60 *

            1000;





        return(

            remaining > 0

            &&

            remaining <= oneDay

        );


    }









    function calculateDistance(

        lat1:number,

        lng1:number,

        lat2:number,

        lng2:number

    ){



        const R = 6371;



        const dLat =

            (

                (lat2-lat1)

                *

                Math.PI

                /

                180

            );




        const dLng =

            (

                (lng2-lng1)

                *

                Math.PI

                /

                180

            );





        const a =


            Math.sin(dLat/2)

            *

            Math.sin(dLat/2)

            +

            Math.cos(

                lat1*Math.PI/180

            )

            *

            Math.cos(

                lat2*Math.PI/180

            )

            *

            Math.sin(dLng/2)

            *

            Math.sin(dLng/2);





        const c =

            2 *

            Math.atan2(

                Math.sqrt(a),

                Math.sqrt(1-a)

            );





        return Number(

            (R*c).toFixed(2)

        );


    }









    function findNearbyRelief(){



        if(!navigator.geolocation){


            alert(

                "Location is not supported"

            );


            return;


        }






        navigator.geolocation.getCurrentPosition(

            (position)=>{



                setUserLat(

                    position.coords.latitude

                );



                setUserLng(

                    position.coords.longitude

                );



                setNearbyMode(true);



            },


            ()=>{


                alert(

                    "Please allow location access"

                );


            }


        );


    }












    const totalPosts = rescues.length;



    const availablePosts =

        rescues.filter(

            (item)=>

                item.status==="AVAILABLE"

        ).length;





    const foodPosts =

        rescues.filter(

            (item)=>

                item.type==="FOOD"

        ).length;





    const medicinePosts =

        rescues.filter(

            (item)=>

                item.type==="MEDICINE"

        ).length;













    const filteredReliefs =


        rescues

        .map((relief)=>{



            if(

                nearbyMode

                &&

                userLat!==null

                &&

                userLng!==null

                &&

                relief.latitude

                &&

                relief.longitude

            ){



                return {

                    ...relief,

                    distance:

                    calculateDistance(

                        userLat,

                        userLng,

                        relief.latitude,

                        relief.longitude

                    )

                };


            }





            return relief;



        })

        .filter((relief)=>{



            if(filter==="URGENT"){


                return isUrgent(relief);


            }





            if(filter==="FOOD"){


                return relief.type==="FOOD";


            }





            if(filter==="MEDICINE"){


                return relief.type==="MEDICINE";


            }





            return true;


        })

        .sort((a,b)=>{


            if(

                nearbyMode

                &&

                a.distance!==undefined

                &&

                b.distance!==undefined

            ){


                return (

                    a.distance

                    -

                    b.distance

                );


            }



            return 0;


        });













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







<div className="
flex
flex-col
gap-5
md:flex-row
md:items-center
md:justify-between
">





<div>


<h1 className="
text-3xl
font-bold
text-slate-900
">

🌱 Relief Hub

</h1>





<p className="
mt-2
text-slate-600
">

Connect surplus food and medicine with people who need them.

</p>


</div>







<Link

href="/rescue/create"

className="
rounded-xl
bg-emerald-700
px-5
py-3
font-semibold
text-white
hover:bg-emerald-800
"

>

+ Create Relief Post

</Link>






</div>









{/* Dashboard Statistics */}

<div className="
mt-10
grid
gap-5
md:grid-cols-4
">





<div className="
rounded-2xl
bg-white
p-6
shadow
border
">

<p className="
text-sm
text-slate-500
">

🌱 Total Relief Posts

</p>

<h2 className="
mt-3
text-3xl
font-bold
">

{totalPosts}

</h2>

</div>






<div className="
rounded-2xl
bg-white
p-6
shadow
border
">

<p className="
text-sm
text-slate-500
">

✅ Available

</p>

<h2 className="
mt-3
text-3xl
font-bold
text-emerald-700
">

{availablePosts}

</h2>

</div>






<div className="
rounded-2xl
bg-white
p-6
shadow
border
">

<p className="
text-sm
text-slate-500
">

🍱 Food Donations

</p>

<h2 className="
mt-3
text-3xl
font-bold
text-orange-600
">

{foodPosts}

</h2>

</div>







<div className="
rounded-2xl
bg-white
p-6
shadow
border
">

<p className="
text-sm
text-slate-500
">

💊 Medicine Donations

</p>

<h2 className="
mt-3
text-3xl
font-bold
text-blue-600
">

{medicinePosts}

</h2>

</div>





</div>









<button

onClick={findNearbyRelief}

className="
mt-8
rounded-xl
bg-blue-600
px-6
py-3
font-semibold
text-white
hover:bg-blue-700
"

>

📍 Find Nearby Relief

</button>









<div className="
mt-10
">

<h2 className="
mb-4
text-2xl
font-bold
">

🗺️ Relief Locations

</h2>




<ReliefMap

rescues={rescues}

/>



</div>









<div className="
mt-8
flex
flex-wrap
gap-3
">





<button
onClick={()=>setFilter("ALL")}
className="
rounded-full
bg-emerald-700
px-5
py-2
text-white
font-semibold
"
>
All
</button>





<button
onClick={()=>setFilter("URGENT")}
className="
rounded-full
bg-red-600
px-5
py-2
text-white
font-semibold
"
>
🔥 Urgent
</button>





<button
onClick={()=>setFilter("FOOD")}
className="
rounded-full
bg-orange-600
px-5
py-2
text-white
font-semibold
"
>
🍱 Food
</button>





<button
onClick={()=>setFilter("MEDICINE")}
className="
rounded-full
bg-blue-600
px-5
py-2
text-white
font-semibold
"
>
💊 Medicine
</button>






</div>









<div className="
mt-8
space-y-6
">





{

loading ?



<div className="
rounded-2xl
bg-white
p-6
shadow
">

Loading relief posts...

</div>







:

filteredReliefs.length===0 ?





<div className="
rounded-2xl
bg-white
p-8
text-center
shadow
">

No relief post available.

</div>







:

filteredReliefs.map((relief)=>(



<RescueCard

key={relief.id}

rescue={relief}

/>



))


}





</div>







</div>





</main>



);



}