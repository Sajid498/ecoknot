"use client";


import Link from "next/link";


import {
    usePathname
} from "next/navigation";







export default function ReliefNavbar(){



    const pathname =

        usePathname();







    function isActive(

        path:string

    ){



        if(path === "/rescue"){


            return pathname === "/rescue";


        }



        return pathname.startsWith(path);


    }









    function navClass(

        path:string

    ){



        return `

        relative

        whitespace-nowrap

        px-3

        py-4

        text-sm

        font-medium

        transition


        ${

            isActive(path)

            ?

            "text-emerald-700"

            :

            "text-slate-600 hover:text-emerald-700"

        }

        `;


    }









    return(



        <div

            className="

            sticky

            top-[69px]

            z-40

            border-b

            border-slate-200

            bg-white

            shadow-sm

            "

        >





            <div

                className="

                mx-auto

                flex

                max-w-7xl

                items-center

                justify-center

                gap-2

                overflow-x-auto

                px-6

                "

            >







                {/* MODULE TITLE */}



                <div

                    className="

                    mr-5

                    flex

                    items-center

                    gap-2

                    border-r

                    border-slate-200

                    pr-6

                    "

                >



                    <div

                        className="

                        flex

                        h-9

                        w-9

                        items-center

                        justify-center

                        rounded-xl

                        bg-emerald-50

                        text-lg

                        "

                    >

                        🌱


                    </div>





                    <div

                        className="

                        hidden

                        xl:block

                        "

                    >



                        <p

                            className="

                            text-sm

                            font-bold

                            text-slate-900

                            "

                        >

                            Relief Hub


                        </p>





                        <p

                            className="

                            text-xs

                            text-slate-500

                            "

                        >

                            Community Support


                        </p>



                    </div>


                </div>









                {/* OVERVIEW */}



                <Link

                    href="/rescue"

                    className={

                        navClass(

                            "/rescue"

                        )

                    }

                >


                    🌱 Overview




                    {

                        isActive("/rescue")

                        &&


                        <span

                            className="

                            absolute

                            bottom-0

                            left-3

                            right-3

                            h-0.5

                            rounded-full

                            bg-emerald-600

                            "

                        />


                    }


                </Link>









                {/* MY POSTS */}

                <Link

                    href="/rescue"

                    className={

                        navClass(

                            "/rescue"

                        )

                    }

                >


                    📦 My Posts




                </Link>









                {/* PICKUP REQUESTS */}



                <Link

                    href="/pickup-requests"

                    className={

                        navClass(

                            "/pickup-requests"

                        )

                    }

                >


                    🚚 Pickup Requests





                    {

                        isActive(

                            "/pickup-requests"

                        )

                        &&



                        <span

                            className="

                            absolute

                            bottom-0

                            left-3

                            right-3

                            h-0.5

                            rounded-full

                            bg-emerald-600

                            "

                        />


                    }



                </Link>









                {/* NEARBY RELIEF */}



                <Link

                    href="/nearby-relief"

                    className={

                        navClass(

                            "/nearby-relief"

                        )

                    }

                >


                    📍 Nearby Relief




                    {

                        isActive(

                            "/nearby-relief"

                        )

                        &&


                        <span

                            className="

                            absolute

                            bottom-0

                            left-3

                            right-3

                            h-0.5

                            rounded-full

                            bg-emerald-600

                            "

                        />


                    }


                </Link>









                {/* CREATE BUTTON */}



                <div

                    className="

                    ml-auto

                    "

                >



                    <Link

                        href="/rescue/create"

                        className="

                        rounded-xl

                        bg-emerald-700

                        px-4

                        py-2

                        text-sm

                        font-semibold

                        text-white

                        hover:bg-emerald-800

                        "

                    >

                        + Share Relief


                    </Link>



                </div>








            </div>






        </div>



    );


}