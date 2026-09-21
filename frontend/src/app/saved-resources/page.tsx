"use client";


import {
    useEffect,
    useState
} from "react";


import Navbar from "@/components/Navbar";


import ProtectedRoute from "@/components/ProtectedRoute";


import ResourceCard from "@/components/ResourceCard";


import {
    Resource
} from "@/types/resource";





const API_URL =

    process.env.NEXT_PUBLIC_API_URL ||

    "http://localhost:8080";







interface Bookmark{


    id:number;


    resource:Resource;


}









export default function SavedResourcesPage(){





    const [resources,setResources] =

        useState<Resource[]>([]);





    const [loading,setLoading] =

        useState(true);









    useEffect(()=>{


        loadSavedResources();


    },[]);









    async function loadSavedResources(){



        try{



            const savedUser =

                localStorage.getItem("user");





            if(!savedUser){

                return;

            }






            const user =

                JSON.parse(savedUser);









            const response =

                await fetch(

`${API_URL}/api/bookmarks/user/${user.id}`

                );








            if(!response.ok){


                throw new Error(

                    "Failed to load bookmarks"

                );


            }







            const data:Bookmark[] =

                await response.json();








            const savedResources =

                data.map(

                    bookmark =>

                    bookmark.resource

                );








            setResources(

                savedResources

            );







        }

        catch(error){



            console.log(error);



        }

        finally{


            setLoading(false);


        }



    }












    async function handleRemoveBookmark(

        resourceId:number

    ){



        const savedUser =

            localStorage.getItem("user");





        if(!savedUser){

            return;

        }





        const user =

            JSON.parse(savedUser);








        const response =

            await fetch(

`${API_URL}/api/bookmarks/remove?userId=${user.id}&resourceId=${resourceId}`,

            {

                method:"DELETE"

            }

        );









        if(response.ok){



            setResources(

                previous =>

                previous.filter(

                    resource =>

                    resource.id !== resourceId

                )

            );



        }



    }












    async function handleLike(

        id:number

    ){



        await fetch(

`${API_URL}/api/resources/${id}/like`,

{

method:"PUT"

}

        );


        loadSavedResources();


    }









    async function handleShare(

        id:number

    ){



        await fetch(

`${API_URL}/api/resources/${id}/share`,

{

method:"PUT"

}

        );


        loadSavedResources();


    }









    function handleDelete(

        id:number

    ){



        setResources(

            previous =>

            previous.filter(

                resource =>

                resource.id !== id

            )

        );


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
max-w-5xl
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
text-slate-900
">

⭐ Saved Resources

</h1>







<p className="
mt-2
text-slate-600
">

Your bookmarked learning and community resources.

</p>









<div className="
mt-8
space-y-6
">







{

loading ?



<div className="
rounded-xl
bg-slate-100
p-5
">

Loading saved resources...

</div>






:

resources.length===0 ?





<div className="
rounded-xl
bg-slate-50
p-8
text-center
">




<div className="
text-5xl
">

⭐

</div>





<h2 className="
mt-4
text-xl
font-bold
">

No saved resources

</h2>





<p className="
mt-2
text-slate-600
">

Save useful resources to see them here.

</p>






</div>







:

resources.map(

(resource)=>(



<div

key={resource.id}

>


<ResourceCard


resource={resource}


onLike={()=>handleLike(resource.id)}


onShare={()=>handleShare(resource.id)}


onDelete={()=>handleRemoveBookmark(resource.id)}


/>



<button

onClick={()=>handleRemoveBookmark(resource.id)}

className="
mt-3
rounded-xl
bg-red-50
px-4
py-2
font-semibold
text-red-700
"

>

Remove ⭐

</button>



</div>



)


)



}







</div>








</div>







</div>






</main>


</ProtectedRoute>


);



}