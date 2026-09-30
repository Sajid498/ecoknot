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


import {
    Bell,
    ChevronDown,
    Clock,
    Globe,
    HandHeart,
    HeartPulse,
    LayoutDashboard,
    Leaf,
    LogOut,
    Menu,
    UserCircle,
    X,
    Bookmark
} from "lucide-react";



const API_URL =
    process.env.NEXT_PUBLIC_API_URL
    ||
    "http://localhost:8080";





interface MenuItem {

    name:string;

    path:string;

    icon:any;

}





const communityItems:MenuItem[] = [

    {
        name:"Blood Donation",
        path:"/blood-donation",
        icon:HeartPulse
    },


    {
        name:"Relief Hub",
        path:"/rescue",
        icon:Leaf
    },


    {
        name:"Resources",
        path:"/resources",
        icon:Globe
    }

];





const supportItems:MenuItem[] = [

    {
        name:"Fundraising",
        path:"/fundraising",
        icon:HandHeart
    },


    {
        name:"Time Bank",
        path:"/time-bank",
        icon:Clock
    }

];







export default function Navbar(){


    const router =
        useRouter();


    const pathname =
        usePathname();



    const profileMenuRef =
        useRef<HTMLDivElement|null>(
            null
        );



    const [user,setUser] =
        useState<any>(
            null
        );



    const [unreadCount,setUnreadCount] =
        useState(
            0
        );



    const [communityOpen,setCommunityOpen] =
        useState(
            false
        );



    const [supportOpen,setSupportOpen] =
        useState(
            false
        );



    const [profileOpen,setProfileOpen] =
        useState(
            false
        );



    const [mobileOpen,setMobileOpen] =
        useState(
            false
        );





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



            return ()=>{

                clearInterval(
                    interval
                );

            };


        }
        catch(error){


            clearSession();

            setUser(
                null
            );

        }



    },[]);







    useEffect(()=>{


        setCommunityOpen(
            false
        );


        setSupportOpen(
            false
        );


        setProfileOpen(
            false
        );


        setMobileOpen(
            false
        );


    },[pathname]);







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

                setProfileOpen(
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


            if(
                !response.ok
            ){

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
                "Notification error",
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


        router.push(
            "/login"
        );


    }







    function isActive(
        path:string
    ){


        if(
            path === "/"
        ){

            return pathname === "/";

        }


        return pathname.startsWith(
            path
        );

    }
        function clearSession(){

        localStorage.removeItem(
            "user"
        );

        localStorage.removeItem(
            "token"
        );

    }





    function renderDropdownItems(
        items:MenuItem[]
    ){

        return (

            <div
                className="
                    absolute
                    top-12
                    left-0
                    w-64
                    bg-white
                    border
                    border-slate-200
                    rounded-2xl
                    shadow-xl
                    p-2
                    z-50
                "
            >

                {
                    items.map(
                        (item)=>{

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
                                        gap-3
                                        px-4
                                        py-3
                                        rounded-xl
                                        transition

                                        ${
                                            isActive(item.path)
                                            ?
                                            "bg-green-50 text-green-700"
                                            :
                                            "text-slate-700 hover:bg-slate-50"
                                        }
                                    `}

                                >

                                    <Icon
                                        size={18}
                                    />

                                    <span
                                        className="
                                            font-medium
                                        "
                                    >
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

        );

    }







    if(!user){

        return null;

    }





    return (

       <nav

    className="
        sticky
        top-0
        z-[100]
        h-20
        bg-white
        backdrop-blur
        border-b
        border-slate-200
    "

>

            <div

                className="
                    max-w-7xl
                    mx-auto
                    px-6
                    h-20
                    flex
                    items-center
                    justify-between
                "

            >



                {/* LOGO */}

                <Link

                    href="/"

                    className="
                        flex
                        items-center
                        gap-2
                    "

                >

                    <div

                        className="
                            w-10
                            h-10
                            rounded-xl
                            bg-green-600
                            text-white
                            flex
                            items-center
                            justify-center
                            font-bold
                            text-xl
                        "

                    >

                        E

                    </div>



                    <span

                        className="
                            text-xl
                            font-bold
                            text-slate-900
                        "

                    >

                        EcoKnot

                    </span>


                </Link>







                {/* DESKTOP MENU */}

                <div

                    className="
                        hidden
                        lg:flex
                        items-center
                        gap-2
                    "

                >



                    <Link

                        href="/"

                        className={`
                            px-4
                            py-2
                            rounded-xl
                            font-medium

                            ${
                                isActive("/")
                                ?
                                "bg-green-50 text-green-700"
                                :
                                "text-slate-700 hover:bg-slate-50"
                            }

                        `}

                    >

                        Home

                    </Link>







                    {/* COMMUNITY */}

                    <div

                        className="
                            relative
                        "

                    >

                        <button

                            onClick={()=>{

                                setCommunityOpen(
                                    !communityOpen
                                );

                                setSupportOpen(
                                    false
                                );

                            }}

                            className="
                                flex
                                items-center
                                gap-2
                                px-4
                                py-2
                                rounded-xl
                                text-slate-700
                                hover:bg-slate-50
                                font-medium
                            "

                        >

                            Community

                            <ChevronDown
                                size={16}
                            />

                        </button>



                        {
                            communityOpen
                            &&
                            renderDropdownItems(
                                communityItems
                            )
                        }


                    </div>








                    {/* SUPPORT */}

                    <div

                        className="
                            relative
                        "

                    >

                        <button

                            onClick={()=>{

                                setSupportOpen(
                                    !supportOpen
                                );

                                setCommunityOpen(
                                    false
                                );

                            }}

                            className="
                                flex
                                items-center
                                gap-2
                                px-4
                                py-2
                                rounded-xl
                                text-slate-700
                                hover:bg-slate-50
                                font-medium
                            "

                        >

                            Support

                            <ChevronDown
                                size={16}
                            />

                        </button>




                        {
                            supportOpen
                            &&
                            renderDropdownItems(
                                supportItems
                            )
                        }



                    </div>







                    <Link

                        href="/dashboard"

                        className={`
                            flex
                            items-center
                            gap-2
                            px-4
                            py-2
                            rounded-xl
                            font-medium

                            ${
                                isActive("/dashboard")
                                ?
                                "bg-green-50 text-green-700"
                                :
                                "text-slate-700 hover:bg-slate-50"
                            }

                        `}

                    >

                        <LayoutDashboard
                            size={18}
                        />

                        Dashboard


                    </Link>



                </div>








                {/* RIGHT SIDE */}

                <div

                    className="
                        hidden
                        lg:flex
                        items-center
                        gap-4
                    "

                >



                    <Link

                        href="/notifications"

                        className="
                            relative
                            w-10
                            h-10
                            rounded-xl
                            hover:bg-slate-100
                            flex
                            items-center
                            justify-center
                        "

                    >

                        <Bell
                            size={20}
                        />


                        {
                            unreadCount > 0
                            &&
                            (

                                <span

                                    className="
                                        absolute
                                        -top-1
                                        -right-1
                                        bg-red-500
                                        text-white
                                        text-xs
                                        rounded-full
                                        w-5
                                        h-5
                                        flex
                                        items-center
                                        justify-center
                                    "

                                >

                                    {
                                        unreadCount
                                    }

                                </span>

                            )
                        }


                    </Link>








                    {/* PROFILE */}

                    <div

                        ref={
                            profileMenuRef
                        }

                        className="
                            relative
                        "

                    >

                        <button

                            onClick={()=>{

                                setProfileOpen(
                                    !profileOpen
                                );

                            }}

                            className="
                                flex
                                items-center
                                gap-2
                                px-3
                                py-2
                                rounded-xl
                                hover:bg-slate-50
                            "

                        >

                            <UserCircle
                                size={34}
                                className="text-green-600"
                            />


                            <span

                                className="
                                    font-medium
                                    text-slate-800
                                "

                            >

                                {
                                    user.name
                                }

                            </span>


                            <ChevronDown
                                size={16}
                            />


                        </button>






                        {
                            profileOpen
                            &&
                            (

                                <div

                                    className="
                                        absolute
                                        right-0
                                        top-14
                                        w-64
                                        bg-white
                                        border
                                        border-slate-200
                                        rounded-2xl
                                        shadow-xl
                                        p-3
                                    "

                                >


                                    <Link

                                        href="/profile"

                                        className="
                                            flex
                                            items-center
                                            gap-3
                                            px-4
                                            py-3
                                            rounded-xl
                                            hover:bg-slate-50
                                        "

                                    >

                                        <UserCircle
                                            size={18}
                                        />

                                        Profile


                                    </Link>





                                    <Link

                                        href="/saved-resources"

                                        className="
                                            flex
                                            items-center
                                            gap-3
                                            px-4
                                            py-3
                                            rounded-xl
                                            hover:bg-slate-50
                                        "

                                    >

                                        <Bookmark
                                            size={18}
                                        />

                                        Saved Resources


                                    </Link>






                                    <hr
                                        className="
                                            my-2
                                        "
                                    />





                                    <button

                                        onClick={
                                            handleLogout
                                        }

                                        className="
                                            w-full
                                            flex
                                            items-center
                                            gap-3
                                            px-4
                                            py-3
                                            rounded-xl
                                            text-red-600
                                            hover:bg-red-50
                                        "

                                    >

                                        <LogOut
                                            size={18}
                                        />

                                        Logout


                                    </button>



                                </div>

                            )
                        }


                    </div>


                </div>








                {/* MOBILE BUTTON */}

                <button

                    onClick={()=>{

                        setMobileOpen(
                            !mobileOpen
                        );

                    }}

                    className="
                        lg:hidden
                        w-10
                        h-10
                        rounded-xl
                        hover:bg-slate-100
                        flex
                        items-center
                        justify-center
                    "

                >

                    {
                        mobileOpen
                        ?
                        <X/>
                        :
                        <Menu/>
                    }


                </button>



            </div>









            {/* MOBILE MENU */}

            {
                mobileOpen
                &&
                (

                    <div

                        className="
                            lg:hidden
                            border-t
                            border-slate-200
                            bg-white
                            px-6
                            py-5
                        "

                    >


                        <Link

                            href="/"

                            className="
                                block
                                py-3
                                font-medium
                            "

                        >

                            Home

                        </Link>



                        <p className="
                            mt-3
                            text-sm
                            font-semibold
                            text-slate-400
                        ">

                            Community

                        </p>


                        {
                            communityItems.map(
                                item=>(

                                    <Link

                                        key={
                                            item.path
                                        }

                                        href={
                                            item.path
                                        }

                                        className="
                                            block
                                            py-3
                                            text-slate-700
                                        "

                                    >

                                        {item.name}

                                    </Link>

                                )
                            )
                        }




                        <p className="
                            mt-3
                            text-sm
                            font-semibold
                            text-slate-400
                        ">

                            Support

                        </p>


                        {
                            supportItems.map(
                                item=>(

                                    <Link

                                        key={
                                            item.path
                                        }

                                        href={
                                            item.path
                                        }

                                        className="
                                            block
                                            py-3
                                            text-slate-700
                                        "

                                    >

                                        {item.name}

                                    </Link>

                                )
                            )
                        }



                        <Link

                            href="/dashboard"

                            className="
                                block
                                py-3
                                font-medium
                            "

                        >

                            Dashboard

                        </Link>



                        <button

                            onClick={
                                handleLogout
                            }

                            className="
                                mt-4
                                w-full
                                flex
                                items-center
                                justify-center
                                gap-2
                                py-3
                                rounded-xl
                                bg-red-50
                                text-red-600
                            "

                        >

                            <LogOut
                                size={18}
                            />

                            Logout


                        </button>



                    </div>

                )
            }



        </nav>

    );


}