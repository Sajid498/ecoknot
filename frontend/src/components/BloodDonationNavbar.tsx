"use client";

import Link from "next/link";

import {
    usePathname
} from "next/navigation";


export default function BloodDonationNavbar() {

    const pathname =
        usePathname();



    /*
     * Check whether a Blood Donation
     * navigation item is active
     */
    function isActive(
        path: string
    ) {

        if (path === "/blood-donation") {

            return pathname === "/blood-donation";

        }


        return pathname.startsWith(path);

    }



    /*
     * Navigation item style
     */
    function navClass(
        path: string
    ) {

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

            "text-red-600"

            :

            "text-slate-600 hover:text-red-600"
        }

        `;

    }



    return (

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
                gap-1
                overflow-x-auto
                px-6
                "
            >


                {/* MODULE TITLE */}

                <div
                    className="
                    mr-5
                    flex
                    shrink-0
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
                        bg-red-50
                        text-lg
                        "
                    >

                        🩸

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

                            Blood Donation

                        </p>


                        <p
                            className="
                            text-xs
                            text-slate-500
                            "
                        >

                            Donor Network

                        </p>

                    </div>

                </div>



                {/* BLOOD DONATION HOME */}

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

                        <span>
                            🩸
                        </span>

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
                            left-3
                            right-3
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

                        <span>
                            📋
                        </span>

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
                            left-3
                            right-3
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

                        <span>
                            ❤️
                        </span>

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
                            left-3
                            right-3
                            h-0.5
                            rounded-full
                            bg-red-600
                            "
                        />
                    }

                </Link>



                {/* DONATION HISTORY */}

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

                        <span>
                            🕒
                        </span>

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
                            left-3
                            right-3
                            h-0.5
                            rounded-full
                            bg-red-600
                            "
                        />
                    }

                </Link>



                {/* CREATE REQUEST */}

                <div
                    className="
                    ml-auto
                    shrink-0
                    pl-4
                    "
                >

                    <Link

                        href="/blood-donation/create"

                        className="
                        inline-flex
                        items-center
                        gap-2
                        rounded-xl
                        bg-red-600
                        px-4
                        py-2
                        text-sm
                        font-semibold
                        text-white
                        shadow-sm
                        transition
                        hover:bg-red-700
                        "
                    >

                        <span>
                            +
                        </span>

                        Request Blood

                    </Link>

                </div>


            </div>

        </div>

    );

}