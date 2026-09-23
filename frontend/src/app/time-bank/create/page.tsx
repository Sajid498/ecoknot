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









export default function CreateTimeOfferPage(){



    const router = useRouter();





    const [title,setTitle] =

        useState("");



    const [description,setDescription] =

        useState("");



    const [skillCategory,setSkillCategory] =

        useState("");



    const [hours,setHours] =

        useState("");



    const [loading,setLoading] =

        useState(false);



    const [error,setError] =

        useState("");











    async function handleSubmit(

        e:React.FormEvent

    ){



        e.preventDefault();



        setLoading(true);

        setError("");





        try{



            const user =

                JSON.parse(

                    localStorage.getItem("user") || "{}"

                );







            if(!user.id){


                setError(

                    "User not logged in"

                );

                return;


            }









            const response =

                await fetch(

`${API_URL}/api/time-bank/offers?userId=${user.id}&title=${title}&description=${description}&skillCategory=${skillCategory}&hours=${hours}`,

                    {

                        method:"POST"

                    }

                );









            if(!response.ok){



                throw new Error(

                    "Failed to create offer"

                );


            }









            router.push(

                "/time-bank"

            );









        }

        catch(error){



            console.log(error);



            setError(

                "Unable to create time offer"

            );


        }

        finally{


            setLoading(false);


        }


    }











return(



<main className="
min-h-screen
bg-slate-50
p-6
md:p-10
">







<div className="
mx-auto
max-w-xl
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

⏳ Create Time Offer

</h1>





<p className="
mt-2
text-slate-600
">

Share your skills and earn time credits.

</p>









{

error &&

<div className="
mt-5
rounded-xl
bg-red-100
p-4
font-semibold
text-red-700
">

⚠️ {error}

</div>

}









<form

onSubmit={handleSubmit}

className="
mt-8
space-y-5
"

>








<div>


<label className="
font-semibold
text-slate-700
">

Title

</label>



<input

value={title}

onChange={

e=>setTitle(e.target.value)

}

placeholder="Example: Java Teaching"

className="
mt-2
w-full
rounded-xl
border
border-slate-300
p-3
outline-none
focus:border-emerald-600
"

/>


</div>









<div>


<label className="
font-semibold
text-slate-700
">

Skill Category

</label>



<input

value={skillCategory}

onChange={

e=>setSkillCategory(

e.target.value

)

}

placeholder="Education, Design, Repair..."

className="
mt-2
w-full
rounded-xl
border
border-slate-300
p-3
outline-none
focus:border-emerald-600
"

/>


</div>









<div>


<label className="
font-semibold
text-slate-700
">

Description

</label>



<textarea

value={description}

onChange={

e=>setDescription(

e.target.value

)

}

placeholder="Describe your help..."

rows={4}

className="
mt-2
w-full
rounded-xl
border
border-slate-300
p-3
outline-none
focus:border-emerald-600
"

/>


</div>









<div>


<label className="
font-semibold
text-slate-700
">

Available Hours

</label>



<input

type="number"

value={hours}

onChange={

e=>setHours(

e.target.value

)

}

placeholder="Example: 3"

className="
mt-2
w-full
rounded-xl
border
border-slate-300
p-3
outline-none
focus:border-emerald-600
"

/>


</div>









<button

disabled={loading}

className="
w-full
rounded-xl
bg-emerald-700
py-3
font-bold
text-white
transition
hover:bg-emerald-800
disabled:opacity-50
"

>

{

loading

?

"Creating..."

:

"Create Offer"

}


</button>







</form>








</div>





</main>


);



}