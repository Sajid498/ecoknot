"use client";


import {
    useEffect,
    useState
} from "react";


import {
    usePathname
} from "next/navigation";


import Navbar from "@/components/Navbar";


import BloodDonationNavbar from "@/components/BloodDonationNavbar";


import ReliefNavbar from "@/components/ReliefNavbar";


import FundraisingNavbar from "@/components/FundraisingNavbar";





export default function AppNavigation(){


    const pathname =
        usePathname();


    const [loggedIn,setLoggedIn] =
        useState(false);


    const [checkingAuth,setCheckingAuth] =
        useState(true);





    useEffect(()=>{


        function checkAuth(){


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


                setLoggedIn(
                    false
                );


                setCheckingAuth(
                    false
                );


                return;


            }





            try{


                const user =
                    JSON.parse(
                        savedUser
                    );


                if(
                    user
                    &&
                    user.id
                    &&
                    user.email
                ){


                    setLoggedIn(
                        true
                    );


                }
                else{


                    setLoggedIn(
                        false
                    );


                }


            }
            catch(error){


                console.log(
                    "Invalid navigation session:",
                    error
                );


                setLoggedIn(
                    false
                );


            }





            setCheckingAuth(
                false
            );


        }





        checkAuth();





        window.addEventListener(

            "storage",

            checkAuth

        );





        return ()=>{


            window.removeEventListener(

                "storage",

                checkAuth

            );


        };


    },[pathname]);









    function showBloodNavbar(){


        return (

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
            )

            ||

            pathname.startsWith(
                "/donors"
            )

        );


    }









    function showReliefNavbar(){


        return (

            pathname.startsWith(
                "/rescue"
            )

            ||

            pathname.startsWith(
                "/my-relief-posts"
            )

            ||

            pathname.startsWith(
                "/pickup-requests"
            )

        );


    }









    function showFundraisingNavbar(){


        return (

            pathname.startsWith(
                "/fundraising"
            )

        );


    }









    if(checkingAuth){


        return null;


    }









    /*
     * Logged-out users should not see
     * any global or module navigation.
     */

    if(!loggedIn){


        return null;


    }









    return(


        <>



            {/* Global Navbar */}

            <Navbar />








            {/* Blood Module Navbar */}

            {

                showBloodNavbar()

                &&

                <BloodDonationNavbar />

            }









            {/* Relief Module Navbar */}

            {

                showReliefNavbar()

                &&

                <ReliefNavbar />

            }









            {/* Fundraising Module Navbar */}

            {

                showFundraisingNavbar()

                &&

                <FundraisingNavbar />

            }







        </>


    );


}