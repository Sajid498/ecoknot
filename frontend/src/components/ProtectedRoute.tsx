"use client";

import {
    useEffect,
    useState
} from "react";

import {
    useRouter
} from "next/navigation";


export default function ProtectedRoute({
    children,
}: {
    children: React.ReactNode;
}) {


    const router =
        useRouter();


    const [checkingAuth,setCheckingAuth] =
        useState(true);


    const [authorized,setAuthorized] =
        useState(false);




    useEffect(()=>{


        const savedUser =
            localStorage.getItem("user");


        if(!savedUser){


            setAuthorized(false);

            setCheckingAuth(false);

            router.replace("/login");

            return;


        }


        try{


            const user =
                JSON.parse(savedUser);


            if(
                !user
                ||
                typeof user !== "object"
                ||
                !user.id
                ||
                !user.email
            ){


                localStorage.removeItem("user");

                setAuthorized(false);

                setCheckingAuth(false);

                router.replace("/login");

                return;


            }


            setAuthorized(true);

            setCheckingAuth(false);


        }
        catch(error){


            console.log(
                "Invalid saved user session:",
                error
            );


            localStorage.removeItem("user");

            setAuthorized(false);

            setCheckingAuth(false);

            router.replace("/login");


        }


    },[router]);




    if(checkingAuth){


        return(


            <div className="
            min-h-[40vh]
            flex
            items-center
            justify-center
            text-slate-500
            ">


                Checking session...


            </div>


        );


    }




    if(!authorized){


        return null;


    }




    return(


        <>

            {children}

        </>


    );


}
