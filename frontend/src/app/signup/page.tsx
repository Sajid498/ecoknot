"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";


export default function SignupPage() {


    const router = useRouter();


    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("USER");



    const handleSignup = async (e: React.FormEvent) => {

        e.preventDefault();

if(!name || !email || !password){

    alert("Please fill all fields");

    return;

}
        try {


            const response = await fetch(
                "http://localhost:8080/api/users/signup",
                {

                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                    },


                    body: JSON.stringify({

                        name,
                        email,
                        password,
                        role

                    }),

                }
            );



            if(!response.ok){

                throw new Error("Signup failed");

            }



            const data = await response.json();


            console.log(data);



            alert("Signup successful");


            router.push("/login");



        }
        catch(error){


            console.log(error);


            alert("Signup failed");


        }


    };





    return (

        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50 px-6">


            <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl border border-slate-200">



                {/* Logo */}

                <div className="text-center mb-8">


                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-700 text-2xl font-bold text-white">

                        E

                    </div>



                    <h1 className="mt-4 text-3xl font-bold text-slate-900">

                        Create Account

                    </h1>



                    <p className="mt-2 text-slate-500">

                        Join EcoKnot community

                    </p>


                </div>





                <form 
                    onSubmit={handleSignup}
                    className="space-y-5"
                >




                    {/* Name */}

                    <div>


                        <label className="text-sm font-medium text-slate-700">

                            Name

                        </label>



                        <input

                            type="text"

                            placeholder="Enter your name"

                            value={name}

                            onChange={(e)=>setName(e.target.value)}

                            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-600"

                        />


                    </div>





                    {/* Email */}

                    <div>


                        <label className="text-sm font-medium text-slate-700">

                            Email

                        </label>



                        <input

                            type="email"

                            placeholder="Enter your email"

                            value={email}

                            onChange={(e)=>setEmail(e.target.value)}

                            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-600"

                        />


                    </div>





                    {/* Password */}

                    <div>


                        <label className="text-sm font-medium text-slate-700">

                            Password

                        </label>



                        <input

                            type="password"

                            placeholder="Create password"

                            value={password}

                            onChange={(e)=>setPassword(e.target.value)}

                            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-600"

                        />


                    </div>






                    <button

                        type="submit"

                        className="w-full rounded-xl bg-emerald-700 py-3 font-semibold text-white transition hover:bg-emerald-800"

                    >

                        Signup

                    </button>




                </form>






                <p className="mt-6 text-center text-sm text-slate-600">


                    Already have an account?



                    <a

                        href="/login"

                        className="ml-2 font-semibold text-emerald-700 hover:underline"

                    >

                        Login

                    </a>


                </p>





            </div>


        </div>

    );


}