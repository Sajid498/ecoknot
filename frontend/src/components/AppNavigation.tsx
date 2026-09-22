"use client";


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

            ||

            pathname.startsWith(
                "/nearby-relief"
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