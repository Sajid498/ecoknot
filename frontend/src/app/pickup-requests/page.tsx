"use client";


import {
    useEffect,
    useState
} from "react";


import toast from "react-hot-toast";


import ProtectedRoute from "@/components/ProtectedRoute";


import LoadingCard from "@/components/LoadingCard";








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







    const [error,setError] =

        useState("");












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


            setError("");







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




            setError(

                "Unable to load pickup requests"

            );



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



                toast.success(

                    action==="approve"

                    ?

                    "Pickup request approved ✅"

                    :

                    "Pickup request rejected ❌"

                );





                loadRequests(

                    user.id

                );



            }

            else{



                toast.error(

                    "Action failed"

                );



            }





        }

        catch(error){



            console.log(error);



            toast.error(

                "Something went wrong"

            );



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









{

error &&


<div className="
mt-8
rounded-2xl
bg-red-50
p-8
text-center
">



<div className="
text-5xl
">

⚠️

</div>




<h2 className="
mt-4
text-xl
font-bold
text-red-700
">

Unable to load requests

</h2>






<p className="
mt-2
text-red-600
">

{error}

</p>







<button

onClick={()=>user && loadRequests(user.id)}

className="
mt-5
rounded-xl
bg-red-600
px-5
py-3
font-semibold
text-white
hover:bg-red-700
"

>

Retry

</button>



</div>



}









<div className="
mt-8
space-y-5
">







{

loading ?





<>


<LoadingCard />

<LoadingCard />

</>









:



requests.length===0 ?





<div className="
rounded-2xl
bg-white
p-10
text-center
shadow
">






<div className="
text-6xl
">

🚚

</div>






<h2 className="
mt-5
text-2xl
font-bold
text-slate-900
">

No Pickup Requests

</h2>






<p className="
mt-2
text-slate-600
">

No volunteers have requested your relief posts yet.

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
border
border-slate-100
"

>








<div className="
flex
justify-between
items-start
gap-4
">







<div>



<h2 className="
text-xl
font-bold
text-slate-900
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
text-slate-900
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
text-slate-900
">

{request.volunteer.location}

</span>


</p>





</div>









<span className={`

rounded-full

px-4

py-2

font-semibold

text-sm

${

request.status==="PENDING"

?

"bg-yellow-100 text-yellow-700"

:

request.status==="APPROVED"

?

"bg-emerald-100 text-emerald-700"

:

request.status==="REJECTED"

?

"bg-red-100 text-red-700"

:

"bg-slate-100 text-slate-700"

}

`}>


{request.status}


</span>







</div>









<div className="
mt-5
rounded-xl
bg-slate-50
p-4
">



<p className="
text-sm
text-slate-500
">

Relief Details

</p>



<p className="
mt-1
font-semibold
text-slate-900
">

{request.rescueDonation.type}

</p>




<p className="
text-slate-600
">

Quantity:

<span className="
ml-2
font-semibold
">

{request.rescueDonation.quantity}

</span>


</p>



</div>









{

request.status==="PENDING"

&&


<div className="
mt-5
flex
gap-3
">






<button

onClick={()=>updateRequest(

request.id,

"approve"

)}

className="
flex-1
rounded-xl
bg-emerald-700
px-5
py-3
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
flex-1
rounded-xl
bg-red-600
px-5
py-3
font-semibold
text-white
hover:bg-red-700
"

>

❌ Reject

</button>






</div>


}









</div>





))


}



</div>








</div>



</main>



</ProtectedRoute>



);



}