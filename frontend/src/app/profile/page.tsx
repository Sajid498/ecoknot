"use client";


import {
    useEffect,
    useState
} from "react";


import ProtectedRoute from "@/components/ProtectedRoute";


import ProfileStats from "@/components/ProfileStats";





const API_URL =

    process.env.NEXT_PUBLIC_API_URL ||

    "http://localhost:8080";









export default function ProfilePage(){





    const [user,setUser] =

        useState<any>(null);





    const [requests,setRequests] =

        useState<any[]>([]);


const [timeBalance,setTimeBalance] = useState(0);


    const [donorDashboard,setDonorDashboard] =

        useState<any>(null);





    // New Phase 2.2 statistics

    const [stats,setStats] =

        useState<any>(null);









    const [location,setLocation] =

        useState("");





    const [bloodGroup,setBloodGroup] =

        useState("");





    const [availableForDonation,setAvailableForDonation] =

        useState(false);





    const [lastDonationDate,setLastDonationDate] =

        useState("");





    const [message,setMessage] =

        useState("");












    useEffect(()=>{


    const savedUser =

        localStorage.getItem("user");



    if(savedUser){


        const userData =

            JSON.parse(savedUser);



        setUser(userData);



        loadProfile(

            userData.id

        );



        loadStats(

            userData.id

        );



        loadRequests(

            userData.id

        );



        loadDonorDashboard(

            userData.id

        );


        // Volunteer Time Bank Balance

        loadTimeBalance(

            userData.id

        );


    }


},[]);








async function loadTimeBalance(

    id:number

){

    try{

        const response = await fetch(

`${API_URL}/api/time-bank/balance/${id}`

        );


        if(!response.ok){

            throw new Error(

                "Time balance loading failed"

            );

        }


        const data = await response.json();


        setTimeBalance(

            Number(data) || 0

        );


    }

    catch(error){

        console.log(
            "Time balance error",
            error
        );

    }

}



    // ============================
    // LOAD PROFILE
    // ============================


    async function loadProfile(

        id:number

    ){



        try{



            const response =

                await fetch(

`${API_URL}/api/profile/${id}`

                );





            if(!response.ok){

                throw new Error(

                    "Profile loading failed"

                );

            }






            const data =

                await response.json();






            setUser(data);






            setLocation(

                data.location || ""

            );






            setBloodGroup(

                data.bloodGroup || ""

            );






            setAvailableForDonation(

                data.availableForDonation || false

            );






            setLastDonationDate(

                data.lastDonationDate || ""

            );







            localStorage.setItem(

                "user",

                JSON.stringify(data)

            );




        }

        catch(error){



            console.log(error);



        }



    }












    // ============================
    // LOAD PROFILE STATISTICS
    // ============================


    async function loadStats(

        id:number

    ){



        try{



            const response =

                await fetch(

`${API_URL}/api/profile/${id}/stats`

                );







            if(!response.ok){

                return;

            }







            const data =

                await response.json();







            setStats(data);



        }


        catch(error){



            console.log(error);



        }



    }












    // ============================
    // LOAD DONOR DASHBOARD
    // ============================


    async function loadDonorDashboard(

        id:number

    ){



        try{



            const response =

                await fetch(

`${API_URL}/api/users/${id}/donor-dashboard`

                );







            if(!response.ok){

                return;

            }







            const data =

                await response.json();






            setDonorDashboard(data);




        }


        catch(error){



            console.log(error);



        }



    }













    // ============================
    // LOAD BLOOD REQUESTS
    // ============================


    async function loadRequests(

        id:number

    ){



        try{



            const response =

                await fetch(

`${API_URL}/api/blood-requests/user/${id}`

                );







            if(!response.ok){


                throw new Error(

                    "Blood request history loading failed"

                );


            }



            const data =

                await response.json();







            setRequests(

                Array.isArray(data)

                    ?

                    data

                    :

                    []

            );



        }


        catch(error){



            console.log(error);



        }



    }













    // ============================
    // UPDATE PROFILE
    // ============================


    async function updateProfile(){



        try{



            const response =

                await fetch(

`${API_URL}/api/profile/${user.id}`,

                    {

                        method:"PUT",


                        headers:{


                            "Content-Type":

                            "application/json"


                        },



                        body:JSON.stringify({



                            name:

                            user.name,



                            location,



                            bloodGroup,



                            availableForDonation,



                            lastDonationDate



                        })

                    }

                );








            if(!response.ok){



                throw new Error(

                    "Profile update failed"

                );


            }









            const updatedUser =

                await response.json();








            setUser(

                updatedUser

            );








            localStorage.setItem(

                "user",

                JSON.stringify(updatedUser)

            );








            loadStats(

                user.id

            );






            loadDonorDashboard(

                user.id

            );






            loadTimeBalance(

                user.id

            );








            setMessage(

                "Profile updated successfully"

            );



        }



        catch(error){



            console.log(error);





            setMessage(

                "Something went wrong"

            );



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
max-w-6xl
">







{/* PROFILE HEADER */}


<div className="
rounded-3xl
bg-white
p-8
shadow-lg
">





<div className="
flex
flex-col
gap-5
md:flex-row
md:items-center
md:justify-between
">





<div className="
flex
items-center
gap-5
">





<div className="
flex
h-20
w-20
items-center
justify-center
rounded-full
bg-emerald-100
text-4xl
">

👤

</div>







<div>



<h1 className="
text-3xl
font-bold
text-slate-900
">

{
user?.name ||
"User Profile"
}

</h1>





<p className="
mt-1
text-slate-600
">

{
user?.role
}

</p>




</div>





</div>









<div className="
rounded-xl
bg-emerald-50
px-5
py-3
text-center
">


<p className="
text-sm
text-slate-600
">

Member Since

</p>


<p className="
font-bold
text-emerald-700
">

EcoKnot Community

</p>


</div>





</div>






</div>









{/* PHASE 2.2 STATISTICS */}



{

stats &&


<ProfileStats

stats={stats}

/>


}














{/* MESSAGE */}


{

message &&


<div className="
mt-6
rounded-xl
bg-emerald-100
p-4
text-center
font-semibold
text-emerald-700
">

{message}

</div>


}














{/* TIME BANK */}


<div className="
mt-10
rounded-3xl
bg-white
p-8
shadow-lg
">


<h2 className="
text-2xl
font-bold
text-slate-900
">

⏳ Volunteer Time Bank

</h2>




<div className="
mt-6
rounded-2xl
bg-emerald-50
p-6
">


<p className="
text-sm
text-slate-600
">

Current Time Credits

</p>




<p className="
mt-2
text-4xl
font-bold
text-emerald-700
">

{timeBalance}

</p>




<p className="
mt-1
text-slate-600
">

hours available

</p>




</div>



<a

href="/time-bank"

className="
mt-6
inline-block
rounded-xl
bg-emerald-700
px-5
py-3
font-semibold
text-white
hover:bg-emerald-800
"

>

Go To Time Bank →

</a>



</div>














{/* DONOR DASHBOARD */}



{

donorDashboard &&


<div className="
mt-10
rounded-3xl
bg-white
p-8
shadow-lg
">




<h2 className="
text-2xl
font-bold
text-slate-900
">

🩸 Donor Reliability Dashboard

</h2>







<div className="
mt-6
grid
gap-5
md:grid-cols-3
">






<div className="
rounded-2xl
bg-red-50
p-5
">

<p className="
text-sm
text-slate-600
">

Donation Count

</p>


<p className="
mt-2
text-3xl
font-bold
text-red-700
">

{

donorDashboard.completedDonations ||

0

}

</p>


</div>









<div className="
rounded-2xl
bg-blue-50
p-5
">

<p className="
text-sm
text-slate-600
">

Reliability Level

</p>


<p className="
mt-2
text-xl
font-bold
text-blue-700
">

{

donorDashboard.reliabilityLevel ||

"New Donor"

}

</p>


</div>









<div className="
rounded-2xl
bg-purple-50
p-5
">

<p className="
text-sm
text-slate-600
">

Reliability Score

</p>


<p className="
mt-2
text-3xl
font-bold
text-purple-700
">

{

donorDashboard.reliabilityScore ||

0

}

%

</p>


</div>








</div>



</div>


}













{/* DONOR INFORMATION */}



<div className="
mt-10
rounded-3xl
bg-white
p-8
shadow-lg
">





<h2 className="
text-2xl
font-bold
text-slate-900
">

🩸 Donation Information

</h2>








<div className="
mt-6
grid
gap-6
md:grid-cols-2
">







{/* LOCATION */}


<div>



<label className="
text-sm
font-semibold
text-slate-700
">

📍 Location

</label>



<input

value={location}

onChange={

(e)=>

setLocation(

e.target.value

)

}

className="
mt-2
w-full
rounded-xl
border
border-slate-300
px-4
py-3
outline-none
focus:border-emerald-600
"

/>



</div>









{/* BLOOD GROUP */}



<div>


<label className="
text-sm
font-semibold
text-slate-700
">

🩸 Blood Group

</label>





<select

value={bloodGroup}

onChange={

(e)=>

setBloodGroup(

e.target.value

)

}

className="
mt-2
w-full
rounded-xl
border
border-slate-300
px-4
py-3
outline-none
focus:border-emerald-600
"

>


<option value="">

Select Blood Group

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


<option value="O_POSITIVE">

O+

</option>


<option value="O_NEGATIVE">

O-

</option>


<option value="AB_POSITIVE">

AB+

</option>


<option value="AB_NEGATIVE">

AB-

</option>



</select>




</div>









</div>













<div className="
mt-6
grid
gap-6
md:grid-cols-2
">







{/* LAST DONATION DATE */}



<div>


<label className="
text-sm
font-semibold
text-slate-700
">

📅 Last Donation Date

</label>



<input

type="date"

value={lastDonationDate}

onChange={

(e)=>

setLastDonationDate(

e.target.value

)

}

className="
mt-2
w-full
rounded-xl
border
border-slate-300
px-4
py-3
"

/>


</div>









{/* AVAILABILITY */}



<div className="
flex
items-center
gap-3
mt-8
">


<input

type="checkbox"

checked={availableForDonation}

onChange={

(e)=>

setAvailableForDonation(

e.target.checked

)

}

className="
h-5
w-5
"

/>



<label className="
font-semibold
text-slate-700
">

Available for Blood Donation

</label>



</div>









</div>









<button

onClick={updateProfile}

className="
mt-8
rounded-xl
bg-emerald-700
px-6
py-3
font-semibold
text-white
hover:bg-emerald-800
"

>

Save Profile

</button>







</div>
{/* BLOOD REQUEST HISTORY */}


<div className="
mt-10
rounded-3xl
bg-white
p-8
shadow-lg
">





<h2 className="
text-2xl
font-bold
text-slate-900
">

🩸 Blood Request History

</h2>







{

requests.length === 0 ?



<div className="
mt-6
rounded-xl
bg-slate-50
p-6
text-center
text-slate-600
">

No blood requests found.

</div>





:



<div className="
mt-6
space-y-4
">







{

requests.map((request)=>(



<div

key={request.id}

className="
rounded-2xl
border
border-slate-200
p-5
transition
hover:shadow-md
"

>






<div className="
flex
items-center
justify-between
gap-4
">






<div>


<h3 className="
font-bold
text-slate-900
">

🩸 {request.bloodGroup}

</h3>



<p className="
mt-1
text-sm
text-slate-600
">

{request.hospital}

</p>


</div>








<span className="
rounded-full
bg-red-100
px-3
py-1
text-sm
font-semibold
text-red-700
">

{

request.status

}

</span>






</div>









<div className="
mt-4
grid
gap-2
text-sm
text-slate-600
">



<p>

📍 Location:

<span className="
ml-1
font-semibold
text-slate-900
">

{request.location}

</span>

</p>





<p>

📅 Required Date:

<span className="
ml-1
font-semibold
text-slate-900
">

{request.requiredDate}

</span>

</p>





<p>

📦 Units Needed:

<span className="
ml-1
font-semibold
text-slate-900
">

{request.unitsNeeded}

</span>

</p>





</div>









</div>



))



}





</div>


}





</div>









</div>





</main>


</ProtectedRoute>


);


}