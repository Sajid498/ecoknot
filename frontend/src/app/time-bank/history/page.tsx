"use client";


import {
    useEffect,
    useState
} from "react";


import {
    TimeTransaction
} from "@/types/timebank";





const API_URL =

    process.env.NEXT_PUBLIC_API_URL ||

    "http://localhost:8080";









export default function TimeHistoryPage(){





    const [transactions,setTransactions] =

        useState<TimeTransaction[]>([]);





    const [loading,setLoading] =

        useState(true);








    useEffect(()=>{


        loadHistory();


    },[]);









    async function loadHistory(){



        try{


            const user =

                JSON.parse(

                    localStorage.getItem("user") || "{}"

                );





            if(!user.id){

                return;

            }







            const response =

                await fetch(

`${API_URL}/api/time-bank/history/${user.id}`

                );







            const data =

                await response.json();







            setTransactions(data);



        }


        catch(error){



            console.log(error);



        }


        finally{


            setLoading(false);


        }


    }









    if(loading){



        return(

            <main className="
            min-h-screen
            flex
            items-center
            justify-center
            bg-slate-50
            ">


                <div className="
                rounded-xl
                bg-white
                p-8
                shadow
                ">

                    Loading history...

                </div>



            </main>

        );

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
text-slate-900
">

📜 Time Bank History

</h1>




<p className="
mt-2
text-slate-600
">

Track your earned and spent time credits.

</p>








<div className="
mt-8
space-y-5
">






{

transactions.length === 0 ?



<div className="
rounded-2xl
bg-white
p-8
text-center
shadow
text-slate-600
">

No transactions yet.

</div>





:

transactions.map(

transaction=>(



<div

key={transaction.id}

className="
rounded-2xl
bg-white
p-6
shadow
"

>



<div className="
flex
items-center
justify-between
"

>



<div>



<h2 className="
font-bold
text-slate-900
">

{

transaction.type === "EARN"

?

"⬆️ Earned Time"

:

"⬇️ Spent Time"

}

</h2>





<p className="
mt-2
text-slate-600
">

{transaction.description}

</p>




</div>







<p

className={`

text-3xl
font-bold


${

transaction.amount > 0

?

"text-emerald-700"

:

"text-red-600"

}

`}

>

{

transaction.amount > 0

?

"+"

:

""

}

{transaction.amount}

h

</p>







</div>








<p className="
mt-4
text-sm
text-slate-500
">

{transaction.createdAt}

</p>





</div>



)


)


}




</div>





</div>





</main>



);


}