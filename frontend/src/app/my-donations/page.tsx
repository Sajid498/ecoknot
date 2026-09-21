"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import BloodDonationNavbar from "@/components/BloodDonationNavbar";


const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:8080";


type Donation = {

    id: number;

    requestId: number;

    donorId: number;

    status: string;

    requestOwnerId: number;

    requestOwnerName: string;

};


export default function MyDonationsPage() {

    const router = useRouter();


    const [donations, setDonations] =
        useState<Donation[]>([]);


    useEffect(() => {

        const savedUser =
            localStorage.getItem("user");


        if (savedUser) {

            const userData =
                JSON.parse(savedUser);


            loadDonations(
                userData.id
            );

        }

    }, []);


    async function loadDonations(
        userId: number
    ) {

        try {

            const response =
                await fetch(

                    `${API_URL}/api/donation-response/donor/${userId}`

                );


            const data =
                await response.json();


            if (Array.isArray(data)) {

                setDonations(data);

            }

            else {

                setDonations([]);

            }

        }

        catch (error) {

            console.log(error);

            setDonations([]);

        }

    }


    function getStatusStyle(
        status: string
    ) {

        if (status === "COMPLETED") {

            return "bg-green-100 text-green-700";

        }


        if (status === "ACCEPTED") {

            return "bg-blue-100 text-blue-700";

        }


        if (status === "REJECTED") {

            return "bg-red-100 text-red-700";

        }


        return "bg-yellow-100 text-yellow-700";

    }


    function getStatusText(
        status: string
    ) {

        switch (status) {

            case "PENDING":

                return "🟡 Waiting for approval";


            case "ACCEPTED":

                return "🟢 Donation accepted";


            case "COMPLETED":

                return "✅ Donation completed";


            case "REJECTED":

                return "❌ Request rejected";


            default:

                return status;

        }

    }


    return (

        <ProtectedRoute>

            <main
                className="
                min-h-screen
                bg-slate-50
                "
            >

                {/* ========================= */}
                {/* PERMANENT MAIN NAVBAR */}
                {/* ========================= */}

                <Navbar />


                {/* ========================= */}
                {/* BLOOD MODULE NAVBAR */}
                {/* ========================= */}

                <BloodDonationNavbar />


                {/* ========================= */}
                {/* PAGE CONTENT */}
                {/* ========================= */}

                <div
                    className="
                    mx-auto
                    max-w-5xl
                    px-6
                    py-10
                    "
                >

                    <div
                        className="
                        rounded-3xl
                        bg-white
                        p-8
                        shadow-lg
                        "
                    >

                        <h1
                            className="
                            text-3xl
                            font-bold
                            text-slate-900
                            "
                        >

                            ❤️ My Donations

                        </h1>


                        <p
                            className="
                            mt-2
                            text-slate-500
                            "
                        >

                            Track your blood donation activities and request status.

                        </p>


                        {

                            donations.length === 0

                                ?

                                (

                                    <p
                                        className="
                                        mt-8
                                        text-slate-500
                                        "
                                    >

                                        You have not responded to any blood request.

                                    </p>

                                )

                                :

                                (

                                    <div
                                        className="
                                        mt-8
                                        space-y-6
                                        "
                                    >

                                        {

                                            donations.map(

                                                (donation) => (

                                                    <div

                                                        key={
                                                            donation.id
                                                        }

                                                        className="
                                                        rounded-2xl
                                                        border
                                                        border-slate-200
                                                        p-6
                                                        transition
                                                        hover:shadow-md
                                                        "
                                                    >

                                                        <div
                                                            className="
                                                            flex
                                                            items-start
                                                            justify-between
                                                            gap-4
                                                            "
                                                        >

                                                            <div>

                                                                <h2
                                                                    className="
                                                                    text-xl
                                                                    font-bold
                                                                    "
                                                                >

                                                                    🩸 Blood Request #{donation.requestId}

                                                                </h2>


                                                                <p
                                                                    className="
                                                                    mt-2
                                                                    text-slate-600
                                                                    "
                                                                >

                                                                    Requester:

                                                                    <span
                                                                        className="
                                                                        ml-2
                                                                        font-semibold
                                                                        "
                                                                    >

                                                                        {
                                                                            donation.requestOwnerName
                                                                        }

                                                                    </span>

                                                                </p>

                                                            </div>


                                                            <span
                                                                className={`
                                                                rounded-full
                                                                px-4
                                                                py-2
                                                                text-sm
                                                                font-semibold

                                                                ${
                                                                    getStatusStyle(
                                                                        donation.status
                                                                    )
                                                                }
                                                                `}
                                                            >

                                                                {
                                                                    donation.status
                                                                }

                                                            </span>

                                                        </div>


                                                        {/* ========================= */}
                                                        {/* STATUS TIMELINE */}
                                                        {/* ========================= */}

                                                        <div
                                                            className="
                                                            mt-6
                                                            rounded-xl
                                                            bg-slate-50
                                                            p-5
                                                            "
                                                        >

                                                            <h3
                                                                className="
                                                                font-semibold
                                                                "
                                                            >

                                                                Donation Progress

                                                            </h3>


                                                            <div
                                                                className="
                                                                mt-4
                                                                space-y-3
                                                                "
                                                            >

                                                                {/* APPLIED */}

                                                                <div
                                                                    className="
                                                                    flex
                                                                    items-center
                                                                    gap-3
                                                                    "
                                                                >

                                                                    <span>

                                                                        🟡

                                                                    </span>


                                                                    <p
                                                                        className={
                                                                            donation.status

                                                                                ?

                                                                                "text-slate-700 font-medium"

                                                                                :

                                                                                "text-slate-400"
                                                                        }
                                                                    >

                                                                        Applied for donation

                                                                    </p>

                                                                </div>


                                                                {/* ACCEPTED */}

                                                                <div
                                                                    className="
                                                                    flex
                                                                    items-center
                                                                    gap-3
                                                                    "
                                                                >

                                                                    <span>

                                                                        {

                                                                            donation.status === "ACCEPTED"

                                                                            ||

                                                                            donation.status === "COMPLETED"

                                                                                ?

                                                                                "🟢"

                                                                                :

                                                                                "⚪"

                                                                        }

                                                                    </span>


                                                                    <p
                                                                        className={
                                                                            donation.status === "ACCEPTED"

                                                                            ||

                                                                            donation.status === "COMPLETED"

                                                                                ?

                                                                                "font-medium text-slate-700"

                                                                                :

                                                                                "text-slate-400"
                                                                        }
                                                                    >

                                                                        Accepted by requester

                                                                    </p>

                                                                </div>


                                                                {/* COMPLETED */}

                                                                <div
                                                                    className="
                                                                    flex
                                                                    items-center
                                                                    gap-3
                                                                    "
                                                                >

                                                                    <span>

                                                                        {

                                                                            donation.status === "COMPLETED"

                                                                                ?

                                                                                "✅"

                                                                                :

                                                                                "⚪"

                                                                        }

                                                                    </span>


                                                                    <p
                                                                        className={
                                                                            donation.status === "COMPLETED"

                                                                                ?

                                                                                "font-medium text-slate-700"

                                                                                :

                                                                                "text-slate-400"
                                                                        }
                                                                    >

                                                                        Donation completed

                                                                    </p>

                                                                </div>

                                                            </div>

                                                        </div>


                                                        {/* CURRENT STATUS MESSAGE */}

                                                        <p
                                                            className="
                                                            mt-5
                                                            font-semibold
                                                            text-slate-700
                                                            "
                                                        >

                                                            {
                                                                getStatusText(
                                                                    donation.status
                                                                )
                                                            }

                                                        </p>


                                                        {/* ACTIONS */}

                                                        <div
                                                            className="
                                                            mt-5
                                                            flex
                                                            gap-3
                                                            "
                                                        >

                                                            <button

                                                                onClick={() => {

                                                                    router.push(

                                                                        `/chat/${donation.requestId}/${donation.requestOwnerId}`

                                                                    );

                                                                }}

                                                                className="
                                                                rounded-xl
                                                                bg-emerald-700
                                                                px-5
                                                                py-3
                                                                font-semibold
                                                                text-white
                                                                transition
                                                                hover:bg-emerald-800
                                                                "
                                                            >

                                                                💬 Chat

                                                            </button>

                                                        </div>

                                                    </div>

                                                )

                                            )

                                        }

                                    </div>

                                )

                        }

                    </div>

                </div>

            </main>

        </ProtectedRoute>

    );

}