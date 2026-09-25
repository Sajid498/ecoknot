"use client";


import {
    useEffect,
    useState
} from "react";


import Link from "next/link";


import TimeRequestCard from "@/components/TimeRequestCard";


import TimeOfferCard from "@/components/TimeOfferCard";


import {
    TimeOffer,
    TimeRequest
} from "@/types/timebank";



const API_URL =

    process.env.NEXT_PUBLIC_API_URL ||

    "http://localhost:8080";



type LoggedInUser = {

    id: number;

    name?: string;

    email?: string;

};



export default function TimeBankPage(){


    const [requests,setRequests] =

        useState<TimeRequest[]>([]);


    const [myRequests,setMyRequests] =

        useState<TimeRequest[]>([]);


    const [offers,setOffers] =

        useState<TimeOffer[]>([]);


    const [balance,setBalance] =

        useState<number>(0);


    const [loading,setLoading] =

        useState(true);


    const [error,setError] =

        useState("");


    const [user,setUser] =

        useState<LoggedInUser | null>(null);


    const [completingId,setCompletingId] =

        useState<number | null>(null);




    useEffect(()=>{


        const savedUser =

            localStorage.getItem("user");


        if(savedUser){


            try{


                setUser(

                    JSON.parse(savedUser)

                );


            }
            catch(error){


                console.log(error);


                setError(

                    "Unable to load logged-in user information."

                );


                setLoading(false);


            }


        }
        else{


            setError(

                "Please login to use the Time Bank."

            );


            setLoading(false);


        }


    },[]);




    useEffect(()=>{


        if(user?.id){


            loadData();


        }


    },[user]);




    async function loadData(){


        try{


            setLoading(true);

            setError("");


            await Promise.all([

                loadRequests(),

                loadMyRequests(),

                loadOffers(),

                loadBalance()

            ]);


        }
        catch(error){


            console.log(error);


            setError(

                error instanceof Error

                    ?

                    error.message

                    :

                    "Unable to load Time Bank data."

            );


        }
        finally{


            setLoading(false);


        }


    }




    async function loadRequests(){


        if(!user?.id){

            return;

        }


        const response =
            await fetch(

                `${API_URL}/api/time-bank/requests/${user.id}`

            );


        if(!response.ok){


            const message =
                await response.text();


            throw new Error(

                message ||

                "Unable to load available requests."

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




    async function loadMyRequests(){


        if(!user?.id){

            return;

        }


        const response =
            await fetch(

                `${API_URL}/api/time-bank/my-requests/${user.id}`

            );


        if(!response.ok){


            const message =
                await response.text();


            throw new Error(

                message ||

                "Unable to load your requests."

            );


        }


        const data =
            await response.json();


        setMyRequests(

            Array.isArray(data)

                ?

                data

                :

                []

        );


    }




    async function loadOffers(){


        const response =
            await fetch(

                `${API_URL}/api/time-bank/offers`

            );


        if(!response.ok){


            const message =
                await response.text();


            throw new Error(

                message ||

                "Unable to load time offers."

            );


        }


        const data =
            await response.json();


        setOffers(

            Array.isArray(data)

                ?

                data

                :

                []

        );


    }




    async function loadBalance(){


        if(!user?.id){

            return;

        }


        const response =
            await fetch(

                `${API_URL}/api/time-bank/balance/${user.id}`

            );


        if(!response.ok){


            const message =
                await response.text();


            throw new Error(

                message ||

                "Unable to load balance."

            );


        }


        const data =
            await response.json();


        setBalance(

            Number(data) || 0

        );


    }




    async function handleAccept(

        requestId:number

    ){


        if(!user?.id){

            return;

        }


        try{


            const response =
                await fetch(

                    `${API_URL}/api/time-bank/accept/${requestId}?helperId=${user.id}`,

                    {

                        method:"PUT"

                    }

                );


            if(!response.ok){


                const message =
                    await response.text();


                throw new Error(

                    message ||

                    "Accept failed"

                );


            }


            alert(

                "Request accepted successfully"

            );


            await Promise.all([

                loadRequests(),

                loadMyRequests()

            ]);


        }
        catch(error){


            console.log(error);


            alert(

                error instanceof Error

                    ?

                    error.message

                    :

                    "Unable to accept request"

            );


        }


    }




    async function handleComplete(

        requestId:number

    ){


        if(!user?.id){

            return;

        }


        const confirmed =
            window.confirm(

                "Confirm that this help request has been completed?"

            );


        if(!confirmed){

            return;

        }


        try{


            setCompletingId(

                requestId

            );


            const response =
                await fetch(

                    `${API_URL}/api/time-bank/complete/${requestId}?requesterId=${user.id}`,

                    {

                        method:"PUT"

                    }

                );


            if(!response.ok){


                const message =
                    await response.text();


                throw new Error(

                    message ||

                    "Unable to complete request."

                );


            }


            alert(

                "Request completed and time credits transferred successfully."

            );


            await Promise.all([

                loadMyRequests(),

                loadRequests(),

                loadBalance()

            ]);


        }
        catch(error){


            console.log(error);


            alert(

                error instanceof Error

                    ?

                    error.message

                    :

                    "Unable to complete request."

            );


        }
        finally{


            setCompletingId(

                null

            );


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


                    Loading Time Bank...


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
            max-w-6xl
            ">




                <div className="
                flex
                flex-col
                gap-5
                md:flex-row
                md:items-center
                md:justify-between
                ">


                    <div>


                        <h1 className="
                        text-3xl
                        font-bold
                        text-slate-900
                        ">


                            ⏳ Community Time Bank


                        </h1>


                        <p className="
                        mt-2
                        text-slate-600
                        ">


                            Give help, earn time credits, and use credits later.


                        </p>


                    </div>




                    <div className="
                    flex
                    flex-wrap
                    gap-3
                    ">


                        <Link

                            href="/time-bank/request"

                            className="
                            rounded-xl
                            bg-emerald-700
                            px-5
                            py-3
                            font-semibold
                            text-white
                            hover:bg-emerald-800
                            "

                        >

                            + Create Request

                        </Link>




                        <Link

                            href="/time-bank/create"

                            className="
                            rounded-xl
                            border
                            border-emerald-700
                            bg-white
                            px-5
                            py-3
                            font-semibold
                            text-emerald-700
                            hover:bg-emerald-50
                            "

                        >

                            + Offer a Skill

                        </Link>




                        <Link

                            href="/time-bank/history"

                            className="
                            rounded-xl
                            border
                            border-slate-300
                            bg-white
                            px-5
                            py-3
                            font-semibold
                            text-slate-700
                            hover:bg-slate-100
                            "

                        >

                            History

                        </Link>


                    </div>


                </div>




                {
                    error &&


                    <div className="
                    mt-6
                    rounded-xl
                    border
                    border-red-200
                    bg-red-50
                    p-4
                    font-medium
                    text-red-700
                    ">


                        ⚠️ {error}


                    </div>
                }




                <div className="
                mt-8
                rounded-3xl
                bg-emerald-700
                p-8
                text-white
                ">


                    <p className="
                    text-sm
                    ">

                        My Time Credits

                    </p>


                    <h2 className="
                    mt-3
                    text-5xl
                    font-bold
                    ">

                        {balance}

                    </h2>


                    <p className="
                    mt-2
                    ">

                        hours available

                    </p>


                </div>




                <section className="
                mt-10
                ">


                    <h2 className="
                    text-2xl
                    font-bold
                    text-slate-900
                    ">

                        My Help Requests

                    </h2>


                    <p className="
                    mt-1
                    text-sm
                    text-slate-600
                    ">

                        Track your requests and confirm completion after receiving help.

                    </p>




                    {
                        myRequests.length === 0

                            ?

                            <div className="
                            mt-5
                            rounded-2xl
                            bg-white
                            p-8
                            text-center
                            shadow
                            ">

                                You have not created any help requests yet.

                            </div>

                            :

                            <div className="
                            mt-6
                            grid
                            gap-6
                            md:grid-cols-2
                            ">


                                {
                                    myRequests.map(
                                        request => (


                                            <div

                                                key={request.id}

                                                className="
                                                rounded-2xl
                                                border
                                                border-slate-200
                                                bg-white
                                                p-6
                                                shadow-sm
                                                "

                                            >


                                                <div className="
                                                flex
                                                items-start
                                                justify-between
                                                gap-4
                                                ">


                                                    <div>


                                                        <h3 className="
                                                        text-xl
                                                        font-bold
                                                        text-slate-900
                                                        ">

                                                            {request.title}

                                                        </h3>


                                                        <p className="
                                                        mt-2
                                                        text-sm
                                                        text-slate-600
                                                        ">

                                                            {request.description}

                                                        </p>


                                                    </div>




                                                    <span className="
                                                    rounded-full
                                                    bg-slate-100
                                                    px-3
                                                    py-1
                                                    text-sm
                                                    font-semibold
                                                    text-slate-700
                                                    ">

                                                        {request.status}

                                                    </span>


                                                </div>




                                                <div className="
                                                mt-5
                                                space-y-2
                                                text-sm
                                                text-slate-700
                                                ">


                                                    <p>

                                                        🛠 Category:{" "}

                                                        <strong>
                                                            {request.category}
                                                        </strong>

                                                    </p>


                                                    <p>

                                                        ⏳ Required Time:{" "}

                                                        <strong>
                                                            {request.requiredHours} hours
                                                        </strong>

                                                    </p>


                                                    {
                                                        request.helper &&


                                                        <p>

                                                            🤝 Helper:{" "}

                                                            <strong>
                                                                {request.helper.name}
                                                            </strong>

                                                        </p>
                                                    }


                                                </div>




                                                {
                                                    request.status === "ACCEPTED" &&


                                                    <button

                                                        onClick={() =>
                                                            handleComplete(
                                                                request.id
                                                            )
                                                        }

                                                        disabled={
                                                            completingId === request.id
                                                        }

                                                        className="
                                                        mt-6
                                                        w-full
                                                        rounded-xl
                                                        bg-blue-700
                                                        py-3
                                                        font-semibold
                                                        text-white
                                                        hover:bg-blue-800
                                                        disabled:cursor-not-allowed
                                                        disabled:opacity-60
                                                        "

                                                    >

                                                        {
                                                            completingId === request.id

                                                                ?

                                                                "Completing..."

                                                                :

                                                                "Complete Request"
                                                        }

                                                    </button>
                                                }


                                            </div>


                                        )
                                    )
                                }


                            </div>
                    }


                </section>




                <section className="
                mt-12
                ">


                    <h2 className="
                    text-2xl
                    font-bold
                    text-slate-900
                    ">

                        People Need Help

                    </h2>


                    <p className="
                    mt-1
                    text-sm
                    text-slate-600
                    ">

                        Accept a request and earn time credits after completion.

                    </p>




                    {
                        requests.length === 0

                            ?

                            <div className="
                            mt-5
                            rounded-2xl
                            bg-white
                            p-8
                            text-center
                            shadow
                            ">

                                No help requests available.

                            </div>

                            :

                            <div className="
                            mt-6
                            grid
                            gap-6
                            md:grid-cols-2
                            ">


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




                <section className="
                mt-12
                ">


                    <div className="
                    flex
                    flex-col
                    gap-2
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                    ">


                        <div>


                            <h2 className="
                            text-2xl
                            font-bold
                            text-slate-900
                            ">

                                Skills Offered by the Community

                            </h2>


                            <p className="
                            mt-1
                            text-sm
                            text-slate-600
                            ">

                                See what skills and time community members are offering.

                            </p>


                        </div>




                        <Link

                            href="/time-bank/create"

                            className="
                            text-sm
                            font-bold
                            text-emerald-700
                            "

                        >

                            Offer your skill →

                        </Link>


                    </div>




                    {
                        offers.length === 0

                            ?

                            <div className="
                            mt-5
                            rounded-2xl
                            bg-white
                            p-8
                            text-center
                            shadow
                            ">

                                No available skill offers yet.

                            </div>

                            :

                            <div className="
                            mt-6
                            grid
                            gap-6
                            md:grid-cols-2
                            ">


                                {
                                    offers.map(
                                        offer => (


                                            <TimeOfferCard

                                                key={offer.id}

                                                offer={offer}

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