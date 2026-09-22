"use client";

import Link from "next/link";

import {
    usePathname
} from "next/navigation";



export default function BloodDonationNavbar() {


    const pathname =
        usePathname();





    function isActive(
        path:string
    ){


        if(path === "/blood-donation"){


            return (

                pathname.startsWith(
                    "/blood-donation"
                )

                ||

                pathname.startsWith(
                    "/donors"
                )

            );


        }



        return pathname.startsWith(path);


    }






    function navClass(
        path:string
    ){


        return `

        relative
        whitespace-nowrap
        px-5
        py-4
        text-sm
        font-semibold
        transition

        ${
            isActive(path)

            ?

            "text-red-600"

            :

            "text-slate-600 hover:text-red-600"

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







                {/* OVERVIEW */}


                <Link

                    href="/blood-donation"

                    className={
                        navClass(
                            "/blood-donation"
                        )
                    }

                >


                    <span
                        className="
                        flex
                        items-center
                        gap-2
                        "
                    >

                        🩸

                        Overview


                    </span>





                    {
                        isActive(
                            "/blood-donation"
                        )

                        &&


                        <span

                            className="
                            absolute
                            bottom-0
                            left-5
                            right-5
                            h-0.5
                            rounded-full
                            bg-red-600
                            "

                        />

                    }



                </Link>









                {/* MY REQUESTS */}



                <Link

                    href="/my-requests"

                    className={
                        navClass(
                            "/my-requests"
                        )
                    }

                >


                    <span

                        className="
                        flex
                        items-center
                        gap-2
                        "

                    >

                        📋

                        My Requests


                    </span>






                    {
                        isActive(
                            "/my-requests"
                        )

                        &&


                        <span

                            className="
                            absolute
                            bottom-0
                            left-5
                            right-5
                            h-0.5
                            rounded-full
                            bg-red-600
                            "

                        />

                    }



                </Link>









                {/* MY DONATIONS */}



                <Link

                    href="/my-donations"

                    className={
                        navClass(
                            "/my-donations"
                        )
                    }

                >



                    <span

                        className="
                        flex
                        items-center
                        gap-2
                        "

                    >

                        ❤️

                        My Donations


                    </span>






                    {
                        isActive(
                            "/my-donations"
                        )

                        &&


                        <span

                            className="
                            absolute
                            bottom-0
                            left-5
                            right-5
                            h-0.5
                            rounded-full
                            bg-red-600
                            "

                        />

                    }



                </Link>









                {/* HISTORY */}



                <Link

                    href="/donation-history"

                    className={
                        navClass(
                            "/donation-history"
                        )
                    }

                >



                    <span

                        className="
                        flex
                        items-center
                        gap-2
                        "

                    >

                        🕒

                        Donation History


                    </span>






                    {
                        isActive(
                            "/donation-history"
                        )

                        &&


                        <span

                            className="
                            absolute
                            bottom-0
                            left-5
                            right-5
                            h-0.5
                            rounded-full
                            bg-red-600
                            "

                        />

                    }



                </Link>






            </div>





        </div>



    );


}