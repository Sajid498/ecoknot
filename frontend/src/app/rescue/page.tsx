"use client";


import {
    useEffect,
    useState
} from "react";


import Link from "next/link";


import RescueCard from "@/components/RescueCard";


import {
    RescueDonation
} from "@/types/rescue";






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

            expiry - now;







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












    const filteredReliefs =

        rescues.filter(

            (relief)=>{



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



            }

        );









return(


<main className="
min-h-screen
bg-slate-50
p-6
md:p-10
">






<div className="
mx-auto
max-w-5xl
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

Connect surplus food and medicine with people who need them before resources go to waste.

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












<div className="
mt-8
flex
flex-wrap
gap-3
">





<button

onClick={()=>setFilter("ALL")}

className={

filter==="ALL"

?

"rounded-full bg-emerald-700 px-5 py-2 text-white font-semibold"

:

"rounded-full bg-white px-5 py-2 font-semibold shadow"

}

>

All

</button>







<button

onClick={()=>setFilter("URGENT")}

className={

filter==="URGENT"

?

"rounded-full bg-red-600 px-5 py-2 text-white font-semibold"

:

"rounded-full bg-white px-5 py-2 font-semibold shadow"

}

>

🔥 Urgent

</button>








<button

onClick={()=>setFilter("FOOD")}

className={

filter==="FOOD"

?

"rounded-full bg-orange-600 px-5 py-2 text-white font-semibold"

:

"rounded-full bg-white px-5 py-2 font-semibold shadow"

}

>

🍱 Food

</button>








<button

onClick={()=>setFilter("MEDICINE")}

className={

filter==="MEDICINE"

?

"rounded-full bg-blue-600 px-5 py-2 text-white font-semibold"

:

"rounded-full bg-white px-5 py-2 font-semibold shadow"

}

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



<div className="
text-5xl
">

🌱

</div>







<h2 className="
mt-4
text-xl
font-bold
">

No relief post available

</h2>







<p className="
mt-2
text-slate-600
">

No matching relief post found.

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