"use client";


import {
    useEffect,
    useState
} from "react";


import Link from "next/link";


import ResourceCard from "@/components/ResourceCard";


import {
    Resource
} from "@/types/resource";





const API_URL =

    process.env.NEXT_PUBLIC_API_URL ||

    "http://localhost:8080";









export default function ResourcePage(){



    const [resources,setResources] =

        useState<Resource[]>([]);





    const [loading,setLoading] =

        useState(true);





    const [user,setUser] =

        useState<any>(null);





    const [activeTab,setActiveTab] =

        useState("community");





    const [selectedCategory,setSelectedCategory] =

        useState("All");









    const categories = [


        "All",

        "Education",

        "Environment",

        "Donation",

        "Technology",

        "Emergency",

        "Others"


    ];









    useEffect(()=>{


        const savedUser =

            localStorage.getItem("user");



        if(savedUser){


            setUser(

                JSON.parse(savedUser)

            );


        }



        loadResources();



    },[]);












    async function loadResources(){


        try{


            setLoading(true);





            const response =

                await fetch(

                    `${API_URL}/api/resources`

                );







            if(!response.ok){


                throw new Error(

                    "Failed to load resources"

                );


            }







            const data =

                await response.json();







            setResources(data);






        }

        catch(error){


            console.log(error);


        }

        finally{


            setLoading(false);


        }


    }









    async function handleLike(

        id:number

    ){



        try{


            const response =

                await fetch(

`${API_URL}/api/resources/${id}/like`,

                    {

                        method:"PUT"

                    }

                );








            if(response.ok){


                loadResources();


            }





        }

        catch(error){


            console.log(error);


        }



    }









    async function handleShare(

        id:number

    ){



        try{


            const response =

                await fetch(

`${API_URL}/api/resources/${id}/share`,

                    {

                        method:"PUT"

                    }

                );








            if(response.ok){


                loadResources();


            }





        }

        catch(error){


            console.log(error);


        }



    }









    async function handleDelete(

        id:number

    ){



        try{


            const savedUser =

                localStorage.getItem("user");





            if(!savedUser){

                return;

            }







            const currentUser =

                JSON.parse(savedUser);








            const response =

                await fetch(

`${API_URL}/api/resources/${id}?userId=${currentUser.id}`,

                    {

                        method:"DELETE"

                    }

                );








            if(response.ok){



                setResources(

                    previous =>

                    previous.filter(

                        resource =>

                        resource.id !== id

                    )

                );


            }



        }

        catch(error){


            console.log(error);


        }


    }









    const myPosts =

        resources.filter(

            resource =>

            resource.userId === user?.id

        );







    const communityPosts =

        resources.filter(

            resource =>

            resource.userId !== user?.id

        );








    const displayedPosts =

        activeTab === "my"

        ?

        myPosts

        :

        communityPosts;








    const filteredPosts =


        selectedCategory === "All"


        ?


        displayedPosts


        :


        displayedPosts.filter(


            resource =>


            resource.category === selectedCategory


        );











return(


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







<div className="
flex
items-center
justify-between
">





<div>


<h1 className="
text-3xl
font-bold
">

🌎 Resource Sharing

</h1>





<p className="
mt-2
text-gray-600
">

Share useful information with the EcoKnot community.

</p>


</div>







<Link

href="/resources/create"

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

+ Create Post

</Link>






</div>









<div className="
mt-8
flex
gap-4
">






<button

onClick={()=>setActiveTab("my")}

className={

activeTab==="my"

?

"rounded-xl bg-emerald-700 px-5 py-3 text-white font-semibold"

:

"rounded-xl bg-white px-5 py-3 font-semibold"

}

>

My Posts

</button>








<button

onClick={()=>setActiveTab("community")}

className={

activeTab==="community"

?

"rounded-xl bg-emerald-700 px-5 py-3 text-white font-semibold"

:

"rounded-xl bg-white px-5 py-3 font-semibold"

}

>

Community Posts

</button>






</div>









<div className="
mt-6
flex
flex-wrap
gap-3
">





{

categories.map(

(category)=>(


<button


key={category}


onClick={()=>setSelectedCategory(category)}



className={

selectedCategory===category

?

"rounded-full bg-emerald-700 px-4 py-2 text-white font-semibold"

:

"rounded-full bg-white px-4 py-2 font-semibold shadow"

}


>

{category}


</button>



)


)


}







</div>









<div className="
mt-8
space-y-6
">






{

loading ?



<div className="
rounded-xl
bg-white
p-6
shadow
">

Loading resources...

</div>







:



filteredPosts.length===0 ?



<div className="
rounded-xl
bg-white
p-6
shadow
">

No posts available.

</div>







:



filteredPosts.map(

(resource)=>(



<ResourceCard


key={resource.id}


resource={resource}



onLike={()=>handleLike(resource.id)}



onShare={()=>handleShare(resource.id)}



onDelete={handleDelete}



/>



)


)



}







</div>








</div>





</main>


);


}