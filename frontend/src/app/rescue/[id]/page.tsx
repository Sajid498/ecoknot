"use client";


import {
    useEffect,
    useState
} from "react";


import {
    useParams,
    useRouter
} from "next/navigation";


import Link from "next/link";


import ProtectedRoute from "@/components/ProtectedRoute";







const API_URL =

    process.env.NEXT_PUBLIC_API_URL ||

    "http://localhost:8080";









type RescueDetails = {


    id:number;


    title:string;


    description:string;


    type:string;


    quantity:number;


    location:string;


    latitude:number | null;


    longitude:number | null;


    expiryTime:string;


    status:string;


    userName:string;


    userId:number;


    createdAt:string;


};









export default function RescueDetailsPage(){



    const params = useParams();


    const router = useRouter();




    const id = params.id as string;







    const [rescue,setRescue] =

        useState<RescueDetails | null>(null);





    const [loading,setLoading] =

        useState(true);





    const [user,setUser] =

        useState<any>(null);





    const [message,setMessage] =

        useState("");









    useEffect(()=>{


        const savedUser =

            localStorage.getItem("user");



        if(savedUser){


            setUser(

                JSON.parse(savedUser)

            );


        }




        loadRescue();



    },[]);









    async function loadRescue(){



        try{


            const response =

                await fetch(

`${API_URL}/api/rescues/${id}`

                );





            const data =

                await response.json();





            setRescue(data);



        }

        catch(error){


            console.log(error);


        }

        finally{


            setLoading(false);


        }



    }









    async function requestPickup(){



        if(!user){


            setMessage(

                "Please login first"

            );


            return;


        }






        if(user.id === rescue?.userId){


            setMessage(

                "You cannot request your own post"

            );


            return;


        }







        try{



            const response =

                await fetch(

`${API_URL}/api/pickups?rescueId=${id}&volunteerId=${user.id}`,

                {

                    method:"POST"

                }

                );







            if(response.ok){


                setMessage(

                    "🚚 Pickup request sent successfully"

                );


            }

            else{


                setMessage(

                    "Pickup request failed"

                );


            }


        }

        catch(error){


            console.log(error);


        }



    }









    if(loading){


        return(


            <main className="
            min-h-screen
            bg-slate-50
            p-10
            ">


                Loading relief details...


            </main>


        );


    }









    if(!rescue){


        return(


            <main className="
            min-h-screen
            bg-slate-50
            p-10
            ">


                Relief post not found.


            </main>


        );


    }









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
max-w-4xl
">







<Link

href="/rescue"

className="
text-emerald-700
font-semibold
"

>

← Back to Relief Hub

</Link>









<div className="
mt-6
rounded-3xl
bg-white
p-8
shadow-lg
">







<div className="
flex
justify-between
items-start
gap-4
">





<div>



<div className="
text-5xl
">

{

rescue.type==="FOOD"

?

"🍱"

:

"💊"

}

</div>






<h1 className="
mt-4
text-3xl
font-bold
text-slate-900
">

{rescue.title}

</h1>




</div>








<span className="
rounded-full
bg-emerald-100
px-4
py-2
font-semibold
text-emerald-700
">

{rescue.status}

</span>







</div>









<p className="
mt-6
text-lg
text-slate-600
">

{rescue.description}

</p>









<div className="
mt-8
grid
gap-4
md:grid-cols-2
">





<div className="
rounded-xl
bg-slate-50
p-5
">

📦 Quantity

<h3 className="
mt-2
font-bold
">

{rescue.quantity}

</h3>

</div>







<div className="
rounded-xl
bg-slate-50
p-5
">

📍 Location

<h3 className="
mt-2
font-bold
">

{rescue.location}

</h3>

</div>







<div className="
rounded-xl
bg-slate-50
p-5
">

⏳ Expiry

<h3 className="
mt-2
font-bold
">

{

new Date(

rescue.expiryTime

)

.toLocaleString()

}

</h3>

</div>







<div className="
rounded-xl
bg-slate-50
p-5
">

👤 Shared By

<h3 className="
mt-2
font-bold
">

{rescue.userName}

</h3>

</div>






</div>









<button

onClick={requestPickup}

disabled={rescue.status!=="AVAILABLE"}

className="
mt-8
w-full
rounded-xl
bg-emerald-700
py-4
font-bold
text-white
hover:bg-emerald-800
disabled:bg-gray-300
"

>

🚚 Request Pickup

</button>








{

message &&


<p className="
mt-4
rounded-xl
bg-emerald-50
p-3
text-center
font-semibold
text-emerald-700
">

{message}

</p>


}








</div>







</div>






</main>



</ProtectedRoute>



);



}