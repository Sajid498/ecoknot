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


        } catch(error){

            console.log(error);

            alert("Signup failed");

        }

    };


    return (

        <div>

            <h1>
                Signup
            </h1>


            <form onSubmit={handleSignup}>


                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e)=>setName(e.target.value)}
                />


                <br/>


                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                />


                <br/>


                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                />


                <br/>


                <button type="submit">
                    Signup
                </button>


            </form>


        </div>

    );
}