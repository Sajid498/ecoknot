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







const [saved,setSaved] =

useState(false);







const [bookmarkLoading,setBookmarkLoading] =

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









function formatDate(

    date:string

){



    const created =

        new Date(date);




    return created.toLocaleDateString(

        "en-US",

        {

            day:"numeric",

            month:"short",

            year:"numeric"

        }

    );



}









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









async function deleteComment(

commentId:number

){



    if(!user){

        return;

    }





    try{



        const response =

            await fetch(

`${API_URL}/api/comments/${commentId}?userId=${user.id}`,

{

method:"DELETE"

}

);





        if(response.ok){



            setComments(

                previous =>

                previous.filter(

                    comment =>

                    comment.id !== commentId

                )

            );

        }



    }

    catch(error){


        console.log(error);


    }


}









async function toggleBookmark(){



    const savedUser =

        localStorage.getItem("user");





    if(!savedUser){

        return;

    }







    const currentUser =

        JSON.parse(savedUser);







    try{



        setBookmarkLoading(true);







        let response;







        if(saved){



            response =

            await fetch(

`${API_URL}/api/bookmarks/remove?userId=${currentUser.id}&resourceId=${resource.id}`,

{

method:"DELETE"

}

);



        }

        else{



            response =

            await fetch(

`${API_URL}/api/bookmarks/save?userId=${currentUser.id}&resourceId=${resource.id}`,

{

method:"POST"

}

);



        }








        if(response.ok){



            setSaved(

                !saved

            );


        }



    }

    catch(error){


        console.log(error);


    }

    finally{


        setBookmarkLoading(false);


    }



}









async function handleShareClick(){



    const link =

    `${window.location.origin}/resources/${resource.id}`;





    try{



        if(navigator.share){



            await navigator.share({



                title:

                "EcoKnot Resource",



                text:

                resource.content,



                url:

                link



            });



        }

        else{



            await navigator.clipboard.writeText(

                link

            );



            alert(

                "Resource link copied!"

            );


        }







        onShare();




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
rounded-2xl
border
border-slate-200
bg-white
p-6
shadow-sm
transition
hover:shadow-lg
">







<div className="
flex
items-center
justify-between
">






<div>


<h2 className="
text-xl
font-bold
text-slate-900
">

{resource.userName}

</h2>






<p className="
text-sm
text-slate-500
">

{formatDate(resource.createdAt)}

</p>



</div>







{

resource.category &&



<span className="
rounded-full
bg-emerald-100
px-3
py-1
text-sm
font-semibold
text-emerald-700
">

🏷 {resource.category}

</span>



}



</div>









<p className="
mt-5
leading-relaxed
text-slate-700
">

{resource.content}

</p>








{

resource.imageUrl &&



<img

src={resource.imageUrl}

alt="resource"

className="
mt-5
w-full
rounded-xl
object-cover
"

/>



}









<div className="
mt-6
flex
flex-wrap
gap-3
">








<button

onClick={onLike}

className="
rounded-xl
bg-blue-50
px-4
py-2
font-semibold
text-blue-700
hover:bg-blue-100
"

>

👍 {resource.likes}

</button>









<button

onClick={handleShareClick}

className="
rounded-xl
bg-green-50
px-4
py-2
font-semibold
text-green-700
hover:bg-green-100
"

>

🔗 Share {resource.shares}

</button>









<button

onClick={toggleBookmark}

disabled={bookmarkLoading}

className="
rounded-xl
bg-purple-50
px-4
py-2
font-semibold
text-purple-700
hover:bg-purple-100
"

>

{

bookmarkLoading

?

"Saving..."

:

saved

?

"⭐ Saved"

:

"☆ Save"

}

</button>









<button

onClick={toggleComments}

className="
rounded-xl
bg-yellow-50
px-4
py-2
font-semibold
text-yellow-700
hover:bg-yellow-100
"

>

💬 Comments

</button>









{

user?.id === resource.userId &&



<button

onClick={()=>onDelete(resource.id)}

className="
rounded-xl
bg-red-50
px-4
py-2
font-semibold
text-red-700
hover:bg-red-100
"

>

🗑 Delete

</button>



}






</div>









{

showComments &&



<div className="
mt-8
border-t
pt-6
">






<h3 className="
mb-4
font-bold
text-lg
">

Comments

</h3>







<div className="
space-y-3
">



{

comments.length===0 ?


<p className="
text-slate-500
">

No comments yet.

</p>



:


comments.map(

(comment)=>(


<div

key={comment.id}

className="
relative
rounded-xl
bg-slate-50
p-4
"

>


<p className="
font-semibold
">

{comment.userName}

</p>





<p className="
text-slate-700
">

{comment.content}

</p>







{

user?.id===comment.userId &&



<button

onClick={()=>deleteComment(comment.id)}

className="
absolute
right-3
top-3
text-red-600
"

>

🗑

</button>



}



</div>


)



)



}



</div>









<div className="
mt-5
flex
gap-3
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
rounded-xl
border
p-3
focus:outline-none
"

/>






<button

onClick={addComment}

className="
rounded-xl
bg-emerald-700
px-5
font-semibold
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