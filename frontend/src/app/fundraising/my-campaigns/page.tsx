"use client";

import Link from "next/link";

import {
    useEffect,
    useState
} from "react";

import {
    currency,
    FundStatus
} from "@/lib/fundraising";

const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:8080";

type Campaign = {
    id: number;
    title: string;
    category: string;
    description: string;
    beneficiary: string;
    location: string;
    contactNumber: string;
    goalAmount: number;
    raisedAmount: number;
    status: FundStatus;
    authorId: number;
    authorName: string;
    createdAt: string;
    reviewNote: string | null;
    reactionCount: number;
    comments: unknown[];
    contributions: unknown[];
};

export default function MyCampaigns() {

    const [campaigns, setCampaigns] =
        useState<Campaign[]>([]);

    const [userId, setUserId] =
        useState<number | null>(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    useEffect(() => {

        loadCampaigns();

    }, []);

    async function loadCampaigns() {

        try {

            setLoading(true);
            setError("");

            const savedUser =
                localStorage.getItem("user");

            if (!savedUser) {

                setError(
                    "Please login to view your campaigns."
                );

                return;
            }

            const user =
                JSON.parse(savedUser);

            if (!user?.id) {

                setError(
                    "Unable to identify the logged-in user."
                );

                return;
            }

            const currentUserId =
                Number(user.id);

            setUserId(
                currentUserId
            );

            const response =
                await fetch(
                    `${API_URL}/api/funds/user/${currentUserId}`
                );

            if (!response.ok) {

                const message =
                    await response.text();

                throw new Error(
                    message ||
                    "Failed to load campaigns."
                );
            }

            const data: Campaign[] =
                await response.json();

            setCampaigns(
                data
            );

        } catch (error) {

            console.error(
                "My campaigns loading error:",
                error
            );

            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to load campaigns."
            );

        } finally {

            setLoading(false);
        }
    }

    async function closeCampaign(
        campaignId: number
    ) {

        if (!userId) {
            return;
        }

        const confirmed =
            window.confirm(
                "Are you sure you want to close this campaign?"
            );

        if (!confirmed) {
            return;
        }

        try {

            setError("");

            const response =
                await fetch(
                    `${API_URL}/api/funds/${campaignId}/close/user/${userId}`,
                    {
                        method: "PUT"
                    }
                );

            if (!response.ok) {

                const message =
                    await response.text();

                throw new Error(
                    message ||
                    "Failed to close campaign."
                );
            }

            await response.json();

            await loadCampaigns();

        } catch (error) {

            console.error(
                "Campaign close error:",
                error
            );

            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to close campaign."
            );
        }
    }

    if (loading) {

        return (

            <main className="
                min-h-screen
                bg-slate-50
            ">

                <section className="
                    mx-auto
                    max-w-5xl
                    px-6
                    py-10
                ">

                    <div className="
                        rounded-2xl
                        bg-white
                        p-10
                        text-center
                        text-slate-500
                        shadow-sm
                        ring-1
                        ring-slate-200
                    ">
                        Loading campaigns...
                    </div>

                </section>

            </main>
        );
    }

    return (

        <main className="
            min-h-screen
            bg-slate-50
        ">

            <section className="
                mx-auto
                max-w-5xl
                px-6
                py-10
            ">

                <div className="
                    flex
                    justify-between
                    gap-4
                ">

                    <div>

                        <h1 className="
                            text-3xl
                            font-bold
                        ">
                            My campaigns
                        </h1>

                        <p className="
                            mt-2
                            text-slate-600
                        ">
                            Track review status and donor activity.
                        </p>

                    </div>

                    <Link
                        href="/fundraising/create"
                        className="
                            h-fit
                            rounded-xl
                            bg-emerald-700
                            px-4
                            py-3
                            font-bold
                            text-white
                        "
                    >
                        New campaign
                    </Link>

                </div>

                {
                    error && (

                        <div className="
                            mt-6
                            rounded-xl
                            border
                            border-red-200
                            bg-red-50
                            p-4
                            text-red-700
                        ">
                            {error}
                        </div>
                    )
                }

                <div className="
                    mt-7
                    space-y-4
                ">

                    {
                        campaigns.map(
                            campaign => (

                                <article
                                    key={campaign.id}
                                    className="
                                        rounded-2xl
                                        bg-white
                                        p-5
                                        shadow-sm
                                        ring-1
                                        ring-slate-200
                                    "
                                >

                                    <div className="
                                        flex
                                        flex-wrap
                                        justify-between
                                        gap-3
                                    ">

                                        <div>

                                            <div className="
                                                text-xs
                                                font-bold
                                                text-emerald-700
                                            ">
                                                {
                                                    campaign.status
                                                        .replaceAll(
                                                            "_",
                                                            " "
                                                        )
                                                }
                                            </div>

                                            <h2 className="
                                                mt-1
                                                text-xl
                                                font-bold
                                            ">
                                                {campaign.title}
                                            </h2>

                                            <p className="
                                                mt-1
                                                text-slate-600
                                            ">
                                                {
                                                    currency(
                                                        Number(
                                                            campaign.raisedAmount
                                                        )
                                                    )
                                                }

                                                {" of "}

                                                {
                                                    currency(
                                                        Number(
                                                            campaign.goalAmount
                                                        )
                                                    )
                                                }

                                                {" · "}

                                                {
                                                    campaign
                                                        .contributions
                                                        .length
                                                }

                                                {" contributions"}
                                            </p>

                                            {
                                                campaign.status ===
                                                "REJECTED" &&
                                                campaign.reviewNote && (

                                                    <p className="
                                                        mt-3
                                                        rounded-lg
                                                        bg-red-50
                                                        px-3
                                                        py-2
                                                        text-sm
                                                        text-red-700
                                                    ">
                                                        Review note:{" "}
                                                        {
                                                            campaign.reviewNote
                                                        }
                                                    </p>
                                                )
                                            }

                                        </div>

                                        <div className="
                                            flex
                                            gap-2
                                        ">

                                            <Link
                                                href={
                                                    `/fundraising/${campaign.id}`
                                                }
                                                className="
                                                    rounded-lg
                                                    border
                                                    px-3
                                                    py-2
                                                    font-semibold
                                                "
                                            >
                                                View
                                            </Link>

                                            {
                                                campaign.status !==
                                                "CLOSED" && (

                                                    <button
                                                        onClick={() =>
                                                            closeCampaign(
                                                                campaign.id
                                                            )
                                                        }
                                                        className="
                                                            rounded-lg
                                                            border
                                                            border-red-200
                                                            px-3
                                                            py-2
                                                            font-semibold
                                                            text-red-700
                                                        "
                                                    >
                                                        Close
                                                    </button>
                                                )
                                            }

                                        </div>

                                    </div>

                                </article>
                            )
                        )
                    }

                    {
                        campaigns.length === 0 &&
                        !error && (

                            <div className="
                                rounded-2xl
                                bg-white
                                p-10
                                text-center
                                text-slate-500
                            ">
                                You have not submitted a campaign yet.
                            </div>
                        )
                    }

                </div>

            </section>

        </main>
    );
}