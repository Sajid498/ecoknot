"use client";


import {
    useEffect,
    useState
} from "react";


import PickupCard from "@/components/PickupCard";


import {
    PickupRequest
} from "@/types/pickup";







const API_URL =

    process.env.NEXT_PUBLIC_API_URL ||

    "http://localhost:8080";









export default function MyPickupsPage(){



    const [pickups,setPickups] =

        useState<PickupRequest[]>([]);






    const [loading,setLoading] =

        useState(true);






    const [user,setUser] =

        useState<any>(null);









    useEffect(()=>{



        const savedUser =

            localStorage.getItem("user");




        if(savedUser){



            const userData =

                JSON.parse(savedUser);



            setUser(userData);



            loadPickups(

                userData.id

            );



        }



    },[]);









    async function loadPickups(

        userId:number

    ){



        try{



            setLoading(true);





            const response =

                await fetch(

`${API_URL}/api/pickups/volunteer/${userId}`

                );







            if(!response.ok){


                throw new Error(

                    "Failed to load pickups"

                );


            }







            const data =

                await response.json();







            setPickups(data);



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







<h1 className="
text-3xl
font-bold
text-slate-900
">

🚚 My Pickup Requests

</h1>







<p className="
mt-2
text-slate-600
">

Track your food and medicine rescue activities.

</p>









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

Loading pickup requests...

</div>








:





pickups.length===0 ?





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

🚚

</div>







<h2 className="
mt-4
text-xl
font-bold
">

No pickup request found

</h2>







<p className="
mt-2
text-slate-600
">

Request pickup from Relief Hub to see them here.

</p>







</div>








:





pickups.map(

(pickup)=>(



<PickupCard


key={pickup.id}


pickup={pickup}


onUpdate={

()=>loadPickups(

user.id

)

}


/>



)


)



}







</div>








</div>


</main>



);


}