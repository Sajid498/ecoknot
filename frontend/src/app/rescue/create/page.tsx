"use client";


import {
    useState
} from "react";


import {
    useRouter
} from "next/navigation";


import Link from "next/link";


import ProtectedRoute from "@/components/ProtectedRoute";








const API_URL =

    process.env.NEXT_PUBLIC_API_URL ||

    "http://localhost:8080";









export default function CreateRescuePage(){



    const router = useRouter();





    const [title,setTitle] =

        useState("");





    const [description,setDescription] =

        useState("");





    const [type,setType] =

        useState("FOOD");





    const [quantity,setQuantity] =

        useState("");





    const [location,setLocation] =

        useState("");





    const [latitude,setLatitude] =

        useState("");





    const [longitude,setLongitude] =

        useState("");





    const [expiryTime,setExpiryTime] =

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

`${API_URL}/api/rescues?userId=${user.id}`,

                    {


                        method:"POST",



                        headers:{


                            "Content-Type":
                            "application/json"


                        },



                        body:JSON.stringify({



                            title,

                            description,


                            type,


                            quantity:Number(quantity),


                            location,


                            latitude:

                            latitude

                            ?

                            Number(latitude)

                            :

                            null,



                            longitude:

                            longitude

                            ?

                            Number(longitude)

                            :

                            null,



                            expiryTime



                        })


                    }

                );









            if(!response.ok){


                throw new Error(

                    "Creation failed"

                );


            }








            setMessage(

                "Rescue donation created successfully"

            );







            setTimeout(()=>{


                router.push("/rescue");


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

Create Relief Post

</h1>







<p className="
mt-2
text-slate-600
">

Share surplus food or medicine with people who need it.

</p>









<div className="
mt-8
space-y-5
">






<div>


<label className="
font-semibold
">

Title

</label>


<input


value={title}


onChange={(e)=>

setTitle(e.target.value)

}


placeholder="Example: 100 Food Packets"


className="
mt-2
w-full
rounded-xl
border
p-3
"


/>


</div>









<div>


<label className="
font-semibold
">

Type

</label>



<select


value={type}


onChange={(e)=>

setType(e.target.value)

}


className="
mt-2
w-full
rounded-xl
border
p-3
"

>


<option value="FOOD">

🍱 Food

</option>


<option value="MEDICINE">

💊 Medicine

</option>



</select>


</div>









<div>


<label className="
font-semibold
">

Description

</label>



<textarea


value={description}


onChange={(e)=>

setDescription(e.target.value)

}


placeholder="Describe the donation"


className="
mt-2
h-32
w-full
rounded-xl
border
p-3
"


/>


</div>









<div>


<label className="
font-semibold
">

Quantity

</label>



<input


type="number"


value={quantity}


onChange={(e)=>

setQuantity(e.target.value)

}


placeholder="Example: 100"


className="
mt-2
w-full
rounded-xl
border
p-3
"


/>


</div>









<div>


<label className="
font-semibold
">

Location

</label>



<input


value={location}


onChange={(e)=>

setLocation(e.target.value)

}


placeholder="Example: Dhanmondi"


className="
mt-2
w-full
rounded-xl
border
p-3
"


/>


</div>









<div className="
grid
grid-cols-2
gap-4
">



<input


value={latitude}


onChange={(e)=>

setLatitude(e.target.value)

}


placeholder="Latitude"


className="
rounded-xl
border
p-3
"

/>





<input


value={longitude}


onChange={(e)=>

setLongitude(e.target.value)

}


placeholder="Longitude"


className="
rounded-xl
border
p-3
"

/>



</div>









<div>


<label className="
font-semibold
">

Expiry Time

</label>



<input


type="datetime-local"


value={expiryTime}


onChange={(e)=>

setExpiryTime(e.target.value)

}


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

"Creating..."

:


"Create Relief Post"

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