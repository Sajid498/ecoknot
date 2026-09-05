"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";


export default function LoginPage() {

    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");


    const handleLogin = async (e: React.FormEvent) => {

        e.preventDefault();


        try {

            const response = await fetch(
                "http://localhost:8080/api/users/login",
                {
                    method: "POST",

                    headers:{
                        "Content-Type":"application/json"
                    },

                    body: JSON.stringify({
                        email,
                        password
                    })
                }
            );


            if(!response.ok){

                throw new Error("Login failed");

            }


            const user = await response.json();


            console.log(user);


            localStorage.setItem(
                "user",
                JSON.stringify(user)
            );


            alert("Login successful");


            router.push("/");


        }
        catch(error){

            console.log(error);

            alert("Invalid email or password");

        }

    };


    return (

        <div>

            <h1>
                Login
            </h1>


            <form onSubmit={handleLogin}>


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
                    Login
                </button>


            </form>


        </div>

    );

}