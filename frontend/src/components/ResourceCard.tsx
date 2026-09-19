import {Resource} from "@/types/resource";


interface Props{

    resource:Resource;

    onLike:()=>void;

    onShare:()=>void;

}



export default function ResourceCard(

{

resource,

onLike,

onShare

}:Props

){



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



</div>



</div>


);


}