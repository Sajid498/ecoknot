"use client";


import Link from "next/link";

import {
    useEffect,
    useRef,
    useState
} from "react";

import {
    usePathname,
    useRouter
} from "next/navigation";


const API_URL =
    process.env.NEXT_PUBLIC_API_URL
    ||
    "http://localhost:8080";


export default function Navbar() {


    const router =
        useRouter();


    const pathname =
        usePathname();


    const profileMenuRef =
        useRef<HTMLDivElement | null>(null);


    const [user,setUser] =
        useState<any>(null);


    const [unreadCount,setUnreadCount] =
        useState(0);


    const [showProfileMenu,setShowProfileMenu] =
        useState(false);


    const [showMobileMenu,setShowMobileMenu] =
        useState(false);





    /*
        Load authenticated user
        and notification count
    */

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


            setUser(
                null
            );


            return;


        }


        try{


            const userData =
                JSON.parse(
                    savedUser
                );


            if(
                !userData?.id
                ||
                !userData?.email
            ){


                clearSession();


                setUser(
                    null
                );


                return;


            }


            setUser(
                userData
            );


            loadUnreadCount(
                userData.id
            );


            const interval =
                setInterval(()=>{


                    loadUnreadCount(
                        userData.id
                    );


                },10000);


            const refreshHandler = ()=>{


                loadUnreadCount(
                    userData.id
                );


            };


            window.addEventListener(
                "notificationUpdate",
                refreshHandler
            );


            return ()=>{


                clearInterval(
                    interval
                );


                window.removeEventListener(
                    "notificationUpdate",
                    refreshHandler
                );


            };


        }
        catch(error){


            console.log(
                "Failed to load user:",
                error
            );


            clearSession();


            setUser(
                null
            );


        }


    },[]);





    /*
        Close menus after route changes
    */

    useEffect(()=>{


        setShowProfileMenu(
            false
        );


        setShowMobileMenu(
            false
        );


    },[pathname]);





    /*
        Close desktop profile dropdown
        when clicking outside
    */

    useEffect(()=>{


        function handleOutsideClick(
            event:MouseEvent
        ){


            if(
                profileMenuRef.current
                &&
                !profileMenuRef.current.contains(
                    event.target as Node
                )
            ){


                setShowProfileMenu(
                    false
                );


            }


        }


        document.addEventListener(
            "mousedown",
            handleOutsideClick
        );


        return ()=>{


            document.removeEventListener(
                "mousedown",
                handleOutsideClick
            );


        };


    },[]);





    async function loadUnreadCount(
        userId:number
    ){


        try{


            const response =
                await fetch(

                    `${API_URL}/api/notifications/unread-count/${userId}`

                );


            if(!response.ok){


                return;


            }


            const data =
                await response.json();


            setUnreadCount(

                Number(
                    data.count
                )
                ||
                0

            );


        }
        catch(error){


            console.log(
                "Notification count error:",
                error
            );


        }


    }





    function handleLogout(){


        clearSession();


        setUser(
            null
        );


        setUnreadCount(
            0
        );


        setShowProfileMenu(
            false
        );


        setShowMobileMenu(
            false
        );


        router.push(
            "/login"
        );


    }





    function closeMenus(){


        setShowProfileMenu(
            false
        );


        setShowMobileMenu(
            false
        );


    }





    function isActive(
        path:string
    ){


        if(path === "/"){


            return pathname === "/";


        }


        return pathname.startsWith(
            path
        );


    }





    function navClass(
        path:string
    ){


        return `
        whitespace-nowrap
        rounded-lg
        px-3
        py-2
        text-sm
        font-medium
        transition

        ${
            isActive(path)

                ?

                "bg-emerald-50 text-emerald-700"

                :

                "text-slate-600 hover:bg-slate-50 hover:text-emerald-700"
        }
        `;


    }





    function mobileNavClass(
        path:string
    ){


        return `
        flex
        w-full
        items-center
        rounded-xl
        px-4
        py-3
        text-sm
        font-semibold
        transition

        ${
            isActive(path)

                ?

                "bg-emerald-50 text-emerald-700"

                :

                "text-slate-700 hover:bg-slate-50 hover:text-emerald-700"
        }
        `;


    }





    if(!user){


        return null;


    }





    return(


        <header

            className="
            sticky
            top-0
            z-50
            border-b
            border-slate-200
            bg-white/95
            shadow-sm
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
                gap-4
                px-4
                py-3
                sm:px-6
                "

            >





                {/* LOGO */}

                <Link

                    href="/"

                    onClick={closeMenus}

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
                            hidden
                            text-xs
                            text-slate-500
                            sm:block
                            "

                        >

                            Community Connected

                        </p>


                    </div>


                </Link>








                {/* DESKTOP NAVIGATION */}

                <nav

                    className="
                    hidden
                    flex-1
                    items-center
                    justify-center
                    gap-1
                    lg:flex
                    "

                    aria-label="Main navigation"

                >


                    <Link

                        href="/"

                        onClick={closeMenus}

                        className={
                            navClass("/")
                        }

                    >

                        Home

                    </Link>





                    <Link

                        href="/blood-donation"

                        onClick={closeMenus}

                        className={
                            navClass(
                                "/blood-donation"
                            )
                        }

                    >

                        🩸 Blood Donation

                    </Link>





                    <Link

                        href="/resources"

                        onClick={closeMenus}

                        className={
                            navClass(
                                "/resources"
                            )
                        }

                    >

                        🌎 Resources

                    </Link>





                    <Link

                        href="/fundraising"

                        onClick={closeMenus}

                        className={
                            navClass(
                                "/fundraising"
                            )
                        }

                    >

                        🤝 Campaigns

                    </Link>





                    <Link

                        href="/dashboard"

                        onClick={closeMenus}

                        className={
                            navClass(
                                "/dashboard"
                            )
                        }

                    >

                        📊 Dashboard

                    </Link>





                    <Link

                        href="/time-bank"

                        onClick={closeMenus}

                        className={
                            navClass(
                                "/time-bank"
                            )
                        }

                    >

                        ⏳ Time Bank

                    </Link>





                    <Link

                        href="/rescue"

                        onClick={closeMenus}

                        className={
                            navClass(
                                "/rescue"
                            )
                        }

                    >

                        🌱 Relief Hub

                    </Link>





                    {/* Profile is last */}

                  


                </nav>








                {/* RIGHT SIDE */}

                <div

                    className="
                    flex
                    shrink-0
                    items-center
                    gap-2
                    "

                >





                    {/* NOTIFICATIONS */}

                    <Link

                        href="/notifications"

                        onClick={closeMenus}

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

                        aria-label={
                            unreadCount > 0

                                ?

                                `${unreadCount} unread notifications`

                                :

                                "Notifications"
                        }

                    >

                        🔔





                        {

                            unreadCount > 0

                            &&

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

                                {

                                    unreadCount > 9

                                        ?

                                        "9+"

                                        :

                                        unreadCount

                                }

                            </span>

                        }


                    </Link>








                    {/* DESKTOP PROFILE MENU */}

                    <div

                        ref={profileMenuRef}

                        className="
                        relative
                        hidden
                        lg:block
                        "

                    >


                        <button

                            type="button"

                            onClick={()=>{


                                setShowProfileMenu(

                                    previous =>
                                        !previous

                                );


                            }}

                            className="
                            flex
                            items-center
                            gap-2
                            rounded-xl
                            px-2
                            py-2
                            transition
                            hover:bg-slate-100
                            "

                            aria-label="Open account menu"

                            aria-expanded={
                                showProfileMenu
                            }

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

                                    ||

                                    "U"

                                }

                            </div>





                            <span

                                className="
                                max-w-28
                                truncate
                                text-sm
                                font-semibold
                                text-slate-700
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

                                        ?

                                        "rotate-180"

                                        :

                                        ""
                                }
                                `}

                            >

                                ▼

                            </span>


                        </button>








                        {

                            showProfileMenu

                            &&

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





                                <div

                                    className="
                                    border-b
                                    border-slate-100
                                    px-4
                                    py-3
                                    "

                                >


                                    <p

                                        className="
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





                                <Link

                                    href="/saved-resources"

                                    onClick={closeMenus}

                                    className="
                                    block
                                    rounded-xl
                                    px-4
                                    py-3
                                    text-sm
                                    font-medium
                                    text-slate-700
                                    hover:bg-emerald-50
                                    hover:text-emerald-700
                                    "

                                >

                                    ⭐ Saved Resources

                                </Link>





                                <div

                                    className="
                                    my-2
                                    border-t
                                    border-slate-100
                                    "

                                />





                                <button

                                    type="button"

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
                                    hover:bg-red-50
                                    "

                                >

                                    🚪 Logout

                                </button>


                            </div>

                        }


                    </div>








                    {/* MOBILE MENU BUTTON */}

                    <button

                        type="button"

                        onClick={()=>{


                            setShowMobileMenu(

                                previous =>
                                    !previous

                            );


                            setShowProfileMenu(
                                false
                            );


                        }}

                        className="
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-xl
                        border
                        border-slate-200
                        text-slate-700
                        transition
                        hover:bg-slate-50
                        lg:hidden
                        "

                        aria-label={
                            showMobileMenu

                                ?

                                "Close navigation menu"

                                :

                                "Open navigation menu"
                        }

                        aria-expanded={
                            showMobileMenu
                        }

                    >


                        {

                            showMobileMenu

                                ?

                                <span className="text-xl">
                                    ✕
                                </span>

                                :

                                <span className="text-xl">
                                    ☰
                                </span>

                        }


                    </button>


                </div>


            </div>








            {/* MOBILE NAVIGATION */}

            {

                showMobileMenu

                &&

                <div

                    className="
                    border-t
                    border-slate-200
                    bg-white
                    lg:hidden
                    "

                >


                    <nav

                        className="
                        mx-auto
                        max-w-7xl
                        space-y-1
                        px-4
                        py-4
                        sm:px-6
                        "

                        aria-label="Mobile navigation"

                    >





                        <Link

                            href="/"

                            onClick={closeMenus}

                            className={
                                mobileNavClass("/")
                            }

                        >

                            🏠 Home

                        </Link>





                        <Link

                            href="/blood-donation"

                            onClick={closeMenus}

                            className={
                                mobileNavClass(
                                    "/blood-donation"
                                )
                            }

                        >

                            🩸 Blood Donation

                        </Link>





                        <Link

                            href="/resources"

                            onClick={closeMenus}

                            className={
                                mobileNavClass(
                                    "/resources"
                                )
                            }

                        >

                            🌎 Resources

                        </Link>





                        <Link

                            href="/fundraising"

                            onClick={closeMenus}

                            className={
                                mobileNavClass(
                                    "/fundraising"
                                )
                            }

                        >

                            🤝 Campaigns

                        </Link>





                        <Link

                            href="/dashboard"

                            onClick={closeMenus}

                            className={
                                mobileNavClass(
                                    "/dashboard"
                                )
                            }

                        >

                            📊 Dashboard

                        </Link>





                        <Link

                            href="/time-bank"

                            onClick={closeMenus}

                            className={
                                mobileNavClass(
                                    "/time-bank"
                                )
                            }

                        >

                            ⏳ Time Bank

                        </Link>





                        <Link

                            href="/rescue"

                            onClick={closeMenus}

                            className={
                                mobileNavClass(
                                    "/rescue"
                                )
                            }

                        >

                            🌱 Relief Hub

                        </Link>





                        
                    





                        <div

                            className="
                            my-3
                            border-t
                            border-slate-200
                            "

                        />





                        <div

                            className="
                            px-4
                            py-2
                            "

                        >


                            <p

                                className="
                                text-sm
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





                        <Link

                            href="/saved-resources"

                            onClick={closeMenus}

                            className="
                            flex
                            w-full
                            items-center
                            rounded-xl
                            px-4
                            py-3
                            text-sm
                            font-semibold
                            text-slate-700
                            transition
                            hover:bg-slate-50
                            hover:text-emerald-700
                            "

                        >

                            ⭐ Saved Resources

                        </Link>





                        <button

                            type="button"

                            onClick={handleLogout}

                            className="
                            flex
                            w-full
                            items-center
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


                    </nav>


                </div>

            }


        </header>


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