"use client";

import { useEffect, useState } from "react";



const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:8080";


type DonationHistory = {

    id: number;

    requestId: number;

    patientName: string;

    bloodGroup: string;

    hospital: string;

    location: string;

    status: string;

    createdAt: string;

};


export default function DonationHistoryPage() {

    const [history, setHistory] =
        useState<DonationHistory[]>([]);


    const [user, setUser] =
        useState<any>(null);


    const [loading, setLoading] =
        useState(true);


    useEffect(() => {

        const savedUser =
            localStorage.getItem("user");


        if (savedUser) {

            const userData =
                JSON.parse(savedUser);


            setUser(userData);


            loadHistory(
                userData.id
            );

        }

        else {

            setLoading(false);

        }

    }, []);


    async function loadHistory(
        donorId: number
    ) {

        try {

            setLoading(true);


            const response =
                await fetch(

                    `${API_URL}/api/donation-response/history/${donorId}`

                );


            if (!response.ok) {

                throw new Error(
                    "Failed to load donation history"
                );

            }


            const data =
                await response.json();


            if (Array.isArray(data)) {

                setHistory(data);

            }

            else {

                setHistory([]);

            }

        }

        catch (error) {

            console.log(error);

            setHistory([]);

        }

        finally {

            setLoading(false);

        }

    }


    function formatBloodGroup(
        bloodGroup: string
    ) {

        if (!bloodGroup) {

            return "";

        }


        return bloodGroup

            .replace(
                "_POSITIVE",
                "+"
            )

            .replace(
                "_NEGATIVE",
                "-"
            );

    }


    return (

        <main
            className="
            min-h-screen
            bg-slate-50
            "
        >

            {/* ========================= */}
            {/* PERMANENT MAIN NAVBAR */}
            {/* ========================= */}

      


            {/* ========================= */}
            {/* BLOOD MODULE NAVBAR */}
            {/* ========================= */}




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

                    <div
                        className="
                        flex
                        flex-wrap
                        items-start
                        justify-between
                        gap-4
                        "
                    >

                        <div>

                            <h1
                                className="
                                text-3xl
                                font-bold
                                text-slate-900
                                "
                            >

                                🩸 Donation History

                            </h1>


                            <p
                                className="
                                mt-2
                                text-slate-500
                                "
                            >

                                Your completed blood donations

                            </p>

                        </div>


                        {
                            user &&

                            <div
                                className="
                                rounded-xl
                                bg-red-50
                                px-4
                                py-2
                                text-sm
                                font-medium
                                text-red-700
                                "
                            >

                                ❤️ Donor: {user.name}

                            </div>
                        }

                    </div>


                    {/* ========================= */}
                    {/* LOADING */}
                    {/* ========================= */}

                    {
                        loading

                            ?

                            (

                                <p
                                    className="
                                    mt-8
                                    text-slate-500
                                    "
                                >

                                    Loading donation history...

                                </p>

                            )

                            :

                            history.length === 0

                                ?

                                (

                                    /* ========================= */
                                    /* EMPTY STATE */
                                    /* ========================= */

                                    <div
                                        className="
                                        mt-8
                                        rounded-2xl
                                        border
                                        border-dashed
                                        border-slate-300
                                        bg-slate-50
                                        p-8
                                        text-center
                                        "
                                    >

                                        <div
                                            className="
                                            text-4xl
                                            "
                                        >

                                            🩸

                                        </div>


                                        <h2
                                            className="
                                            mt-3
                                            text-lg
                                            font-bold
                                            text-slate-800
                                            "
                                        >

                                            No completed donations yet

                                        </h2>


                                        <p
                                            className="
                                            mt-2
                                            text-sm
                                            text-slate-500
                                            "
                                        >

                                            Your completed blood donations
                                            will appear here.

                                        </p>

                                    </div>

                                )

                                :

                                (

                                    /* ========================= */
                                    /* DONATION HISTORY LIST */
                                    /* ========================= */

                                    <div
                                        className="
                                        mt-8
                                        space-y-5
                                        "
                                    >

                                        {
                                            history.map(

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
                                                        hover:border-red-200
                                                        hover:shadow-md
                                                        "
                                                    >

                                                        <div
                                                            className="
                                                            flex
                                                            flex-wrap
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
                                                                    text-slate-900
                                                                    "
                                                                >

                                                                    {
                                                                        donation.patientName
                                                                    }

                                                                </h2>


                                                                <p
                                                                    className="
                                                                    mt-2
                                                                    text-lg
                                                                    font-bold
                                                                    text-red-600
                                                                    "
                                                                >

                                                                    🩸 {
                                                                        formatBloodGroup(
                                                                            donation.bloodGroup
                                                                        )
                                                                    }

                                                                </p>

                                                            </div>


                                                            <span
                                                                className="
                                                                rounded-full
                                                                bg-green-100
                                                                px-4
                                                                py-2
                                                                text-sm
                                                                font-semibold
                                                                text-green-700
                                                                "
                                                            >

                                                                ✅ {
                                                                    donation.status
                                                                }

                                                            </span>

                                                        </div>


                                                        <div
                                                            className="
                                                            mt-5
                                                            grid
                                                            gap-4
                                                            rounded-xl
                                                            bg-slate-50
                                                            p-5
                                                            sm:grid-cols-2
                                                            "
                                                        >

                                                            {/* BLOOD GROUP */}

                                                            <div>

                                                                <p
                                                                    className="
                                                                    text-xs
                                                                    font-medium
                                                                    uppercase
                                                                    tracking-wide
                                                                    text-slate-400
                                                                    "
                                                                >

                                                                    Blood Group

                                                                </p>


                                                                <p
                                                                    className="
                                                                    mt-1
                                                                    font-semibold
                                                                    text-slate-700
                                                                    "
                                                                >

                                                                    🩸 {
                                                                        formatBloodGroup(
                                                                            donation.bloodGroup
                                                                        )
                                                                    }

                                                                </p>

                                                            </div>


                                                            {/* HOSPITAL */}

                                                            <div>

                                                                <p
                                                                    className="
                                                                    text-xs
                                                                    font-medium
                                                                    uppercase
                                                                    tracking-wide
                                                                    text-slate-400
                                                                    "
                                                                >

                                                                    Hospital

                                                                </p>


                                                                <p
                                                                    className="
                                                                    mt-1
                                                                    font-semibold
                                                                    text-slate-700
                                                                    "
                                                                >

                                                                    🏥 {
                                                                        donation.hospital
                                                                    }

                                                                </p>

                                                            </div>


                                                            {/* LOCATION */}

                                                            <div>

                                                                <p
                                                                    className="
                                                                    text-xs
                                                                    font-medium
                                                                    uppercase
                                                                    tracking-wide
                                                                    text-slate-400
                                                                    "
                                                                >

                                                                    Location

                                                                </p>


                                                                <p
                                                                    className="
                                                                    mt-1
                                                                    font-semibold
                                                                    text-slate-700
                                                                    "
                                                                >

                                                                    📍 {
                                                                        donation.location
                                                                    }

                                                                </p>

                                                            </div>


                                                            {/* REQUEST ID */}

                                                            <div>

                                                                <p
                                                                    className="
                                                                    text-xs
                                                                    font-medium
                                                                    uppercase
                                                                    tracking-wide
                                                                    text-slate-400
                                                                    "
                                                                >

                                                                    Request ID

                                                                </p>


                                                                <p
                                                                    className="
                                                                    mt-1
                                                                    font-semibold
                                                                    text-slate-700
                                                                    "
                                                                >

                                                                    #{
                                                                        donation.requestId
                                                                    }

                                                                </p>

                                                            </div>


                                                            {/* DATE */}

                                                            <div>

                                                                <p
                                                                    className="
                                                                    text-xs
                                                                    font-medium
                                                                    uppercase
                                                                    tracking-wide
                                                                    text-slate-400
                                                                    "
                                                                >

                                                                    Donation Date

                                                                </p>


                                                                <p
                                                                    className="
                                                                    mt-1
                                                                    font-semibold
                                                                    text-slate-700
                                                                    "
                                                                >

                                                                    📅 {
                                                                        new Date(
                                                                            donation.createdAt
                                                                        )
                                                                            .toLocaleDateString()
                                                                    }

                                                                </p>

                                                            </div>

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

    );

}