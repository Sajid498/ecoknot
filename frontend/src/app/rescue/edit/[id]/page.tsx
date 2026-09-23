"use client";


import {
    useEffect,
    useState
} from "react";


import {
    useParams,
    useRouter
} from "next/navigation";


import ProtectedRoute from "@/components/ProtectedRoute";







const API_URL =

    process.env.NEXT_PUBLIC_API_URL ||

    "http://localhost:8080";









export default function EditReliefPage(){



    const params = useParams();


    const router = useRouter();




    const id = params.id as string;







    const [loading,setLoading] =

        useState(true);





    const [saving,setSaving] =

        useState(false);









    const [form,setForm] =

        useState({



            title:"",



            description:"",



            type:"FOOD",



            quantity:0,



            location:"",



            latitude:"",



            longitude:"",



            expiryTime:""



        });












    useEffect(()=>{


        if(id){


            loadPost();


        }


    },[id]);












    async function loadPost(){



        try{


            const response =

                await fetch(

`${API_URL}/api/rescues/${id}`

                );





            const data =

                await response.json();






            setForm({



                title:data.title || "",



                description:data.description || "",



                type:data.type || "FOOD",



                quantity:data.quantity || 0,



                location:data.location || "",



                latitude:data.latitude || "",



                longitude:data.longitude || "",



                expiryTime:data.expiryTime
                    ?
                    data.expiryTime.slice(0,16)
                    :
                    ""



            });





        }

        catch(error){


            console.log(error);


        }

        finally{


            setLoading(false);


        }



    }









    function handleChange(

        e:React.ChangeEvent<

            HTMLInputElement |

            HTMLTextAreaElement |

            HTMLSelectElement

        >

    ){



        setForm({

            ...form,

            [e.target.name]:

                e.target.value

        });



    }









    async function updatePost(){



        try{


            setSaving(true);






            const response =

                await fetch(

`${API_URL}/api/rescues/${id}`,

                    {


                        method:"PUT",



                        headers:{


                            "Content-Type":

                                "application/json"


                        },



                        body:JSON.stringify({



                            title:form.title,



                            description:form.description,



                            type:form.type,



                            quantity:Number(

                                form.quantity

                            ),



                            location:form.location,



                            latitude:

                                form.latitude
                                ?
                                Number(form.latitude)
                                :
                                null,



                            longitude:

                                form.longitude
                                ?
                                Number(form.longitude)
                                :
                                null,



                            expiryTime:

                                form.expiryTime



                        })


                    }

                );







            if(response.ok){


                router.push(

                    "/rescue/my-posts"

                );


            }



        }

        catch(error){


            console.log(error);


        }

        finally{


            setSaving(false);


        }



    }









return(



<ProtectedRoute>



<main className="
min-h-screen
bg-slate-50
p-6
md:p-10
">







<div className="
mx-auto
max-w-3xl
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

✏️ Edit Relief Post

</h1>







{

loading ?





<p className="
mt-8
text-slate-600
">

Loading post...

</p>







:







<div className="
mt-8
space-y-5
">







<input

name="title"

value={form.title}

onChange={handleChange}

placeholder="Title"

className="
w-full
rounded-xl
border
p-3
"

/>








<textarea

name="description"

value={form.description}

onChange={handleChange}

placeholder="Description"

rows={5}

className="
w-full
rounded-xl
border
p-3
"

/>









<select

name="type"

value={form.type}

onChange={handleChange}

className="
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









<input

name="quantity"

type="number"

value={form.quantity}

onChange={handleChange}

placeholder="Quantity"

className="
w-full
rounded-xl
border
p-3
"

/>








<input

name="location"

value={form.location}

onChange={handleChange}

placeholder="Location"

className="
w-full
rounded-xl
border
p-3
"

/>








<input

name="expiryTime"

type="datetime-local"

value={form.expiryTime}

onChange={handleChange}

className="
w-full
rounded-xl
border
p-3
"

/>









<button

onClick={updatePost}

disabled={saving}

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

{

saving

?

"Updating..."

:

"Update Relief Post"

}


</button>








</div>






}



</div>






</div>






</main>





</ProtectedRoute>



);



}