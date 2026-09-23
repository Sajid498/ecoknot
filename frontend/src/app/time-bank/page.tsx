"use client";


import {
    useEffect,
    useState
} from "react";


import Link from "next/link";


import TimeRequestCard from "@/components/TimeRequestCard";


import {
    TimeRequest
} from "@/types/timebank";




const API_URL =

    process.env.NEXT_PUBLIC_API_URL ||

    "http://localhost:8080";







export default function TimeBankPage(){



    const [requests,setRequests] =

        useState<TimeRequest[]>([]);



    const [balance,setBalance] =

        useState<number>(0);



    const [loading,setLoading] =

        useState(true);






    const [user,setUser] =

        useState<any>(null);







    useEffect(()=>{


        const savedUser =

            localStorage.getItem("user");



        if(savedUser){


            setUser(

                JSON.parse(savedUser)

            );


        }


    },[]);









    useEffect(()=>{


        if(user?.id){


            loadData();


        }


    },[user]);









    async function loadData(){


        try{


            await Promise.all([

                loadRequests(),

                loadBalance()

            ]);


        }

        catch(error){


            console.log(error);


        }

        finally{


            setLoading(false);


        }


    }









    async function loadRequests(){



        if(!user?.id){

            return;

        }






        const response = await fetch(


            `${API_URL}/api/time-bank/requests/${user.id}`


        );






        const data = await response.json();




        console.log(

            "AVAILABLE REQUESTS:",

            data

        );






        if(Array.isArray(data)){


            setRequests(data);


        }

        else{


            setRequests([]);


        }



    }









    async function loadBalance(){



        if(!user?.id){

            return;

        }






        const response = await fetch(


            `${API_URL}/api/time-bank/balance/${user.id}`


        );





        const data = await response.json();




        setBalance(data || 0);



    }












    async function handleAccept(

        requestId:number

    ){



        try{



            const response = await fetch(


                `${API_URL}/api/time-bank/accept/${requestId}?helperId=${user.id}`,


                {


                    method:"PUT"


                }


            );






            if(!response.ok){


                throw new Error(

                    "Accept failed"

                );


            }






            alert(

                "Request accepted successfully"

            );






            loadRequests();




        }

        catch(error){


            console.log(error);


            alert(

                "Unable to accept request"

            );


        }


    }












    if(loading){



        return(


            <main className="min-h-screen flex items-center justify-center bg-slate-50">


                <div className="rounded-xl bg-white p-8 shadow">


                    Loading Time Bank...


                </div>


            </main>


        );


    }









return(



<main className="min-h-screen bg-slate-50 p-6 md:p-10">



<div className="mx-auto max-w-6xl">






<div className="flex justify-between items-center">



<div>



<h1 className="text-3xl font-bold text-slate-900">


⏳ Community Time Bank


</h1>




<p className="mt-2 text-slate-600">


Give help, earn time credits, use credits later.


</p>




</div>







<Link


href="/time-bank/request"


className="rounded-xl bg-emerald-700 px-5 py-3 font-semibold text-white hover:bg-emerald-800"


>


+ Create Request


</Link>





</div>









<div className="mt-8 rounded-3xl bg-emerald-700 p-8 text-white">



<p className="text-sm">


My Time Credits


</p>





<h2 className="mt-3 text-5xl font-bold">


{balance}


</h2>





<p className="mt-2">


hours available


</p>




</div>









<section className="mt-10">



<h2 className="text-2xl font-bold text-slate-900">


People Need Help


</h2>







{


requests.length === 0 ?





<div className="mt-5 rounded-2xl bg-white p-8 text-center shadow">


No help requests available.


</div>







:






<div className="mt-6 grid gap-6 md:grid-cols-2">



{


requests.map(

request => (


<TimeRequestCard


key={request.id}


request={request}


onAccept={handleAccept}


/>


)


)


}





</div>




}



</section>








</div>



</main>



);



}