"use client";


import {
    usePathname
} from "next/navigation";


import Navbar from "@/components/Navbar";


import BloodDonationNavbar from "@/components/BloodDonationNavbar";



// Future imports will be added later
// import ReliefNavbar from "@/components/ReliefNavbar";
// import TimeBankNavbar from "@/components/TimeBankNavbar";








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









    return(


        <>


            {/* Always visible */}

            <Navbar />





            {/* Blood Module Navigation */}


            {
                showBloodNavbar()

                &&

                <BloodDonationNavbar />

            }





        </>


    );


}