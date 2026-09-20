"use client";


import {
    useState
} from "react";


import {
    useRouter
} from "next/navigation";


import ProtectedRoute from "@/components/ProtectedRoute";


import Navbar from "@/components/Navbar";





const API_URL =

    process.env.NEXT_PUBLIC_API_URL ||

    "http://localhost:8080";









export default function CreateResourcePage(){



    const router = useRouter();




    const [content,setContent] =

        useState("");




    const [imageUrl,setImageUrl] =

        useState("");




    const [loading,setLoading] =

        useState(false);




    const [message,setMessage] =

        useState("");









    async function handleCreate(){



        try{



            setLoading(true);





            const savedUser =

                localStorage.getItem("user");





            if(!savedUser){


                setMessage(
                    "Please login first"
                );


                return;

            }





            const user =

                JSON.parse(savedUser);








            const response =

                await fetch(

`${API_URL}/api/resources?userId=${user.id}`,

                    {


                        method:"POST",


                        headers:{


                            "Content-Type":
                            "application/json"


                        },


                        body:JSON.stringify({


                            content,


                            imageUrl:
                            imageUrl || null


                        })


                    }


                );








            if(!response.ok){


                throw new Error(

                    "Resource creation failed"

                );


            }






            setMessage(

                "Resource posted successfully"

            );






            setTimeout(()=>{


                router.push("/resources");


            },1000);





        }


        catch(error){


            console.log(error);



            setMessage(

                "Something went wrong"

            );


        }


        finally{


            setLoading(false);


        }


    }









return(


<ProtectedRoute>


<main className="
min-h-screen
bg-slate-50
">


<Navbar />






<div className="
mx-auto
max-w-3xl
px-6
py-10
">





<div className="
rounded-3xl
bg-white
p-8
shadow-lg
">






<h1 className="
text-3xl
font-bold
">

🌎 Create Resource Post

</h1>





<p className="
mt-2
text-slate-600
">

Share something useful with EcoKnot community.

</p>







<div className="
mt-8
space-y-5
">






<div>


<label className="
font-semibold
">

Content

</label>




<textarea


value={content}


onChange={(e)=>

setContent(

e.target.value

)

}


placeholder="Write your resource..."

className="
mt-2
h-40
w-full
rounded-xl
border
p-4
"


/>


</div>










<div>


<label className="
font-semibold
">

Image URL (optional)

</label>





<input


value={imageUrl}


onChange={(e)=>

setImageUrl(

e.target.value

)

}


placeholder="Paste image URL"

className="
mt-2
w-full
rounded-xl
border
p-3
"


/>



</div>









<button


onClick={handleCreate}


disabled={loading}


className="
rounded-xl
bg-emerald-700
px-6
py-3
font-semibold
text-white
hover:bg-emerald-800
"


>


{

loading

?

"Posting..."

:

"Create Post"

}


</button>









{

message &&


<p className="
font-semibold
text-emerald-700
">

{message}

</p>


}








</div>






</div>






</div>







</main>


</ProtectedRoute>


);


}