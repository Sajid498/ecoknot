"use client";


import {
    useState
} from "react";


import {
    useRouter
} from "next/navigation";


import toast from "react-hot-toast";








const API_URL =

    process.env.NEXT_PUBLIC_API_URL ||

    "http://localhost:8080";









const initialForm = {


    patientName: "",


    bloodGroup: "",


    hospital: "",


    location: "",


    contactNumber: "",


    requiredDate: "",


    unitsNeeded: "",


    urgency: "NORMAL",


    description: "",


};












export default function CreateBloodRequestPage() {




    const router = useRouter();







    const [formData,setFormData] =

        useState(initialForm);






    const [loading,setLoading] =

        useState(false);












    function handleChange(

        e:
        React.ChangeEvent<

            HTMLInputElement |

            HTMLSelectElement |

            HTMLTextAreaElement

        >

    ){



        const {

            name,

            value

        } = e.target;







        setFormData({



            ...formData,



            [name]:value



        });



    }












    async function createRequest(){





        const savedUser =

            localStorage.getItem("user");






        if(!savedUser){



            toast.error(

                "Please login first"

            );



            return;


        }








        const user =

            JSON.parse(savedUser);







        try{



            setLoading(true);







            const response =

                await fetch(

`${API_URL}/api/blood-requests/user/${user.id}`,

                {



                    method:"POST",





                    headers:{


                        "Content-Type":

                        "application/json"


                    },







                    body:JSON.stringify({



                        ...formData,



                        unitsNeeded:

                        Number(

                            formData.unitsNeeded

                        )



                    })



                }

            );











            if(!response.ok){



                throw new Error(

                    "Request creation failed"

                );


            }









            toast.success(

                "Blood request created successfully"

            );






            router.push(

                "/my-requests"

            );





        }

        catch(error){



            console.log(error);




            toast.error(

                "Something went wrong"

            );



        }






        finally{



            setLoading(false);



        }




    }
    return (

        <main
            className="
            min-h-screen
            bg-slate-50
            "
        >



            <div
                className="
                mx-auto
                max-w-3xl
                px-6
                py-10
                "
            >



                <div
                    className="
                    rounded-3xl
                    bg-white
                    p-8
                    shadow
                    "
                >



                    <h1
                        className="
                        text-3xl
                        font-bold
                        "
                    >

                        🩸 Request Blood

                    </h1>




                    <p
                        className="
                        mt-2
                        text-slate-500
                        "
                    >

                        Create a blood request for your patient

                    </p>





                    <div
                        className="
                        mt-8
                        space-y-5
                        "
                    >




                        <input

                            name="patientName"

                            value={
                                formData.patientName
                            }

                            onChange={
                                handleChange
                            }

                            placeholder="Patient Name"

                            className="
                            w-full
                            rounded-xl
                            border
                            p-3
                            "

                        />





                        <select

                            name="bloodGroup"

                            value={
                                formData.bloodGroup
                            }

                            onChange={
                                handleChange
                            }

                            className="
                            w-full
                            rounded-xl
                            border
                            p-3
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






                        <input

                            name="hospital"

                            value={
                                formData.hospital
                            }

                            onChange={
                                handleChange
                            }

                            placeholder="Hospital Name"

                            className="
                            w-full
                            rounded-xl
                            border
                            p-3
                            "

                        />






                        <input

                            name="location"

                            value={
                                formData.location
                            }

                            onChange={
                                handleChange
                            }

                            placeholder="Location"

                            className="
                            w-full
                            rounded-xl
                            border
                            p-3
                            "

                        />







                        <input

                            name="contactNumber"

                            value={
                                formData.contactNumber
                            }

                            onChange={
                                handleChange
                            }

                            placeholder="Contact Number"

                            className="
                            w-full
                            rounded-xl
                            border
                            p-3
                            "

                        />







                        <input

                            type="date"

                            name="requiredDate"

                            value={
                                formData.requiredDate
                            }

                            onChange={
                                handleChange
                            }

                            className="
                            w-full
                            rounded-xl
                            border
                            p-3
                            "

                        />







                        <input

                            type="number"

                            name="unitsNeeded"

                            value={
                                formData.unitsNeeded
                            }

                            onChange={
                                handleChange
                            }

                            placeholder="Units Needed"

                            className="
                            w-full
                            rounded-xl
                            border
                            p-3
                            "

                        />







                        <select

                            name="urgency"

                            value={
                                formData.urgency
                            }

                            onChange={
                                handleChange
                            }

                            className="
                            w-full
                            rounded-xl
                            border
                            p-3
                            "

                        >

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







                        <textarea

                            name="description"

                            value={
                                formData.description
                            }

                            onChange={
                                handleChange
                            }

                            placeholder="Additional information"

                            rows={4}

                            className="
                            w-full
                            rounded-xl
                            border
                            p-3
                            "

                        />









                        <button


                            onClick={
                                createRequest
                            }


                            disabled={
                                loading
                            }


                            className="
                            w-full
                            rounded-xl
                            bg-red-600
                            py-3
                            font-semibold
                            text-white
                            transition
                            hover:bg-red-700
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                            "

                        >

                            {

                                loading

                                ?

                                "Creating..."

                                :

                                "🩸 Create Request"

                            }


                        </button>




                    </div>





                </div>





            </div>





        </main>


    );


}