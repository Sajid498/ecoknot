"use client";


import {
    useState
} from "react";


import {
    Resource
} from "@/types/resource";





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

useState<any>(()=>{


    if(typeof window !== "undefined"){

        const savedUser =

        localStorage.getItem("user");


        return savedUser

        ?

        JSON.parse(savedUser)

        :

        null;

    }


    return null;


});




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





</div>


);


}