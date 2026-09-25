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
            localStorage.getItem(
                "user"
            );


        const token =
            localStorage.getItem(
                "token"
            );


        if(
            !savedUser
            ||
            !token
        ){


            clearSession();

            setAuthorized(
                false
            );

            setCheckingAuth(
                false
            );

            router.replace(
                "/login"
            );

            return;


        }


        try{


            const user =
                JSON.parse(
                    savedUser
                );


            if(
                !user
                ||
                typeof user !== "object"
                ||
                !user.id
                ||
                !user.email
                ||
                isJwtExpired(
                    token
                )
            ){


                clearSession();

                setAuthorized(
                    false
                );

                setCheckingAuth(
                    false
                );

                router.replace(
                    "/login"
                );

                return;


            }


            setAuthorized(
                true
            );

            setCheckingAuth(
                false
            );


        }
        catch(error){


            console.log(
                "Invalid saved session:",
                error
            );


            clearSession();

            setAuthorized(
                false
            );

            setCheckingAuth(
                false
            );

            router.replace(
                "/login"
            );


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




function clearSession(){


    localStorage.removeItem(
        "user"
    );


    localStorage.removeItem(
        "token"
    );


    localStorage.removeItem(
        "activeModule"
    );


}




function isJwtExpired(
    token:string
){


    try{


        const parts =
            token.split(
                "."
            );


        if(parts.length !== 3){


            return true;


        }


        const payload =
            JSON.parse(

                decodeURIComponent(

                    atob(
                        parts[1]
                            .replace(
                                /-/g,
                                "+"
                            )
                            .replace(
                                /_/g,
                                "/"
                            )
                    )
                    .split("")
                    .map(
                        char =>
                            "%"
                            +
                            (
                                "00"
                                +
                                char
                                    .charCodeAt(0)
                                    .toString(16)
                            )
                            .slice(-2)
                    )
                    .join("")

                )

            );


        if(!payload.exp){


            return true;


        }


        return (
            payload.exp * 1000
            <=
            Date.now()
        );


    }
    catch(error){


        console.log(
            "JWT validation error:",
            error
        );


        return true;


    }


}