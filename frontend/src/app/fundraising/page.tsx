"use client";

import Link from "next/link";

import {
    useEffect,
    useMemo,
    useState
} from "react";

import {
    categoryLabels,
    currency,
    FundCategory
} from "@/lib/fundraising";

const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:8080";

type Campaign = {
    id: number;
    title: string;
    category: FundCategory;
    description: string;
    beneficiary: string;
    location: string;
    contactNumber: string;
    goalAmount: number;
    raisedAmount: number;
    status: "APPROVED";
    authorId: number;
    authorName: string;
    createdAt: string;
    reviewNote: string | null;
    reactionCount: number;
    comments: unknown[];
    contributions: unknown[];
};

export default function FundraisingPage() {

    const [funds, setFunds] =
        useState<Campaign[]>([]);

    const [category, setCategory] =
        useState("ALL");

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

            const response =
                await fetch(
                    `${API_URL}/api/funds`
                );

            if (!response.ok) {

                const message =
                    await response.text();

                throw new Error(
                    message ||
                    "Failed to load fundraising campaigns."
                );
            }

            const data: Campaign[] =
                await response.json();

            setFunds(
                data
            );

        } catch (error) {

            console.error(
                "Fundraising loading error:",
                error
            );

            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to load fundraising campaigns."
            );

        } finally {

            setLoading(false);
        }
    }

    const visible =
        useMemo(() => {

            if (category === "ALL") {
                return funds;
            }

            return funds.filter(
                fund =>
                    fund.category === category
            );

        }, [
            funds,
            category
        ]);

    return (

        <main className="
            min-h-screen
            bg-slate-50
        ">

            <section className="
                mx-auto
                max-w-7xl
                px-6
                py-10
            ">

                <div className="
                    rounded-3xl
                    bg-gradient-to-br
                    from-emerald-800
                    to-teal-700
                    p-8
                    text-white
                    shadow-xl
                    md:p-12
                ">

                    <p className="
                        font-semibold
                        text-emerald-100
                    ">
                        ECO KNOT FUNDRAISING
                    </p>

                    <h1 className="
                        mt-2
                        text-4xl
                        font-bold
                    ">
                        Give with confidence.
                    </h1>

                    <p className="
                        mt-3
                        max-w-2xl
                        text-emerald-50
                    ">
                        Verified community campaigns,
                        transparent progress,
                        and a receipt for every contribution.
                    </p>

                    <Link
                        href="/fundraising/create"
                        className="
                            mt-6
                            inline-block
                            rounded-xl
                            bg-white
                            px-5
                            py-3
                            font-bold
                            text-emerald-800
                        "
                    >
                        Start a fundraiser
                    </Link>

                </div>

                <div className="
                    mt-8
                    flex
                    flex-wrap
                    items-center
                    justify-between
                    gap-4
                ">

                    <h2 className="
                        text-2xl
                        font-bold
                    ">
                        Verified campaigns
                    </h2>

                    <select
                        value={category}
                        onChange={
                            e =>
                                setCategory(
                                    e.target.value
                                )
                        }
                        className="
                            rounded-xl
                            border
                            border-slate-300
                            bg-white
                            p-3
                        "
                    >

                        <option value="ALL">
                            All categories
                        </option>

                        {
                            Object.entries(
                                categoryLabels
                            ).map(
                                ([key, label]) => (

                                    <option
                                        key={key}
                                        value={key}
                                    >
                                        {label}
                                    </option>
                                )
                            )
                        }

                    </select>

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

                {
                    loading ? (

                        <div className="
                            mt-8
                            rounded-2xl
                            bg-white
                            p-10
                            text-center
                            text-slate-500
                            shadow-sm
                        ">
                            Loading fundraising campaigns...
                        </div>

                    ) : (

                        <>

                            <div className="
                                mt-6
                                grid
                                gap-6
                                md:grid-cols-2
                                lg:grid-cols-3
                            ">

                                {
                                    visible.map(
                                        fund => {

                                            const progress =
                                                fund.goalAmount > 0
                                                    ? Math.min(
                                                        100,
                                                        Math.round(
                                                            (
                                                                fund.raisedAmount /
                                                                fund.goalAmount
                                                            ) * 100
                                                        )
                                                    )
                                                    : 0;

                                            return (

                                                <article
                                                    key={fund.id}
                                                    className="
                                                        rounded-2xl
                                                        bg-white
                                                        p-6
                                                        shadow-sm
                                                        ring-1
                                                        ring-slate-200
                                                    "
                                                >

                                                    <div className="
                                                        flex
                                                        justify-between
                                                        gap-3
                                                    ">

                                                        <span className="
                                                            rounded-full
                                                            bg-emerald-50
                                                            px-3
                                                            py-1
                                                            text-xs
                                                            font-bold
                                                            text-emerald-700
                                                        ">
                                                            {
                                                                categoryLabels[
                                                                    fund.category
                                                                ]
                                                            }
                                                        </span>

                                                        <span className="
                                                            text-sm
                                                            text-slate-500
                                                        ">
                                                            {fund.location}
                                                        </span>

                                                    </div>

                                                    <h3 className="
                                                        mt-4
                                                        text-xl
                                                        font-bold
                                                        text-slate-900
                                                    ">
                                                        {fund.title}
                                                    </h3>

                                                    <p className="
                                                        mt-2
                                                        line-clamp-2
                                                        text-sm
                                                        text-slate-600
                                                    ">
                                                        {fund.description}
                                                    </p>

                                                    <div className="
                                                        mt-5
                                                        h-2
                                                        overflow-hidden
                                                        rounded-full
                                                        bg-slate-100
                                                    ">

                                                        <div
                                                            className="
                                                                h-full
                                                                bg-emerald-600
                                                            "
                                                            style={{
                                                                width:
                                                                    `${progress}%`
                                                            }}
                                                        />

                                                    </div>

                                                    <div className="
                                                        mt-2
                                                        flex
                                                        justify-between
                                                        text-sm
                                                    ">

                                                        <b>
                                                            {
                                                                currency(
                                                                    Number(
                                                                        fund.raisedAmount
                                                                    )
                                                                )
                                                            }
                                                        </b>

                                                        <span className="
                                                            text-slate-500
                                                        ">
                                                            of{" "}
                                                            {
                                                                currency(
                                                                    Number(
                                                                        fund.goalAmount
                                                                    )
                                                                )
                                                            }
                                                        </span>

                                                    </div>

                                                    <div className="
                                                        mt-3
                                                        flex
                                                        justify-between
                                                        text-xs
                                                        text-slate-500
                                                    ">

                                                        <span>
                                                            By{" "}
                                                            {
                                                                fund.authorName
                                                            }
                                                        </span>

                                                        <span>
                                                            ❤️{" "}
                                                            {
                                                                fund.reactionCount
                                                            }
                                                        </span>

                                                    </div>

                                                    <Link
                                                        href={
                                                            `/fundraising/${fund.id}`
                                                        }
                                                        className="
                                                            mt-5
                                                            block
                                                            rounded-xl
                                                            border
                                                            border-emerald-700
                                                            py-2
                                                            text-center
                                                            font-semibold
                                                            text-emerald-700
                                                            hover:bg-emerald-50
                                                        "
                                                    >
                                                        View campaign
                                                    </Link>

                                                </article>
                                            );
                                        }
                                    )
                                }

                            </div>

                            {
                                visible.length === 0 &&
                                !error && (

                                    <div className="
                                        mt-8
                                        rounded-2xl
                                        bg-white
                                        p-10
                                        text-center
                                        text-slate-500
                                        shadow-sm
                                    ">
                                        No approved campaigns yet.
                                        New campaigns appear here after review.
                                    </div>
                                )
                            }

                        </>
                    )
                }

            </section>

        </main>
    );
}