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








export default function RescuePage(){



    const [rescues,setRescues] =

        useState<RescueDonation[]>([]);





    const [loading,setLoading] =

        useState(true);









    useEffect(()=>{


        loadRescues();


    },[]);









    async function loadRescues(){


        try{


            setLoading(true);





            const response =

                await fetch(

                    `${API_URL}/api/rescues`

                );







            if(!response.ok){


                throw new Error(

                    "Failed to load rescues"

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

🍱 Food & Medicine Rescue

</h1>






<p className="
mt-2
text-slate-600
">

Rescue surplus food and medicine by connecting donors with the community.

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

+ Create Rescue

</Link>





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

Loading rescue posts...

</div>







:





rescues.length===0 ?





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

🍱

</div>





<h2 className="
mt-4
text-xl
font-bold
">

No rescue donation available

</h2>






<p className="
mt-2
text-slate-600
">

Be the first person to create a rescue donation.

</p>






</div>







:





rescues.map(

(rescue)=>(


<RescueCard


key={rescue.id}


rescue={rescue}


/>


)


)



}







</div>








</div>


</main>


);


}