"use client";


import {
    useState
} from "react";


import {
    useRouter
} from "next/navigation";





const API_URL =

    process.env.NEXT_PUBLIC_API_URL ||

    "http://localhost:8080";







export default function CreateTimeRequestPage(){



    const router = useRouter();




    const [title,setTitle] = useState("");

    const [description,setDescription] = useState("");

    const [category,setCategory] = useState("");

    const [hours,setHours] = useState("");




    const user =

        typeof window !== "undefined"

        ?

        JSON.parse(

            localStorage.getItem("user") || "{}"

        )

        :

        {};









    async function submitRequest(

        e:React.FormEvent

    ){


        e.preventDefault();





        if(!user.id){

            alert("Please login first");

            return;

        }





        try{



            const response = await fetch(

                `${API_URL}/api/time-bank/requests?` +

                new URLSearchParams({

                    userId:String(user.id),

                    title,

                    description,

                    category,

                    hours

                }),

                {

                    method:"POST"

                }

            );





            if(!response.ok){

                throw new Error(

                    "Request creation failed"

                );

            }





            alert(

                "Help request created successfully"

            );



            router.push(

                "/time-bank"

            );



        }

        catch(error){



            console.log(error);


            alert(

                "Something went wrong"

            );

        }



    }









return (

<main

className="
min-h-screen
bg-slate-50
p-6
md:p-10
"

>


<div

className="
mx-auto
max-w-xl
rounded-3xl
bg-white
p-8
shadow-lg
"

>


<h1

className="
text-3xl
font-bold
text-slate-900
"

>

Create Help Request

</h1>



<p

className="
mt-2
text-slate-600
"

>

Ask the community for help and exchange time credits.

</p>









<form

onSubmit={submitRequest}

className="
mt-8
space-y-5
"

>







<div>

<label

className="
text-sm
font-medium
"

>

Title

</label>


<input

value={title}

onChange={

e=>setTitle(e.target.value)

}

placeholder="Example: Need Math Tutor"

className="
mt-2
w-full
rounded-xl
border
px-4
py-3
"

/>

</div>









<div>

<label

className="
text-sm
font-medium
"

>

Description

</label>



<textarea

value={description}

onChange={

e=>setDescription(e.target.value)

}

placeholder="Explain what help you need"

className="
mt-2
w-full
rounded-xl
border
px-4
py-3
"

/>


</div>









<div>

<label

className="
text-sm
font-medium
"

>

Category

</label>


<input

value={category}

onChange={

e=>setCategory(e.target.value)

}

placeholder="Education, Repair, Translation..."

className="
mt-2
w-full
rounded-xl
border
px-4
py-3
"

/>


</div>









<div>

<label

className="
text-sm
font-medium
"

>

Required Hours

</label>


<input

type="number"

value={hours}

onChange={

e=>setHours(e.target.value)

}

placeholder="2"

className="
mt-2
w-full
rounded-xl
border
px-4
py-3
"

/>


</div>









<button

type="submit"

className="
w-full
rounded-xl
bg-emerald-700
py-3
font-semibold
text-white
hover:bg-emerald-800
"

>

Create Request

</button>








</form>





</div>



</main>

);

}