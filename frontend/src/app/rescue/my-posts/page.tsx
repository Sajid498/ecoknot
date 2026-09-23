"use client";


import {
    useEffect,
    useState
} from "react";


import Link from "next/link";


import toast from "react-hot-toast";


import ProtectedRoute from "@/components/ProtectedRoute";


import LoadingCard from "@/components/LoadingCard";








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







    const [error,setError] =

        useState("");







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



            setError("");








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





            setError(

                "Unable to load your relief posts"

            );



        }

        finally{



            setLoading(false);



        }



    }












    async function deletePost(

        id:number

    ){



        const confirmDelete =

            window.confirm(

                "Delete this relief post?"

            );





        if(!confirmDelete){



            return;


        }









        try{



            const response =

                await fetch(

`${API_URL}/api/rescues/${id}`,

                    {


                        method:"DELETE"


                    }

                );








            if(response.ok){



                toast.success(

                    "Relief post deleted successfully 🗑️"

                );





                if(user){


                    loadPosts(

                        user.id

                    );


                }


            }

            else{



                toast.error(

                    "Failed to delete post"

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












    function statusStyle(

        status:string

    ){



        switch(status){



            case "AVAILABLE":

                return "bg-emerald-100 text-emerald-700";



            case "RESERVED":

                return "bg-yellow-100 text-yellow-700";



            case "PICKED_UP":

                return "bg-blue-100 text-blue-700";



            case "DELIVERED":

                return "bg-purple-100 text-purple-700";



            case "EXPIRED":

                return "bg-red-100 text-red-700";



            default:

                return "bg-slate-100 text-slate-700";


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

📦 My Relief Posts

</h1>





<p className="
mt-2
text-slate-600
">

Manage the food and medicine support you shared.

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

Unable to load your posts

</h2>






<p className="
mt-2
text-red-600
">

{error}

</p>







<button

onClick={()=>user && loadPosts(user.id)}

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
">







{

loading ?





<div className="
space-y-5
">


<LoadingCard />


<LoadingCard />



</div>









:



posts.length===0 ?





<div className="
rounded-2xl
bg-slate-50
p-10
text-center
">






<div className="
text-6xl
">

📦

</div>






<h2 className="
mt-5
text-2xl
font-bold
text-slate-900
">

No Relief Posts Yet

</h2>






<p className="
mt-2
text-slate-600
">

Share surplus food or medicine with your community.

</p>








<Link

href="/rescue/create"

className="
mt-5
inline-block
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









:



<div className="
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
transition
hover:shadow-md
"

>









<div className="
flex
items-start
justify-between
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
line-clamp-3
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
ml-2
font-semibold
text-slate-900
">

{post.quantity}

</span>


</p>









<p>


📍 Location:


<span className="
ml-2
font-semibold
text-slate-900
">

{post.location}

</span>


</p>









<p>


⏳ Expiry:


<span className="
ml-2
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









<div className="
mt-6
grid
grid-cols-2
gap-3
">








<Link

href={`/rescue/edit/${post.id}`}

className="
rounded-xl
border
border-blue-600
px-4
py-3
text-center
font-semibold
text-blue-600
hover:bg-blue-50
"

>

✏️ Edit

</Link>









<button

onClick={()=>deletePost(post.id)}

className="
rounded-xl
bg-red-600
px-4
py-3
font-semibold
text-white
hover:bg-red-700
"

>

🗑️ Delete

</button>







</div>









<Link

href="/pickup-requests"

className="
mt-4
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







</div>







</main>





</ProtectedRoute>




);



}