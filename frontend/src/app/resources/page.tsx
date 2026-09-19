"use client";



import ResourceCard from "@/components/ResourceCard";

import {
    resources
} from "@/data/resourceData";








export default function ResourcePage(){



    return(



        <main className="
        min-h-screen
        bg-slate-50
        p-8
        ">







            <div className="
            mx-auto
            max-w-5xl
            ">







                <h1 className="
                text-3xl
                font-bold
                ">


                    📚 Resource Sharing


                </h1>







                <p className="
                mt-2
                text-gray-600
                ">


                    Share and explore useful community resources.


                </p>









                <div className="
                mt-8
                grid
                gap-6
                md:grid-cols-2
                lg:grid-cols-3
                ">







                {


                resources.map(

                    (resource)=>(


                        <ResourceCard


                            key={resource.id}


                            resource={resource}


                        />


                    )


                )


                }





                </div>







            </div>






        </main>


    );


}