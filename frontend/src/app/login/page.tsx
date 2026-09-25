"use client";

import {
    useState
} from "react";

import {
    useRouter
} from "next/navigation";


const API_URL =
    process.env.NEXT_PUBLIC_API_URL
    ||
    "http://localhost:8080";


export default function LoginPage() {


    const router =
        useRouter();


    const [email,setEmail] =
        useState("");


    const [password,setPassword] =
        useState("");


    const [submitting,setSubmitting] =
        useState(false);






    const handleLogin =
        async (
            e: React.FormEvent
        ) => {


        e.preventDefault();



        if(
            !email.trim()
            ||
            !password
        ){


            alert(
                "Please enter email and password"
            );


            return;

        }





        try {


            setSubmitting(
                true
            );



            const response =
                await fetch(

                    `${API_URL}/api/users/login`,

                    {

                        method:"POST",

                        headers:{

                            "Content-Type":
                                "application/json"

                        },

                        body:JSON.stringify({

                            email:
                                email.trim(),

                            password

                        })

                    }

                );





            if(!response.ok){


                const message =
                    await response.text();


                throw new Error(

                    message
                    ||
                    "Login failed"

                );


            }





            const data =
                await response.json();



            if(
                !data?.user
                ||
                !data?.token
            ){


                throw new Error(

                    "Invalid login response"

                );


            }





            localStorage.setItem(

                "user",

                JSON.stringify(
                    data.user
                )

            );



            localStorage.setItem(

                "token",

                data.token

            );





            alert(
                "Login successful"
            );



            router.push(
                "/"
            );


        }
        catch(error){


            console.log(
                error
            );


            alert(

                error instanceof Error

                    ?

                    error.message

                    :

                    "Invalid email or password"

            );


        }
        finally{


            setSubmitting(
                false
            );


        }


    };






    return (


        <div className="
        min-h-screen
        flex
        items-center
        justify-center
        bg-gradient-to-br
        from-emerald-50
        via-white
        to-teal-50
        px-6
        ">



            <div className="
            w-full
            max-w-md
            rounded-3xl
            bg-white
            p-8
            shadow-xl
            border
            border-slate-200
            ">





                <div className="
                text-center
                mb-8
                ">


                    <div className="
                    mx-auto
                    flex
                    h-14
                    w-14
                    items-center
                    justify-center
                    rounded-xl
                    bg-emerald-700
                    text-2xl
                    font-bold
                    text-white
                    ">


                        E


                    </div>




                    <h1 className="
                    mt-4
                    text-3xl
                    font-bold
                    text-slate-900
                    ">


                        Welcome Back


                    </h1>




                    <p className="
                    mt-2
                    text-slate-500
                    ">


                        Login to your EcoKnot account


                    </p>



                </div>








                <form

                    onSubmit={
                        handleLogin
                    }

                    className="
                    space-y-5
                    "

                >





                    <div>


                        <label className="
                        text-sm
                        font-medium
                        text-slate-700
                        ">


                            Email


                        </label>



                        <input

                            type="email"

                            placeholder="
                            Enter your email
                            "

                            value={
                                email
                            }

                            onChange={
                                (e)=>
                                    setEmail(
                                        e.target.value
                                    )
                            }

                            required

                            disabled={
                                submitting
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
                            transition
                            focus:border-emerald-600
                            disabled:opacity-60
                            "

                        />



                    </div>









                    <div>



                        <label className="
                        text-sm
                        font-medium
                        text-slate-700
                        ">


                            Password


                        </label>



                        <input

                            type="password"

                            placeholder="
                            Enter your password
                            "

                            value={
                                password
                            }

                            onChange={
                                (e)=>
                                    setPassword(
                                        e.target.value
                                    )
                            }

                            required

                            disabled={
                                submitting
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
                            transition
                            focus:border-emerald-600
                            disabled:opacity-60
                            "

                        />



                    </div>









                    <button

                        type="submit"

                        disabled={
                            submitting
                        }

                        className="
                        w-full
                        rounded-xl
                        bg-emerald-700
                        px-5
                        py-3
                        font-semibold
                        text-white
                        transition
                        hover:bg-emerald-800
                        disabled:cursor-not-allowed
                        disabled:opacity-60
                        "

                    >


                        {
                            submitting

                                ?

                                "Logging in..."

                                :

                                "Login"
                        }


                    </button>



                </form>





            </div>



        </div>


    );


}
