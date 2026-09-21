"use client";

import Link from "next/link";

import {
    useEffect,
    useState
} from "react";

import {
    usePathname,
    useRouter
} from "next/navigation";


const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:8080";


export default function Navbar() {

    const router = useRouter();

    const pathname = usePathname();


    const [user, setUser] =
        useState<any>(null);


    const [unreadCount, setUnreadCount] =
        useState(0);


    const [showProfileMenu, setShowProfileMenu] =
        useState(false);



    useEffect(() => {

        const savedUser =
            localStorage.getItem("user");


        if (!savedUser) {

            return;

        }


        const userData =
            JSON.parse(savedUser);


        setUser(userData);


        loadUnreadCount(
            userData.id
        );


        const interval =
            setInterval(() => {

                loadUnreadCount(
                    userData.id
                );

            }, 10000);


        const refreshHandler = () => {

            loadUnreadCount(
                userData.id
            );

        };


        window.addEventListener(
            "notificationUpdate",
            refreshHandler
        );


        return () => {

            clearInterval(interval);


            window.removeEventListener(
                "notificationUpdate",
                refreshHandler
            );

        };

    }, []);



    async function loadUnreadCount(
        userId: number
    ) {

        try {

            const response =
                await fetch(
                    `${API_URL}/api/notifications/unread-count/${userId}`
                );


            if (!response.ok) {

                return;

            }


            const data =
                await response.json();


            setUnreadCount(
                data.count
            );

        }

        catch (error) {

            console.log(error);

        }

    }



    /*
        Blood Donation module routes.

        If the user is inside any of these routes,
        only Blood Donation navigation will appear.
    */

    const isBloodSection =

        pathname.startsWith(
            "/blood-donation"
        )

        ||

        pathname.startsWith(
            "/my-requests"
        )

        ||

        pathname.startsWith(
            "/my-donations"
        )

        ||

        pathname.startsWith(
            "/donation-history"
        );



    function handleLogout() {

        localStorage.removeItem(
            "user"
        );


        localStorage.removeItem(
            "activeModule"
        );


        setUser(null);

        setUnreadCount(0);

        setShowProfileMenu(false);


        router.push(
            "/login"
        );

    }



    function handleHome() {

        setShowProfileMenu(false);


        localStorage.removeItem(
            "activeModule"
        );


        router.push(
            "/"
        );

    }



    function closeProfileMenu() {

        setShowProfileMenu(false);

    }



    return (

        <header
            className="
            sticky
            top-0
            z-50
            border-b
            border-slate-200
            bg-white/90
            backdrop-blur-md
            "
        >

            <div
                className="
                mx-auto
                flex
                max-w-7xl
                items-center
                justify-between
                gap-6
                px-6
                py-3
                "
            >


                {/* LOGO */}

                <Link

                    href="/"

                    onClick={handleHome}

                    className="
                    flex
                    shrink-0
                    items-center
                    gap-3
                    "
                >

                    <div
                        className="
                        flex
                        h-11
                        w-11
                        items-center
                        justify-center
                        rounded-2xl
                        bg-emerald-700
                        text-xl
                        font-bold
                        text-white
                        shadow-sm
                        "
                    >

                        E

                    </div>


                    <div>

                        <h1
                            className="
                            text-xl
                            font-bold
                            leading-tight
                            text-slate-900
                            "
                        >

                            EcoKnot

                        </h1>


                        <p
                            className="
                            text-xs
                            text-slate-500
                            "
                        >

                            Community Connected

                        </p>

                    </div>

                </Link>



                {/* NAVIGATION */}

                <nav
                    className="
                    hidden
                    flex-1
                    items-center
                    justify-center
                    gap-6
                    lg:flex
                    "
                >


                    {isBloodSection ? (

                        <>

                            {/* HOME */}

                            <button

                                onClick={handleHome}

                                className="
                                whitespace-nowrap
                                text-sm
                                font-semibold
                                text-slate-600
                                transition
                                hover:text-emerald-700
                                "
                            >

                                ← Home

                            </button>



                            {/* BLOOD DONATION */}

                            <Link

                                href="/blood-donation"

                                className={`
                                whitespace-nowrap
                                rounded-lg
                                px-2
                                py-2
                                text-sm
                                font-semibold
                                transition

                                ${
                                    pathname === "/blood-donation"

                                    ?

                                    "bg-emerald-50 text-emerald-700"

                                    :

                                    "text-slate-600 hover:text-emerald-700"
                                }
                                `}
                            >

                                🩸 Blood Donation

                            </Link>



                            {/* MY REQUESTS */}

                            <Link

                                href="/my-requests"

                                className={`
                                whitespace-nowrap
                                rounded-lg
                                px-2
                                py-2
                                text-sm
                                font-medium
                                transition

                                ${
                                    pathname.startsWith(
                                        "/my-requests"
                                    )

                                    ?

                                    "bg-emerald-50 text-emerald-700"

                                    :

                                    "text-slate-600 hover:text-emerald-700"
                                }
                                `}
                            >

                                📋 My Requests

                            </Link>



                            {/* MY DONATIONS */}

                            <Link

                                href="/my-donations"

                                className={`
                                whitespace-nowrap
                                rounded-lg
                                px-2
                                py-2
                                text-sm
                                font-medium
                                transition

                                ${
                                    pathname.startsWith(
                                        "/my-donations"
                                    )

                                    ?

                                    "bg-emerald-50 text-emerald-700"

                                    :

                                    "text-slate-600 hover:text-emerald-700"
                                }
                                `}
                            >

                                ❤️ My Donations

                            </Link>



                            {/* DONATION HISTORY */}

                            <Link

                                href="/donation-history"

                                className={`
                                whitespace-nowrap
                                rounded-lg
                                px-2
                                py-2
                                text-sm
                                font-medium
                                transition

                                ${
                                    pathname.startsWith(
                                        "/donation-history"
                                    )

                                    ?

                                    "bg-emerald-50 text-emerald-700"

                                    :

                                    "text-slate-600 hover:text-emerald-700"
                                }
                                `}
                            >

                                🩸 Donation History

                            </Link>

                        </>

                    ) : (

                        <>

                            {/* HOME */}

                            <Link

                                href="/"

                                className={`
                                whitespace-nowrap
                                rounded-lg
                                px-2
                                py-2
                                text-sm
                                font-semibold
                                transition

                                ${
                                    pathname === "/"

                                    ?

                                    "bg-emerald-50 text-emerald-700"

                                    :

                                    "text-slate-600 hover:text-emerald-700"
                                }
                                `}
                            >

                                Home

                            </Link>



                            {/* BLOOD DONATION */}

                            <Link

                                href="/blood-donation"

                                className="
                                whitespace-nowrap
                                rounded-lg
                                px-2
                                py-2
                                text-sm
                                font-medium
                                text-slate-600
                                transition
                                hover:text-emerald-700
                                "
                            >

                                🩸 Blood Donation

                            </Link>



                            {/* RESOURCES */}

                            <Link

                                href="/resources"

                                className={`
                                whitespace-nowrap
                                rounded-lg
                                px-2
                                py-2
                                text-sm
                                font-medium
                                transition

                                ${
                                    pathname.startsWith(
                                        "/resources"
                                    )

                                    ?

                                    "bg-emerald-50 text-emerald-700"

                                    :

                                    "text-slate-600 hover:text-emerald-700"
                                }
                                `}
                            >

                                🌎 Resources

                            </Link>



                            {/* DASHBOARD */}

                            <Link

                                href="/dashboard"

                                className={`
                                whitespace-nowrap
                                rounded-lg
                                px-2
                                py-2
                                text-sm
                                font-medium
                                transition

                                ${
                                    pathname.startsWith(
                                        "/dashboard"
                                    )

                                    ?

                                    "bg-emerald-50 text-emerald-700"

                                    :

                                    "text-slate-600 hover:text-emerald-700"
                                }
                                `}
                            >

                                📊 Dashboard

                            </Link>



                            {/* RELIEF HUB */}

                            <Link

                                href="/rescue"

                                className={`
                                whitespace-nowrap
                                rounded-lg
                                px-2
                                py-2
                                text-sm
                                font-medium
                                transition

                                ${
                                    pathname.startsWith(
                                        "/rescue"
                                    )

                                    ?

                                    "bg-emerald-50 text-emerald-700"

                                    :

                                    "text-slate-600 hover:text-emerald-700"
                                }
                                `}
                            >

                                🌱 Relief Hub

                            </Link>

                        </>

                    )}

                </nav>



                {/* RIGHT SIDE */}

                <div
                    className="
                    flex
                    shrink-0
                    items-center
                    gap-3
                    "
                >

                    {user ? (

                        <>


                            {/* NOTIFICATION */}

                            <Link

                                href="/notifications"

                                onClick={closeProfileMenu}

                                className="
                                relative
                                flex
                                h-10
                                w-10
                                items-center
                                justify-center
                                rounded-xl
                                text-xl
                                transition
                                hover:bg-emerald-50
                                "
                                title="Notifications"
                            >

                                <span
                                    className={
                                        unreadCount > 0
                                            ? "animate-pulse"
                                            : ""
                                    }
                                >

                                    🔔

                                </span>


                                {unreadCount > 0 && (

                                    <span
                                        className="
                                        absolute
                                        -right-1
                                        -top-1
                                        flex
                                        h-5
                                        min-w-5
                                        items-center
                                        justify-center
                                        rounded-full
                                        bg-red-600
                                        px-1
                                        text-xs
                                        font-bold
                                        text-white
                                        "
                                    >

                                        {unreadCount > 9
                                            ? "9+"
                                            : unreadCount}

                                    </span>

                                )}

                            </Link>



                            {/* PROFILE DROPDOWN */}

                            <div
                                className="
                                relative
                                "
                            >

                                <button

                                    onClick={() =>
                                        setShowProfileMenu(
                                            !showProfileMenu
                                        )
                                    }

                                    className="
                                    flex
                                    items-center
                                    gap-2
                                    rounded-xl
                                    px-3
                                    py-2
                                    transition
                                    hover:bg-slate-100
                                    "
                                >

                                    <div
                                        className="
                                        flex
                                        h-9
                                        w-9
                                        items-center
                                        justify-center
                                        rounded-full
                                        bg-emerald-100
                                        font-bold
                                        text-emerald-700
                                        "
                                    >

                                        {
                                            user?.name
                                                ?.charAt(0)
                                                ?.toUpperCase()
                                                || "U"
                                        }

                                    </div>


                                    <span
                                        className="
                                        hidden
                                        max-w-28
                                        truncate
                                        text-sm
                                        font-semibold
                                        text-slate-700
                                        sm:block
                                        "
                                    >

                                        {user.name}

                                    </span>


                                    <span
                                        className={`
                                        text-xs
                                        text-slate-500
                                        transition-transform

                                        ${
                                            showProfileMenu
                                                ? "rotate-180"
                                                : ""
                                        }
                                        `}
                                    >

                                        ▼

                                    </span>

                                </button>



                                {showProfileMenu && (

                                    <div
                                        className="
                                        absolute
                                        right-0
                                        z-50
                                        mt-3
                                        w-64
                                        overflow-hidden
                                        rounded-2xl
                                        border
                                        border-slate-200
                                        bg-white
                                        p-2
                                        shadow-xl
                                        "
                                    >


                                        {/* USER INFO */}

                                        <div
                                            className="
                                            border-b
                                            border-slate-100
                                            px-4
                                            py-3
                                            "
                                        >

                                            <div
                                                className="
                                                flex
                                                items-center
                                                gap-3
                                                "
                                            >

                                                <div
                                                    className="
                                                    flex
                                                    h-10
                                                    w-10
                                                    items-center
                                                    justify-center
                                                    rounded-full
                                                    bg-emerald-100
                                                    font-bold
                                                    text-emerald-700
                                                    "
                                                >

                                                    {
                                                        user?.name
                                                            ?.charAt(0)
                                                            ?.toUpperCase()
                                                            || "U"
                                                    }

                                                </div>


                                                <div
                                                    className="
                                                    min-w-0
                                                    "
                                                >

                                                    <p
                                                        className="
                                                        truncate
                                                        font-bold
                                                        text-slate-900
                                                        "
                                                    >

                                                        {user.name}

                                                    </p>


                                                    <p
                                                        className="
                                                        text-xs
                                                        text-slate-500
                                                        "
                                                    >

                                                        EcoKnot Member

                                                    </p>

                                                </div>

                                            </div>

                                        </div>



                                        {/* DASHBOARD */}

                                        <Link

                                            href="/dashboard"

                                            onClick={closeProfileMenu}

                                            className="
                                            mt-2
                                            block
                                            rounded-xl
                                            px-4
                                            py-3
                                            text-sm
                                            font-medium
                                            text-slate-700
                                            transition
                                            hover:bg-emerald-50
                                            hover:text-emerald-700
                                            "
                                        >

                                            📊 Dashboard

                                        </Link>



                                        {/* PROFILE */}

                                        <Link

                                            href="/profile"

                                            onClick={closeProfileMenu}

                                            className="
                                            block
                                            rounded-xl
                                            px-4
                                            py-3
                                            text-sm
                                            font-medium
                                            text-slate-700
                                            transition
                                            hover:bg-emerald-50
                                            hover:text-emerald-700
                                            "
                                        >

                                            👤 Profile

                                        </Link>



                                        {/* SAVED RESOURCES */}

                                        <Link

                                            href="/saved-resources"

                                            onClick={closeProfileMenu}

                                            className="
                                            block
                                            rounded-xl
                                            px-4
                                            py-3
                                            text-sm
                                            font-medium
                                            text-slate-700
                                            transition
                                            hover:bg-emerald-50
                                            hover:text-emerald-700
                                            "
                                        >

                                            ⭐ Saved Resources

                                        </Link>



                                        {/* CAMPAIGNS */}

                                        <Link

                                            href="/fundraising"

                                            onClick={closeProfileMenu}

                                            className="
                                            block
                                            rounded-xl
                                            px-4
                                            py-3
                                            text-sm
                                            font-medium
                                            text-slate-700
                                            transition
                                            hover:bg-emerald-50
                                            hover:text-emerald-700
                                            "
                                        >

                                            📢 Campaigns

                                        </Link>



                                        {/* ACADEMIC HUB */}

                                        <Link

                                            href="#"

                                            onClick={closeProfileMenu}

                                            className="
                                            block
                                            rounded-xl
                                            px-4
                                            py-3
                                            text-sm
                                            font-medium
                                            text-slate-700
                                            transition
                                            hover:bg-emerald-50
                                            hover:text-emerald-700
                                            "
                                        >

                                            🎓 Academic Hub

                                        </Link>



                                        {/* NOTIFICATIONS */}

                                        <Link

                                            href="/notifications"

                                            onClick={closeProfileMenu}

                                            className="
                                            flex
                                            items-center
                                            justify-between
                                            rounded-xl
                                            px-4
                                            py-3
                                            text-sm
                                            font-medium
                                            text-slate-700
                                            transition
                                            hover:bg-emerald-50
                                            hover:text-emerald-700
                                            "
                                        >

                                            <span>
                                                🔔 Notifications
                                            </span>


                                            {unreadCount > 0 && (

                                                <span
                                                    className="
                                                    rounded-full
                                                    bg-red-100
                                                    px-2
                                                    py-0.5
                                                    text-xs
                                                    font-bold
                                                    text-red-600
                                                    "
                                                >

                                                    {unreadCount}

                                                </span>

                                            )}

                                        </Link>



                                        <div
                                            className="
                                            my-2
                                            border-t
                                            border-slate-100
                                            "
                                        />



                                        {/* LOGOUT */}

                                        <button

                                            onClick={handleLogout}

                                            className="
                                            w-full
                                            rounded-xl
                                            px-4
                                            py-3
                                            text-left
                                            text-sm
                                            font-semibold
                                            text-red-600
                                            transition
                                            hover:bg-red-50
                                            "
                                        >

                                            🚪 Logout

                                        </button>

                                    </div>

                                )}

                            </div>

                        </>

                    ) : (

                        <>

                            <Link

                                href="/login"

                                className="
                                hidden
                                rounded-xl
                                px-4
                                py-2
                                text-sm
                                font-semibold
                                text-slate-700
                                transition
                                hover:bg-slate-100
                                sm:block
                                "
                            >

                                Log In

                            </Link>


                            <Link

                                href="/signup"

                                className="
                                rounded-xl
                                bg-emerald-700
                                px-6
                                py-2.5
                                text-sm
                                font-semibold
                                text-white
                                shadow-sm
                                transition
                                hover:bg-emerald-800
                                "
                            >

                                Sign Up

                            </Link>

                        </>

                    )}

                </div>

            </div>

        </header>

    );

}