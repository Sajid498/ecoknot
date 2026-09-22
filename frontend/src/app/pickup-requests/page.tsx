"use client";


import {
    useEffect,
    useState
} from "react";



import ProtectedRoute from "@/components/ProtectedRoute";





const API_URL =

    process.env.NEXT_PUBLIC_API_URL ||

    "http://localhost:8080";








type PickupRequest = {


    id:number;


    status:string;


    volunteer:{


        id:number;

        name:string;

        email:string;

        location:string;


    };


    rescueDonation:{


        id:number;

        title:string;

        type:string;

        quantity:string;

        location:string;


    };


};









export default function PickupRequestsPage(){



    const [requests,setRequests] =

        useState<PickupRequest[]>([]);




    const [user,setUser] =

        useState<any>(null);




    const [loading,setLoading] =

        useState(true);









    useEffect(()=>{


        const savedUser =

            localStorage.getItem("user");



        if(savedUser){



            const userData =

                JSON.parse(savedUser);



            setUser(userData);



            loadRequests(

                userData.id

            );


        }


    },[]);









    async function loadRequests(

        userId:number

    ){


        try{


            setLoading(true);



            const response =

                await fetch(

`${API_URL}/api/pickups/owner/${userId}`

                );




            if(!response.ok){


                throw new Error(

                    "Failed to load requests"

                );


            }




            const data =

                await response.json();




            setRequests(data);



        }

        catch(error){


            console.log(error);


        }

        finally{


            setLoading(false);


        }


    }









    async function updateRequest(

        id:number,

        action:"approve"|"reject"

    ){



        try{


            const response =

                await fetch(

`${API_URL}/api/pickups/${id}/${action}?userId=${user.id}`,

                    {

                        method:"PUT"

                    }

                );





            if(response.ok){


                loadRequests(

                    user.id

                );


            }



        }

        catch(error){


            console.log(error);


        }



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
max-w-5xl
">






<h1 className="
text-3xl
font-bold
text-slate-900
">

🚚 Pickup Requests

</h1>





<p className="
mt-2
text-slate-600
">

Manage requests from volunteers for your relief posts.

</p>









<div className="
mt-8
space-y-5
">






{

loading ?



<div className="
rounded-2xl
bg-white
p-6
shadow
">

Loading requests...

</div>





:



requests.length===0 ?





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

No pickup requests

</h2>


<p className="
mt-2
text-slate-600
">

No volunteers requested your relief posts yet.

</p>


</div>






:





requests.map((request)=>(


<div

key={request.id}

className="
rounded-2xl
bg-white
p-6
shadow
"

>




<div className="
flex
justify-between
items-start
">


<div>


<h2 className="
text-xl
font-bold
">

{request.rescueDonation.title}

</h2>



<p className="
mt-2
text-slate-600
">

Volunteer:

<span className="
ml-2
font-semibold
">

{request.volunteer.name}

</span>


</p>



<p className="
text-slate-600
">

Location:

<span className="
ml-2
font-semibold
">

{request.volunteer.location}

</span>


</p>


</div>







<span className="
rounded-full
bg-yellow-100
px-4
py-2
font-semibold
text-yellow-700
">

{request.status}

</span>



</div>







<div className="
mt-5
flex
gap-3
">



{

request.status==="PENDING"

&&


<>



<button

onClick={()=>updateRequest(

request.id,

"approve"

)}

className="
rounded-xl
bg-emerald-700
px-5
py-2
font-semibold
text-white
hover:bg-emerald-800
"

>

✅ Accept

</button>






<button

onClick={()=>updateRequest(

request.id,

"reject"

)}

className="
rounded-xl
bg-red-600
px-5
py-2
font-semibold
text-white
hover:bg-red-700
"

>

❌ Reject

</button>



</>



}





</div>





</div>



))



}




</div>






</div>


</main>



</ProtectedRoute>


);


}