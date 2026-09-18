"use client";


import { useState } from "react";
import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";
import toast from "react-hot-toast";



const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:8080";






export default function DonorSearchPage(){



    const [bloodGroup,setBloodGroup] =
        useState("");



    const [location,setLocation] =
        useState("");



    const [donors,setDonors] =
        useState<any[]>([]);



    const [loading,setLoading] =
        useState(false);








    async function searchDonors(){



        try{


            setLoading(true);



            let url =
`${API_URL}/api/users/search-donors`;




            const params =
                new URLSearchParams();




            if(bloodGroup){

                params.append(
                    "bloodGroup",
                    bloodGroup
                );

            }




            if(location){

                params.append(
                    "location",
                    location
                );

            }




            if(params.toString()){

                url +=
                "?" + params.toString();

            }







            const response =
                await fetch(url);





            if(!response.ok){

                throw new Error(
                    "Failed to search donors"
                );

            }






            const data =
                await response.json();




            setDonors(data);





            if(data.length===0){


                toast.info(
                    "No donors found"
                );


            }



        }
        catch(error){


            console.log(error);


            toast.error(
                "Search failed"
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


<Navbar />





<div className="
mx-auto
max-w-6xl
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
text-slate-900
">

🔎 Find Blood Donors

</h1>





<p className="
mt-2
text-slate-500
">

Search available donors by blood group and location.

</p>









<div className="
mt-8
grid
gap-4
md:grid-cols-3
">





<select

value={bloodGroup}

onChange={(e)=>
    setBloodGroup(
        e.target.value
    )
}

className="
rounded-xl
border
p-3
"

>


<option value="">

All Blood Groups

</option>


<option value="A_POSITIVE">
A+
</option>


<option value="A_NEGATIVE">
A-
</option>


<option value="B_POSITIVE">
B+
</option>


<option value="B_NEGATIVE">
B-
</option>


<option value="AB_POSITIVE">
AB+
</option>


<option value="AB_NEGATIVE">
AB-
</option>


<option value="O_POSITIVE">
O+
</option>


<option value="O_NEGATIVE">
O-
</option>



</select>









<input

value={location}

onChange={(e)=>
    setLocation(
        e.target.value
    )
}

placeholder="Enter location"

className="
rounded-xl
border
p-3
"

/>









<button

onClick={searchDonors}

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
"Searching..."
:
"Search Donors"
}


</button>





</div>














<div className="
mt-10
space-y-5
">





{

donors.map((donor)=>(


<div

key={donor.id}

className="
rounded-2xl
border
p-6
hover:shadow-md
transition
"

>




<div className="
flex
justify-between
"

>


<div>


<h2 className="
text-xl
font-bold
">

{donor.name}

</h2>



<p className="
mt-2
text-red-600
font-semibold
">

🩸 {donor.bloodGroup}

</p>




<p className="
text-slate-600
">

📍 {donor.location}

</p>



</div>








<span className="
rounded-full
bg-emerald-100
px-4
py-2
text-emerald-700
font-semibold
">

Available ✅

</span>



</div>







<div className="
mt-5
flex
gap-3
">


<button

className="
rounded-xl
bg-emerald-700
px-5
py-2
text-white
font-semibold
"

>

🩸 Request Donation

</button>



</div>





</div>



))


}








{
!loading && donors.length===0 &&

<p className="
text-slate-500
">

Search to find available donors.

</p>

}





</div>






</div>






</div>


</main>


</ProtectedRoute>


);



}