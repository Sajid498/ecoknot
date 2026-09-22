"use client";


import Link from "next/link";


import {
    usePathname
} from "next/navigation";








export default function FundraisingNavbar(){



    const pathname =

        usePathname();








    function isActive(

        path:string

    ){


        if(path === "/fundraising"){


            return pathname === "/fundraising";


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

                gap-3

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

                        🤝


                    </div>




                    <div className="hidden xl:block">


                        <p

                            className="

                            text-sm

                            font-bold

                            text-slate-900

                            "

                        >

                            Fundraising


                        </p>



                        <p

                            className="

                            text-xs

                            text-slate-500

                            "

                        >

                            Community Campaigns


                        </p>


                    </div>



                </div>









                <Link

                    href="/fundraising"

                    className={

                        navClass(

                            "/fundraising"

                        )

                    }

                >


                    🤝 Overview



                    {

                        isActive("/fundraising")

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









                <Link

                    href="/fundraising/create"

                    className={

                        navClass(

                            "/fundraising/create"

                        )

                    }

                >


                    ➕ Create Campaign



                    {

                        isActive("/fundraising/create")

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









                <Link

                    href="/fundraising/my-campaigns"

                    className={

                        navClass(

                            "/fundraising/my-campaigns"

                        )

                    }

                >


                    📋 My Campaigns



                    {

                        isActive("/fundraising/my-campaigns")

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







            </div>




        </div>



    );


}
