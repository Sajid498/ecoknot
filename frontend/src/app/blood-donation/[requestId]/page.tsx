"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";


import toast from "react-hot-toast";


const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:8080";


type BloodRequest = {

    id: number;

    patientName: string;

    bloodGroup: string;

    hospital: string;

    location: string;

    contactNumber: string;

    requiredDate: string;

    unitsNeeded: number;

    urgency: string;

    description: string;

    status: string;

    userId: number;

};


type DonationResponse = {

    id: number;

    requestId: number;

    donorId: number;

    donorName: string;

    donorEmail: string;

    donorPhone: string;

    status: string;

};


export default function BloodRequestDetailsPage() {

    const params = useParams();

    const router = useRouter();


    const requestId =
        Number(params.requestId);


    const [request, setRequest] =
        useState<BloodRequest | null>(null);


    const [user, setUser] =
        useState<any>(null);


    const [myDonation, setMyDonation] =
        useState<DonationResponse | null>(null);


    const [donors, setDonors] =
        useState<DonationResponse[]>([]);


    const [loading, setLoading] =
        useState(false);


    useEffect(() => {

        const savedUser =
            localStorage.getItem("user");


        if (savedUser) {

            const userData =
                JSON.parse(savedUser);


            setUser(userData);

        }


        loadRequest();

        loadDonors();

    }, []);


    async function loadRequest() {

        try {

            const response =
                await fetch(

                    `${API_URL}/api/blood-requests/${requestId}`

                );


            const data =
                await response.json();


            setRequest(data);

        }

        catch (error) {

            console.log(error);

        }

    }


    async function loadDonors() {

        try {

            const response =
                await fetch(

                    `${API_URL}/api/donation-response/request/${requestId}`

                );


            const data =
                await response.json();


            if (Array.isArray(data)) {

                setDonors(data);

            }

        }

        catch (error) {

            console.log(error);

        }

    }


    async function checkMyDonation(
        donorId: number
    ) {

        try {

            const response =
                await fetch(

                    `${API_URL}/api/donation-response/donor/${donorId}`

                );


            const data =
                await response.json();


            if (Array.isArray(data)) {

                const found =
                    data.find(

                        (item: any) =>
                            item.requestId === requestId

                    );


                if (found) {

                    setMyDonation(found);

                }

            }

        }

        catch (error) {

            console.log(error);

        }

    }


    useEffect(() => {

        if (user) {

            checkMyDonation(
                user.id
            );

        }

    }, [user]);


    async function donate() {

        if (!user) {

            toast.error(
                "Please login first"
            );

            return;

        }


        try {

            setLoading(true);


            const eligibilityResponse =
                await fetch(

                    `${API_URL}/api/users/${user.id}/eligibility`

                );


            if (!eligibilityResponse.ok) {

                throw new Error(
                    "Unable to check donation eligibility"
                );

            }


            const eligibility =
                await eligibilityResponse.json();


            if (!eligibility.eligible) {

                toast.error(
                    eligibility.message ||
                    "You are not eligible to donate blood yet"
                );

                return;

            }


            const response =
                await fetch(

                    `${API_URL}/api/donation-response`,

                    {

                        method: "POST",


                        headers: {

                            "Content-Type":
                                "application/json"

                        },


                        body: JSON.stringify({

                            requestId,

                            donorId:
                                user.id,

                            donorName:
                                user.name,

                            donorEmail:
                                user.email,

                            donorPhone:
                                user.phone ||
                                "Not provided"

                        })

                    }

                );


            if (!response.ok) {

                const message =
                    await response.text();


                throw new Error(
                    message ||
                    "Donation failed"
                );

            }


            const data =
                await response.json();


            setMyDonation(data);


            toast.success(
                "Donation request sent"
            );


            loadDonors();

        }

        catch (error: any) {

            toast.error(
                error?.message ||
                "Unable to submit donation request"
            );

        }

        finally {

            setLoading(false);

        }

    }


    async function updateDonationStatus(
        id: number,
        status: string
    ) {

        try {

            const response =
                await fetch(

                    `${API_URL}/api/donation-response/${id}?status=${status}`,

                    {

                        method: "PUT"

                    }

                );


            if (!response.ok) {

                throw new Error(
                    "Update failed"
                );

            }


            loadDonors();

            loadRequest();

        }

        catch (error) {

            console.log(error);


            toast.error(
                "Something went wrong"
            );

        }

    }


    async function completeDonation(
        id: number
    ) {

        if (!user?.id) {

            toast.error(
                "Please login first"
            );

            return;

        }


        try {

            const response =
                await fetch(

                    `${API_URL}/api/donation-response/${id}/complete?requesterId=${user.id}`,

                    {

                        method: "PUT"

                    }

                );


            if (!response.ok) {

                const message =
                    await response.text();


                throw new Error(
                    message ||
                    "Donation completion failed"
                );

            }


            toast.success(
                "Donation completed successfully"
            );


            await Promise.all([
                loadDonors(),
                loadRequest()
            ]);

        }

        catch (error) {

            console.log(error);


            toast.error(
                error instanceof Error
                    ? error.message
                    : "Something went wrong"
            );

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


    /*
     * Loading state
     *
     * Keep both navigation bars visible
     * while the request is loading.
     */

    if (!request) {

        return (

            <main
                className="
                min-h-screen
                bg-slate-50
                "
            >

             

        


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
                        rounded-2xl
                        bg-white
                        p-8
                        shadow
                        "
                    >

                        <p
                            className="
                            text-slate-500
                            "
                        >

                            Loading blood request...

                        </p>

                    </div>

                </div>

            </main>

        );

    }


    const isOwner =
        user &&
        user.id === request.userId;


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
                    shadow
                    "
                >

                    {/* REQUEST HEADER */}

                    <div
                        className="
                        flex
                        flex-wrap
                        justify-between
                        gap-4
                        "
                    >

                        <div>

                            <span
                                className="
                                rounded-lg
                                bg-red-100
                                px-3
                                py-1
                                font-bold
                                text-red-700
                                "
                            >

                                🩸 {
                                    formatBloodGroup(
                                        request.bloodGroup
                                    )
                                }

                            </span>


                            <h1
                                className="
                                mt-5
                                text-3xl
                                font-bold
                                "
                            >

                                {
                                    request.patientName
                                }

                            </h1>

                        </div>


                        <span
                            className="
                            h-fit
                            rounded-full
                            bg-yellow-100
                            px-4
                            py-2
                            font-semibold
                            text-yellow-700
                            "
                        >

                            {
                                request.status
                            }

                        </span>

                    </div>


                    {/* REQUEST INFORMATION */}

                    <div
                        className="
                        mt-8
                        space-y-3
                        text-slate-600
                        "
                    >

                        <p>

                            🏥 Hospital:

                            <b>
                                {" "}
                                {request.hospital}
                            </b>

                        </p>


                        <p>

                            📍 Location:

                            <b>
                                {" "}
                                {request.location}
                            </b>

                        </p>


                        <p>

                            📅 Date:

                            <b>
                                {" "}
                                {request.requiredDate}
                            </b>

                        </p>


                        <p>

                            🩸 Units:

                            <b>
                                {" "}
                                {request.unitsNeeded}
                            </b>

                        </p>


                        <p>

                            ⚠️ Urgency:

                            <b>
                                {" "}
                                {request.urgency}
                            </b>

                        </p>


                        <p>

                            📞 Contact:

                            <b>
                                {" "}
                                {request.contactNumber}
                            </b>

                        </p>

                    </div>


                    {/* DESCRIPTION */}

                    {
                        request.description &&

                        <div
                            className="
                            mt-6
                            rounded-xl
                            bg-slate-100
                            p-4
                            "
                        >

                            {
                                request.description
                            }

                        </div>
                    }


                    {/* ================================= */}
                    {/* DONOR VIEW */}
                    {/* ================================= */}

                    {
                        !isOwner &&

                        <div
                            className="
                            mt-8
                            "
                        >

                            {
                                myDonation

                                    ?

                                    (

                                        <div
                                            className="
                                            rounded-xl
                                            bg-green-100
                                            p-5
                                            text-green-700
                                            "
                                        >

                                            <h2
                                                className="
                                                font-bold
                                                "
                                            >

                                                ✅ Donation Sent

                                            </h2>


                                            <p>

                                                Status:{" "}

                                                {
                                                    myDonation.status
                                                }

                                            </p>

                                        </div>

                                    )

                                    :

                                    (

                                        <button

                                            onClick={
                                                donate
                                            }

                                            disabled={
                                                loading
                                            }

                                            className="
                                            rounded-xl
                                            bg-red-600
                                            px-6
                                            py-3
                                            font-semibold
                                            text-white
                                            transition
                                            hover:bg-red-700
                                            disabled:cursor-not-allowed
                                            disabled:opacity-50
                                            "
                                        >

                                            {
                                                loading

                                                    ?

                                                    "Sending..."

                                                    :

                                                    "🩸 I Want To Donate"
                                            }

                                        </button>

                                    )
                            }

                        </div>
                    }


                    {/* ================================= */}
                    {/* REQUEST OWNER VIEW */}
                    {/* ================================= */}

                    {
                        isOwner &&

                        <div
                            className="
                            mt-10
                            "
                        >

                            <h2
                                className="
                                text-2xl
                                font-bold
                                "
                            >

                                Interested Donors

                            </h2>


                            {
                                donors.length === 0

                                    ?

                                    (

                                        <p
                                            className="
                                            mt-5
                                            text-gray-500
                                            "
                                        >

                                            No donors yet.

                                        </p>

                                    )

                                    :

                                    donors.map(

                                        (donor) => (

                                            <div

                                                key={
                                                    donor.id
                                                }

                                                className="
                                                mt-5
                                                rounded-xl
                                                border
                                                p-5
                                                "
                                            >

                                                <div
                                                    className="
                                                    flex
                                                    flex-wrap
                                                    items-start
                                                    justify-between
                                                    gap-3
                                                    "
                                                >

                                                    <div>

                                                        <h3
                                                            className="
                                                            text-xl
                                                            font-bold
                                                            "
                                                        >

                                                            {
                                                                donor.donorName
                                                            }

                                                        </h3>


                                                        <p
                                                            className="
                                                            mt-2
                                                            text-slate-600
                                                            "
                                                        >

                                                            Email:{" "}

                                                            {
                                                                donor.donorEmail
                                                            }

                                                        </p>


                                                        <p
                                                            className="
                                                            text-slate-600
                                                            "
                                                        >

                                                            Phone:{" "}

                                                            {
                                                                donor.donorPhone
                                                            }

                                                        </p>

                                                    </div>


                                                    <span
                                                        className="
                                                        rounded-full
                                                        bg-slate-100
                                                        px-3
                                                        py-1
                                                        text-sm
                                                        font-semibold
                                                        text-slate-700
                                                        "
                                                    >

                                                        {
                                                            donor.status
                                                        }

                                                    </span>

                                                </div>


                                                <div
                                                    className="
                                                    mt-4
                                                    flex
                                                    flex-wrap
                                                    gap-3
                                                    "
                                                >

                                                    {
                                                        donor.status === "PENDING"

                                                        &&

                                                        <>

                                                            <button

                                                                onClick={() =>
                                                                    updateDonationStatus(
                                                                        donor.id,
                                                                        "ACCEPTED"
                                                                    )
                                                                }

                                                                className="
                                                                rounded-lg
                                                                bg-green-600
                                                                px-4
                                                                py-2
                                                                text-white
                                                                transition
                                                                hover:bg-green-700
                                                                "
                                                            >

                                                                Accept

                                                            </button>


                                                            <button

                                                                onClick={() =>
                                                                    updateDonationStatus(
                                                                        donor.id,
                                                                        "REJECTED"
                                                                    )
                                                                }

                                                                className="
                                                                rounded-lg
                                                                bg-red-600
                                                                px-4
                                                                py-2
                                                                text-white
                                                                transition
                                                                hover:bg-red-700
                                                                "
                                                            >

                                                                Reject

                                                            </button>

                                                        </>
                                                    }


                                                    {
                                                        donor.status === "ACCEPTED"

                                                        &&

                                                        <button

                                                            onClick={() =>
                                                                completeDonation(
                                                                    donor.id
                                                                )
                                                            }

                                                            className="
                                                            rounded-lg
                                                            bg-blue-600
                                                            px-4
                                                            py-2
                                                            text-white
                                                            transition
                                                            hover:bg-blue-700
                                                            "
                                                        >

                                                            Complete Donation

                                                        </button>
                                                    }


                                                    <button

                                                        onClick={() => {

                                                            router.push(

                                                                `/chat/${requestId}/${donor.donorId}`

                                                            );

                                                        }}

                                                        className="
                                                        rounded-lg
                                                        bg-emerald-700
                                                        px-4
                                                        py-2
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
                    }

                </div>

            </div>

        </main>

    );

}