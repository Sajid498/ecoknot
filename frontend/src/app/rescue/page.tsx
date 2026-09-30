"use client";


import {
    useEffect,
    useRef,
    useState
} from "react";


import Link from "next/link";


import {
    useSearchParams
} from "next/navigation";


import RescueCard from "@/components/RescueCard";


import LoadingCard from "@/components/LoadingCard";


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



    const searchParams =

        useSearchParams();



    const nearbyInitialized =

        useRef(false);







    const [rescues,setRescues] =

        useState<RescueDonation[]>([]);







    const [loading,setLoading] =

        useState(true);






    const [error,setError] =

        useState("");







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







    useEffect(()=>{


        if(

            searchParams.get("nearby") === "true"

            &&

            !nearbyInitialized.current

        ){


            nearbyInitialized.current = true;


            findNearbyRelief();


        }


    },[searchParams]);












    async function loadReliefPosts(){



        try{



            setLoading(true);


            setError("");







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




            setError(

                "Unable to load relief posts. Please try again."

            );





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


                const lat =

                    position.coords.latitude;



                const lng =

                    position.coords.longitude;





                setUserLat(lat);


                setUserLng(lng);


                setNearbyMode(true);



            },



            ()=>{


                alert(

                    "Please allow location access"

                );


            }



        );



    }












    const filteredReliefs =


        rescues

        .map((relief)=>{





            if(

                nearbyMode

                &&

                userLat

                &&

                userLng

                &&

                relief.latitude

                &&

                relief.longitude

            ){



                return{


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

                a.distance

                &&

                b.distance

            ){



                return (

                    a.distance

                    -

                    b.distance

                );


            }



            return 0;



        });











return (

<main className="
    min-h-screen
    bg-slate-50
    pt-8
">


<div className="
    max-w-7xl
    mx-auto
    px-6
    py-10
">



{/* HERO */}

<section

className="
    rounded-3xl
    bg-gradient-to-br
    from-emerald-50
    to-white
    border
    border-slate-200
    p-8
    md:p-12
    flex
    flex-col
    md:flex-row
    md:items-center
    md:justify-between
    gap-8
"

>


<div>


<h1

className="
text-4xl
font-bold
text-slate-900
"

>

🌱 Relief Hub

</h1>



<p

className="
mt-4
max-w-xl
text-slate-600
text-lg
"

>

Connect surplus food and medicine with people who need them.

</p>



<div

className="
mt-6
flex
flex-wrap
gap-3
"

>


<Link

href="/rescue/create"

className="
rounded-xl
bg-emerald-700
px-6
py-3
font-semibold
text-white
hover:bg-emerald-800
transition
"

>

+ Create Relief Post

</Link>



<button

onClick={findNearbyRelief}

className="
rounded-xl
bg-blue-600
px-6
py-3
font-semibold
text-white
hover:bg-blue-700
transition
"

>

📍 Find Nearby Relief

</button>


</div>



</div>



<div

className="
hidden
md:flex
w-52
h-52
rounded-full
bg-emerald-100
items-center
justify-center
text-7xl
"

>

🌱

</div>



</section>







{/* MAP SECTION */}


<section

className="
mt-12
"

>


<h2

className="
text-2xl
font-bold
text-slate-900
mb-5
"

>

Relief Locations

</h2>



<div

className="
rounded-3xl
overflow-hidden
border
border-slate-200
shadow-sm
bg-white
"

>


<ReliefMap

rescues={rescues}

/>


</div>



</section>







{/* FILTERS */}


<div

className="
mt-10
flex
flex-wrap
gap-3
"

>


<button

onClick={()=>setFilter("ALL")}

className="
rounded-full
bg-emerald-700
px-5
py-2
font-semibold
text-white
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
font-semibold
text-white
"

>

Urgent

</button>



<button

onClick={()=>setFilter("FOOD")}

className="
rounded-full
bg-orange-600
px-5
py-2
font-semibold
text-white
"

>

Food

</button>



<button

onClick={()=>setFilter("MEDICINE")}

className="
rounded-full
bg-blue-600
px-5
py-2
font-semibold
text-white
"

>

Medicine

</button>



</div>







{/* EXISTING ERROR / LOADING / CARDS SECTION */}

<div

className="
mt-10
space-y-6
"

>

{
loading ?

<>

<LoadingCard/>

<LoadingCard/>

<LoadingCard/>

</>


:

filteredReliefs.length===0 ?


<div

className="
rounded-3xl
bg-white
border
border-slate-200
p-12
text-center
"

>

<div className="text-6xl">

📦

</div>


<h2

className="
mt-5
text-2xl
font-bold
"

>

No Relief Available

</h2>


<p

className="
mt-2
text-slate-600
"

>

There are currently no food or medicine support posts.

</p>


</div>


:


filteredReliefs.map(

(relief)=>(

<RescueCard

key={relief.id}

rescue={relief}

/>

)

)

}



</div>





</div>


</main>

);



}