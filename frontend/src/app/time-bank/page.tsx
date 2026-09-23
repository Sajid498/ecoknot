"use client";


import {
    useEffect,
    useState
} from "react";


import TimeOfferCard from "@/components/TimeOfferCard";


import {
    TimeOffer
} from "@/types/timebank";







const API_URL =

    process.env.NEXT_PUBLIC_API_URL ||

    "http://localhost:8080";









export default function TimeBankPage(){






    const [offers,setOffers] =

        useState<TimeOffer[]>([]);






    const [balance,setBalance] =

        useState(0);






    const [loading,setLoading] =

        useState(true);









    const user =

        typeof window !== "undefined"

        ?

        JSON.parse(

            localStorage.getItem("user") || "{}"

        )

        :

        {};









    useEffect(()=>{


        if(user.id){


            loadData();


        }


    },[]);









    async function loadData(){



        try{



            await Promise.all([

                loadBalance(),

                loadOffers()

            ]);



        }

        catch(error){



            console.log(error);



        }

        finally{


            setLoading(false);


        }


    }









    async function loadBalance(){



        const response =

            await fetch(

`${API_URL}/api/time-bank/balance/${user.id}`

            );






        const data =

            await response.json();







        setBalance(data);



    }









    async function loadOffers(){



        const response =

            await fetch(

`${API_URL}/api/time-bank/offers`

            );






        const data =

            await response.json();






        setOffers(data);



    }









    if(loading){


        return(

            <main className="
            min-h-screen
            flex
            items-center
            justify-center
            bg-slate-50
            ">


                <div className="
                rounded-xl
                bg-white
                p-8
                shadow
                ">

                    Loading Time Bank...

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

⏳ Volunteer Time Bank

</h1>





<p className="
mt-2
text-slate-600
">

Exchange skills and time instead of money.

</p>









{/* CREDIT CARD */}


<div className="
mt-8
rounded-3xl
bg-emerald-700
p-8
text-white
shadow-lg
">


<p className="
text-sm
opacity-90
">

My Time Credits

</p>



<h2 className="
mt-3
text-5xl
font-bold
">

{balance}

</h2>



<p className="
mt-2
">

hours available

</p>



</div>









{/* OFFERS */}


<section className="
mt-10
">


<h2 className="
text-2xl
font-bold
text-slate-900
">

Available Volunteer Help

</h2>









{

offers.length === 0 ?



<div className="
mt-5
rounded-2xl
bg-white
p-8
text-center
text-slate-600
shadow
">

No volunteer offers available yet.

</div>





:


<div className="
mt-6
grid
gap-6
md:grid-cols-2
">


{

offers.map(

offer =>


<TimeOfferCard

key={offer.id}

offer={offer}

onComplete={loadData}

/>


)


}


</div>



}




</section>








</div>


</main>



);



}