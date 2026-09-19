"use client";


import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";

import {
    useEffect,
    useState
} from "react";

import {
    useRouter
} from "next/navigation";

import toast from "react-hot-toast";





const API_URL =

    process.env.NEXT_PUBLIC_API_URL ||

    "http://localhost:8080";









type BloodRequest = {


    id:number;


    patientName:string;


    bloodGroup:string;


    hospital:string;


    location:string;


    contactNumber:string;


    requiredDate:string;


    unitsNeeded:number;


    urgency:string;


    description:string;


    status:string;


    userId:number;


};









export default function BloodDonationPage(){



    const router = useRouter();









    const [currentUser,setCurrentUser] =

        useState<any>(null);








    const [requests,setRequests] =

        useState<BloodRequest[]>([]);








    const [allRequests,setAllRequests] =

        useState<BloodRequest[]>([]);








    const [isLoading,setIsLoading] =

        useState(true);








    const [searchLocation,setSearchLocation] =

        useState("");








    const [bloodGroupFilter,setBloodGroupFilter] =

        useState("");








    const [statusFilter,setStatusFilter] =

        useState("");








    const [urgencyFilter,setUrgencyFilter] =

        useState("");













    const availableRequests =

        requests.filter(

            (request)=>

                request.userId !== currentUser?.id

                &&

                request.status !== "CANCELLED"

                &&

                request.status !== "FULFILLED"

        );













    async function loadBloodRequests(){


        try{


            setIsLoading(true);







            const response =

                await fetch(

                    `${API_URL}/api/blood-requests`

                );








            if(!response.ok){


                throw new Error(

                    "Failed to load requests"

                );


            }








            const data =

                await response.json();








            setAllRequests(data);


            setRequests(data);







        }

        catch(error){



            console.log(error);


            toast.error(

                "Failed to load requests"

            );


        }

        finally{


            setIsLoading(false);


        }


    }













    useEffect(()=>{


        localStorage.setItem(

            "activeModule",

            "blood"

        );








        const savedUser =

            localStorage.getItem("user");








        if(savedUser){


            setCurrentUser(

                JSON.parse(savedUser)

            );


        }








        loadBloodRequests();






    },[]);













    useEffect(()=>{


        applyFilters();



    },[

        searchLocation,

        bloodGroupFilter,

        statusFilter,

        urgencyFilter

    ]);













    function applyFilters(){



        let filtered =

            [...allRequests];








        if(searchLocation.trim()){



            filtered =

                filtered.filter(

                    (request)=>

                        request.location

                        .toLowerCase()

                        .includes(

                            searchLocation

                            .toLowerCase()

                        )

                );



        }








        if(bloodGroupFilter){



            filtered =

                filtered.filter(

                    (request)=>

                        request.bloodGroup ===

                        bloodGroupFilter

                );



        }









        if(statusFilter){



            filtered =

                filtered.filter(

                    (request)=>

                        request.status ===

                        statusFilter

                );


        }









        if(urgencyFilter){



            filtered =

                filtered.filter(

                    (request)=>

                        request.urgency ===

                        urgencyFilter

                );


        }








        setRequests(filtered);



    }













    function resetFilters(){



        setSearchLocation("");

        setBloodGroupFilter("");

        setStatusFilter("");

        setUrgencyFilter("");



        setRequests(

            allRequests

        );


    }













    async function handleDonate(

        requestId:number

    ){



        if(!currentUser){



            toast.error(

                "Please login first"

            );


            return;


        }









        try{



            // Check donor eligibility


            const eligibilityResponse =

                await fetch(

`${API_URL}/api/users/${currentUser.id}/eligibility`

                );








            const eligibilityData =

                await eligibilityResponse.json();








            if(!eligibilityData.eligible){



                toast.error(

                    eligibilityData.message

                );


                return;


            }









            const response =

                await fetch(

`${API_URL}/api/donation-response`,

                    {


                        method:"POST",


                        headers:{


                            "Content-Type":

                            "application/json"


                        },



                        body:JSON.stringify({


                            requestId,


                            donorId:

                            currentUser.id,


                            donorName:

                            currentUser.name,


                            donorEmail:

                            currentUser.email,


                            donorPhone:

                            currentUser.phone ||

                            "Not provided"



                        })


                    }

                );









            if(!response.ok){



                const error =

                    await response.json();





                throw new Error(

                    error.message ||

                    "Donation failed"

                );


            }









            toast.success(

                "Donation interest sent successfully"

            );








            loadBloodRequests();







        }

        catch(error:any){



            console.log(error);



            toast.error(

                error.message ||

                "Something went wrong"

            );


        }


    }
    






    function formatBloodGroup(

        bloodGroup:string

    ){



        if(!bloodGroup){


            return "";


        }







        return bloodGroup

            .replace(

                "_POSITIVE",

                "+"

            )

            .replace(

                "_NEGATIVE",

                "-"

            );


    }













    function getStatusStyle(

        status:string

    ){



        if(status==="OPEN"){



            return "bg-green-100 text-green-700";


        }







        if(status==="DONOR_FOUND"){



            return "bg-blue-100 text-blue-700";


        }







        if(status==="FULFILLED"){



            return "bg-gray-100 text-gray-700";


        }







        if(status==="CANCELLED"){



            return "bg-red-100 text-red-700";


        }







        return "bg-red-100 text-red-700";


    }













    function getUrgencyStyle(

        urgency:string

    ){



        if(urgency==="CRITICAL"){



            return "text-red-600 font-bold";


        }








        if(urgency==="URGENT"){



            return "text-orange-600 font-bold";


        }







        return "text-green-600 font-semibold";


    }














    return (



    <ProtectedRoute>


    <>






    <Navbar />









    <main className="
    min-h-screen
    bg-slate-50
    p-6
    md:p-10
    ">








    <div className="
    mx-auto
    max-w-7xl
    ">









    <h1 className="
    text-3xl
    font-bold
    text-slate-900
    ">


        🩸 Blood Donation


    </h1>








    <p className="
    mt-2
    text-slate-600
    ">


        Find blood requests and help your community.


    </p>









    <button


    onClick={()=>{


        router.push(

            "/blood-donation/create"

        );


    }}



    className="
    mt-5
    rounded-xl
    bg-red-600
    px-5
    py-3
    font-semibold
    text-white
    hover:bg-red-700
    "


    >


        🩸 Request Blood


    </button>













    {/* FILTER SECTION */}



    <div className="
    mt-8
    rounded-2xl
    bg-white
    p-6
    shadow
    ">








    <h2 className="
    text-xl
    font-bold
    ">


        Search Blood Requests


    </h2>









    <div className="
    mt-5
    grid
    grid-cols-1
    gap-4
    md:grid-cols-4
    ">









    <input



    value={searchLocation}



    onChange={(e)=>

        setSearchLocation(

            e.target.value

        )

    }



    placeholder="Search location"



    className="
    rounded-lg
    border
    p-3
    "


    />














    <select



    value={bloodGroupFilter}



    onChange={(e)=>

        setBloodGroupFilter(

            e.target.value

        )

    }



    className="
    rounded-lg
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













    <select



    value={urgencyFilter}



    onChange={(e)=>

        setUrgencyFilter(

            e.target.value

        )

    }



    className="
    rounded-lg
    border
    p-3
    "


    >



    <option value="">


        All Urgency


    </option>





    <option value="NORMAL">


        Normal


    </option>





    <option value="URGENT">


        Urgent


    </option>





    <option value="CRITICAL">


        Critical


    </option>



    </select>













    <select



    value={statusFilter}



    onChange={(e)=>

        setStatusFilter(

            e.target.value

        )

    }



    className="
    rounded-lg
    border
    p-3
    "


    >



    <option value="">


        All Status


    </option>





    <option value="OPEN">


        Open


    </option>





    <option value="DONOR_FOUND">


        Donor Found


    </option>





    <option value="FULFILLED">


        Fulfilled


    </option>





    <option value="CANCELLED">


        Cancelled


    </option>



    </select>







    </div>












    <button


    onClick={resetFilters}



    className="
    mt-5
    rounded-lg
    border
    px-5
    py-2
    "


    >


        Reset Filter


    </button>







    </div>
    








    {/* REQUEST LIST */}



    <div className="
    mt-10
    grid
    gap-6
    md:grid-cols-2
    lg:grid-cols-3
    ">









    {


    isLoading ?



    (


        <p>


            Loading blood requests...


        </p>


    )



    :





    availableRequests.length===0 ?



    (



        <div className="
        rounded-xl
        bg-white
        p-6
        shadow
        ">


            No blood request found.


        </div>



    )





    :






    availableRequests.map(

        (request)=>(





        <div


        key={request.id}



        className="
        rounded-2xl
        bg-white
        p-6
        shadow
        transition
        hover:shadow-lg
        "



        >







        <div className="
        flex
        items-center
        justify-between
        ">







        <h2 className="
        text-2xl
        font-bold
        text-red-600
        ">



            🩸

            {

            formatBloodGroup(

                request.bloodGroup

            )

            }



        </h2>









        <span



        className={`

        rounded-full

        px-3

        py-1

        text-sm

        font-semibold


        ${

        getStatusStyle(

            request.status

        )


        }


        `}



        >




            {request.status}




        </span>







        </div>












        <h3 className="
        mt-5
        text-xl
        font-bold
        ">


            {request.patientName}


        </h3>









        <div className="
        mt-4
        space-y-2
        text-slate-600
        ">








        <p>


            🏥 Hospital:


            <b className="ml-1">


                {request.hospital}


            </b>



        </p>








        <p>


            📍 Location:


            <b className="ml-1">


                {request.location}


            </b>



        </p>








        <p>


            🩸 Required Units:


            <b className="ml-1">


                {request.unitsNeeded}


            </b>



        </p>








        <p>


            📅 Required Date:


            <b className="ml-1">


                {request.requiredDate}


            </b>



        </p>








        <p>


            ⚠️ Urgency:


            <span

            className={

                getUrgencyStyle(

                    request.urgency

                )

            }


            >


                {" "}

                {request.urgency}


            </span>



        </p>








        <p>


            📞 Contact:


            <b className="ml-1">


                {request.contactNumber}


            </b>



        </p>









        </div>












        <div className="
        mt-6
        flex
        gap-3
        ">









        <button



        onClick={()=>{


            router.push(

                `/blood-donation/${request.id}`

            );


        }}



        className="
        flex-1
        rounded-lg
        border
        py-2
        font-semibold
        hover:bg-slate-100
        "



        >


            View


        </button>














        {


        request.status==="OPEN"

        &&



        (



        <button



        onClick={()=>


            handleDonate(

                request.id

            )


        }



        className="
        flex-1
        rounded-lg
        bg-emerald-700
        py-2
        font-semibold
        text-white
        hover:bg-emerald-800
        "



        >



            Donate



        </button>



        )


        }









        </div>









        </div>





        )


    )





    }





    </div>









    </div>


    </main>






    </>

    </ProtectedRoute>


    );



}