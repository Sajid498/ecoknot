"use client";

import Link from "next/link";

import {
    usePathname,
    useSearchParams
} from "next/navigation";

import {
    Leaf,
    LayoutDashboard,
    Package,
    Truck,
    MapPin
} from "lucide-react";



interface ReliefMenuItem {

    name: string;

    path: string;

    icon: any;

}



export default function ReliefNavbar() {


    const pathname = usePathname();

    const searchParams = useSearchParams();


    const nearbyMode =
        searchParams.get("nearby") === "true";



    const menuItems: ReliefMenuItem[] = [

        {
            name: "Overview",
            path: "/rescue",
            icon: Leaf
        },

        {
            name: "Dashboard",
            path: "/rescue/dashboard",
            icon: LayoutDashboard
        },

        {
            name: "My Posts",
            path: "/rescue/my-posts",
            icon: Package
        },

        {
            name: "Pickup Requests",
            path: "/pickup-requests",
            icon: Truck
        },

        {
            name: "Nearby Relief",
            path: "/rescue?nearby=true",
            icon: MapPin
        }

    ];




    function isActive(path: string) {


        if (path === "/rescue") {

            return (
                pathname === "/rescue"
                &&
                !nearbyMode
            );

        }



        if (path === "/rescue?nearby=true") {

            return (
                pathname === "/rescue"
                &&
                nearbyMode
            );

        }



        return pathname.startsWith(path);

    }




    return (

        <div

            className="
    relative
    z-20
    bg-white
    border-b
    border-slate-200
    shadow-sm
"

        >


            <div

                className="
                    max-w-7xl
                    mx-auto
                    px-6
                    h-16
                    flex
                    items-center
                    gap-5
                    overflow-x-auto
                "

            >



                {/* MODULE TITLE */}

                <div

                    className="
                        hidden
                        md:flex
                        items-center
                        gap-3
                        pr-6
                        border-r
                        border-slate-200
                        shrink-0
                    "

                >

                    <div

                        className="
                            w-10
                            h-10
                            rounded-xl
                            bg-emerald-50
                            flex
                            items-center
                            justify-center
                            text-emerald-700
                        "

                    >

                        <Leaf size={22}/>

                    </div>



                    <div>

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





                {/* MENU ITEMS */}


                <div

                    className="
                        flex
                        items-center
                        gap-2
                        shrink-0
                    "

                >


                    {
                        menuItems.map(
                            (item) => {


                                const Icon =
                                    item.icon;


                                return (

                                    <Link

                                        key={
                                            item.path
                                        }

                                        href={
                                            item.path
                                        }


                                        className={`
                                            flex
                                            items-center
                                            gap-2
                                            px-4
                                            h-10
                                            rounded-xl
                                            text-sm
                                            font-medium
                                            transition

                                            ${
                                                isActive(item.path)

                                                ?

                                                `
                                                bg-emerald-50
                                                text-emerald-700
                                                `

                                                :

                                                `
                                                text-slate-600
                                                hover:bg-slate-50
                                                hover:text-emerald-700
                                                `
                                            }

                                        `}

                                    >


                                        <Icon size={17}/>


                                        <span>

                                            {
                                                item.name
                                            }

                                        </span>


                                    </Link>

                                );


                            }
                        )
                    }


                </div>



            </div>


        </div>

    );


}