import { Resource } from "@/data/resourceData";





interface ResourceCardProps{


    resource:Resource;


}







export default function ResourceCard(

{

resource

}:ResourceCardProps

){



    return(



        <div className="
        rounded-xl
        bg-white
        p-5
        shadow-md
        border
        ">





            <h2 className="
            text-xl
            font-bold
            ">

                {resource.title}

            </h2>







            <p className="
            mt-2
            text-sm
            text-gray-500
            ">


                Shared by:

                <span className="
                font-semibold
                ">

                    {" "}

                    {resource.user}

                </span>


            </p>









            <p className="
            mt-3
            text-gray-700
            ">


                {resource.description}


            </p>









            <span className="
            mt-4
            inline-block
            rounded-full
            bg-blue-100
            px-3
            py-1
            text-sm
            text-blue-700
            ">


                {resource.category}


            </span>






        </div>



    );


}