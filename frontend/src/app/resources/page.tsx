"use client";


import {
    useEffect,
    useState
} from "react";


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



            console.log(

                error

            );


        }

        finally{


            setLoading(false);


        }


    }












    useEffect(()=>{


        loadResources();



    },[]);













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



                <h1 className="
                text-3xl
                font-bold
                "
                >

                    🌎 Resource Sharing

                </h1>




                <p className="
                mt-2
                text-gray-600
                "
                >

                    Share useful information with the EcoKnot community.

                </p>









                <div className="
                mt-8
                space-y-6
                ">





                {

                loading ?


                (

                    <div className="
                    rounded-xl
                    bg-white
                    p-6
                    shadow
                    ">

                        Loading resources...

                    </div>


                )



                :



                resources.length === 0 ?


                (

                    <div className="
                    rounded-xl
                    bg-white
                    p-6
                    shadow
                    ">

                        No resources available.

                    </div>


                )



                :



                resources.map(

                    (resource)=>(


                        <ResourceCard


                            key={resource.id}


                            resource={resource}


                            onLike={()=>


                                handleLike(

                                    resource.id

                                )


                            }



                            onShare={()=>


                                handleShare(

                                    resource.id

                                )


                            }



                        />


                    )


                )


                }



                </div>






            </div>




        </main>


    );


}