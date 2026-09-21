"use client";


import {
    useEffect,
    useState
} from "react";


import PickupRequestCard from "@/components/PickupRequestCard";


import {
    PickupRequest
} from "@/types/pickup";


import {
    RescueDonation
} from "@/types/rescue";







const API_URL =

    process.env.NEXT_PUBLIC_API_URL ||

    "http://localhost:8080";









export default function ManageReliefPage(){



    const [rescues,setRescues] =

        useState<RescueDonation[]>([]);





    const [pickupRequests,setPickupRequests] =

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



            loadMyRescues(

                userData.id

            );



        }



    },[]);









    async function loadMyRescues(

        userId:number

    ){



        try{



            setLoading(true);





            const response =

                await fetch(

`${API_URL}/api/rescues/user/${userId}`

                );






            const data =

                await response.json();






            setRescues(data);





            if(data.length>0){


                loadPickupRequests(

                    data[0].id

                );


            }





        }

        catch(error){


            console.log(error);


        }

        finally{


            setLoading(false);


        }


    }









    async function loadPickupRequests(

        rescueId:number

    ){



        try{



            const response =

                await fetch(

`${API_URL}/api/pickups/relief/${rescueId}`

                );






            const data =

                await response.json();






            setPickupRequests(data);



        }

        catch(error){


            console.log(error);


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

🌱 Manage Relief Requests

</h1>








<p className="
mt-2
text-slate-600
">

Approve or reject volunteer pickup requests.

</p>









{

loading ?



<div className="
mt-8
rounded-xl
bg-white
p-6
shadow
">

Loading...

</div>







:



rescues.length===0 ?



<div className="
mt-8
rounded-xl
bg-white
p-8
text-center
shadow
">

No relief posts created yet.

</div>







:



<div className="
mt-8
space-y-8
">





{

rescues.map(

(rescue)=>(


<div

key={rescue.id}

className="
rounded-2xl
bg-white
p-6
shadow
"

>



<h2 className="
text-xl
font-bold
">

{rescue.title}

</h2>





<p className="
mt-2
text-slate-600
">

📍 {rescue.location}

</p>









{

pickupRequests.length===0 ?


<p className="
mt-5
text-slate-500
">

No pickup requests yet.

</p>



:


pickupRequests.map(

(pickup)=>(


<PickupRequestCard


key={pickup.id}


pickup={pickup}


onUpdate={

()=>loadPickupRequests(

rescue.id

)

}


/>


)


)


}






</div>



)


)

}





</div>



}







</div>


</main>



);


}