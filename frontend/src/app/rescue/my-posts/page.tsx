"use client";


import {
    useEffect,
    useState
} from "react";


import Link from "next/link";


import ProtectedRoute from "@/components/ProtectedRoute";







const API_URL =

    process.env.NEXT_PUBLIC_API_URL ||

    "http://localhost:8080";







type RescuePost = {


    id:number;


    title:string;


    description:string;


    type:string;


    quantity:number;


    location:string;


    expiryTime:string;


    status:string;


    createdAt:string;


};









export default function MyReliefPostsPage(){



    const [posts,setPosts] =

        useState<RescuePost[]>([]);





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



            loadPosts(

                userData.id

            );


        }



    },[]);









    async function loadPosts(

        userId:number

    ){


        try{


            setLoading(true);



            const response =

                await fetch(

`${API_URL}/api/rescues/user/${userId}`

                );




            if(!response.ok){


                throw new Error(

                    "Failed to load posts"

                );


            }





            const data =

                await response.json();




            setPosts(data);



        }

        catch(error){


            console.log(error);


        }

        finally{


            setLoading(false);


        }



    }









    function statusStyle(

        status:string

    ){



        switch(status){



            case "AVAILABLE":

                return "bg-emerald-100 text-emerald-700";



            case "RESERVED":

                return "bg-yellow-100 text-yellow-700";



            case "DELIVERED":

                return "bg-purple-100 text-purple-700";



            default:

                return "bg-red-100 text-red-700";


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
max-w-6xl
">






<div className="
rounded-3xl
bg-white
p-8
shadow-lg
">






<div className="
flex
items-center
justify-between
">




<div>


<h1 className="
text-3xl
font-bold
text-slate-900
">

📦 My Relief Posts

</h1>




<p className="
mt-2
text-slate-600
">

Manage the relief items you shared.

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

+ Create New

</Link>



</div>












{

loading ?



<div className="
mt-8
rounded-xl
bg-slate-50
p-6
">

Loading posts...

</div>






:



posts.length===0 ?



<div className="
mt-8
rounded-xl
bg-slate-50
p-8
text-center
">




<div className="
text-5xl
">

📦

</div>



<h2 className="
mt-4
text-xl
font-bold
">

No relief posts found

</h2>



<p className="
mt-2
text-slate-600
">

You have not shared any relief yet.

</p>



</div>







:



<div className="
mt-8
grid
gap-6
md:grid-cols-2
">






{

posts.map((post)=>(



<div

key={post.id}

className="
rounded-2xl
border
border-slate-200
p-6
hover:shadow-md
transition
"

>




<div className="
flex
justify-between
items-start
gap-3
">





<div>


<h2 className="
text-xl
font-bold
text-slate-900
">

{

post.type==="FOOD"

?

"🍱"

:

"💊"

}

{" "}

{post.title}

</h2>



</div>






<span className={`

rounded-full

px-3

py-1

text-sm

font-semibold

${statusStyle(post.status)}

`}>

{post.status}

</span>



</div>








<p className="
mt-4
text-slate-600
">

{post.description}

</p>








<div className="
mt-5
space-y-2
text-sm
text-slate-600
">



<p>

📦 Quantity:

<span className="
ml-1
font-semibold
text-slate-900
">

{post.quantity}

</span>

</p>




<p>

📍 Location:

<span className="
ml-1
font-semibold
text-slate-900
">

{post.location}

</span>

</p>




<p>

⏳ Expiry:

<span className="
ml-1
font-semibold
text-slate-900
">

{
new Date(
post.expiryTime
)
.toLocaleString()
}

</span>

</p>



</div>









<Link

href={`/pickup-requests`}

className="
mt-5
block
rounded-xl
bg-emerald-700
px-4
py-3
text-center
font-semibold
text-white
hover:bg-emerald-800
"

>

🚚 View Pickup Requests

</Link>





</div>



))


}






</div>


}




</div>


</div>


</main>


</ProtectedRoute>


);


}