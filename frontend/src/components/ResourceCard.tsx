"use client";


import {
    useEffect,
    useState
} from "react";


import {
    Resource
} from "@/types/resource";


import {
    ResourceComment
} from "@/types/resourceComment";





const API_URL =

    process.env.NEXT_PUBLIC_API_URL ||

    "http://localhost:8080";







interface Props{


    resource:Resource;


    onLike:()=>void;


    onShare:()=>void;


    onDelete:(id:number)=>void;


}







export default function ResourceCard(

{

resource,

onLike,

onShare,

onDelete

}:Props

){



const [user,setUser] =

useState<any>(null);




const [comments,setComments] =

useState<ResourceComment[]>([]);




const [commentText,setCommentText] =

useState("");




const [showComments,setShowComments] =

useState(false);







useEffect(()=>{


    const savedUser =

        localStorage.getItem("user");



    if(savedUser){


        setUser(

            JSON.parse(savedUser)

        );


    }


},[]);









async function loadComments(){


    try{


        const response =

            await fetch(

`${API_URL}/api/resources/${resource.id}/comments`

            );





        if(response.ok){


            const data =

                await response.json();



            setComments(data);


        }


    }

    catch(error){


        console.log(error);


    }


}









async function addComment(){



    if(!commentText.trim()){

        return;

    }





    const savedUser =

        localStorage.getItem("user");





    if(!savedUser){

        return;

    }






    const currentUser =

        JSON.parse(savedUser);







    try{



        const response =

            await fetch(

`${API_URL}/api/resources/${resource.id}/comments?userId=${currentUser.id}`,

                {


                    method:"POST",


                    headers:{


                        "Content-Type":
                        "application/json"


                    },


                    body:JSON.stringify({


                        content:commentText


                    })


                }

            );







        if(response.ok){


            setCommentText("");

            loadComments();


        }



    }

    catch(error){


        console.log(error);


    }



}









function toggleComments(){


    setShowComments(

        !showComments

    );


    if(!showComments){


        loadComments();


    }


}









return(



<div className="
rounded-xl
bg-white
p-5
shadow
">






<h2 className="
font-bold
text-xl
">

{resource.userName}

</h2>







<p className="
mt-3
text-gray-700
">

{resource.content}

</p>








{

resource.imageUrl &&


<img

src={resource.imageUrl}

alt="resource"

className="
mt-4
rounded-lg
"

/>

}










<div className="
mt-5
flex
gap-5
flex-wrap
">





<button

onClick={onLike}

className="
rounded-lg
bg-blue-100
px-4
py-2
"

>

👍 {resource.likes}

</button>








<button

onClick={onShare}

className="
rounded-lg
bg-green-100
px-4
py-2
"

>

🔁 {resource.shares}

</button>








<button

onClick={toggleComments}

className="
rounded-lg
bg-yellow-100
px-4
py-2
"

>

💬 Comments

</button>








{

user?.id === resource.userId &&



<button

onClick={()=>onDelete(resource.id)}

className="
rounded-lg
bg-red-100
px-4
py-2
text-red-700
"

>

🗑 Delete

</button>


}





</div>









{

showComments &&


<div className="
mt-6
border-t
pt-5
">





<h3 className="
font-bold
mb-3
">

Comments

</h3>








<div className="
space-y-3
">


{

comments.length === 0 ?


<p className="
text-gray-500
">

No comments yet.

</p>



:



comments.map(

(comment)=>(


<div

key={comment.id}

className="
rounded-lg
bg-slate-100
p-3
"

>


<p className="
font-semibold
">

{comment.userName}

</p>



<p>

{comment.content}

</p>



</div>


)


)



}



</div>









<div className="
mt-4
flex
gap-2
">


<input


value={commentText}


onChange={(e)=>

setCommentText(

e.target.value

)

}


placeholder="Write a comment..."


className="
flex-1
rounded-lg
border
p-2
"

/>





<button

onClick={addComment}

className="
rounded-lg
bg-emerald-700
px-4
text-white
"

>

Post

</button>



</div>






</div>



}







</div>



);


}