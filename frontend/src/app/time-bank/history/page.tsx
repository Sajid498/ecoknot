"use client";

import {
    useEffect,
    useState
} from "react";

import {
    TimeTransaction
} from "@/types/timebank";

const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:8080";

export default function TimeHistoryPage() {

    const [transactions, setTransactions] =
        useState<TimeTransaction[]>([]);

    const [currentUserId, setCurrentUserId] =
        useState<number | null>(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    useEffect(() => {
        loadHistory();
    }, []);

    async function loadHistory() {

        try {

            setLoading(true);
            setError("");

            const storedUser =
                localStorage.getItem("user");

            if (!storedUser) {
                setError(
                    "Please login to view your Time Bank history."
                );

                return;
            }

            const user =
                JSON.parse(storedUser);

            if (!user.id) {
                setError(
                    "User information could not be found."
                );

                return;
            }

            const userId =
                Number(user.id);

            setCurrentUserId(userId);

            const response =
                await fetch(
                    `${API_URL}/api/time-bank/history/${userId}`
                );

            if (!response.ok) {

                const message =
                    await response.text();

                throw new Error(
                    message ||
                    "Failed to load Time Bank history."
                );
            }

            const data: TimeTransaction[] =
                await response.json();

            setTransactions(data);

        } catch (error) {

            console.error(
                "Time Bank history error:",
                error
            );

            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to load Time Bank history."
            );

        } finally {

            setLoading(false);
        }
    }

    function formatDate(
        dateValue: string
    ) {

        if (!dateValue) {
            return "Unknown date";
        }

        const date =
            new Date(dateValue);

        if (Number.isNaN(date.getTime())) {
            return dateValue;
        }

        return date.toLocaleString();
    }

    if (loading) {

        return (
            <main className="
                min-h-screen
                flex
                items-center
                justify-center
                bg-slate-50
            ">
                <div className="
                    rounded-xl
                    bg-white
                    p-8
                    shadow
                    text-slate-700
                ">
                    Loading history...
                </div>
            </main>
        );
    }

    return (
        <main className="
            min-h-screen
            bg-slate-50
            p-6
            md:p-10
        ">

            <div className="
                mx-auto
                max-w-4xl
            ">

                <h1 className="
                    text-3xl
                    font-bold
                    text-slate-900
                ">
                    📜 Time Bank History
                </h1>

                <p className="
                    mt-2
                    text-slate-600
                ">
                    Track your earned and spent time credits.
                </p>

                {error && (
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
                )}

                <div className="
                    mt-8
                    space-y-5
                ">

                    {!error &&
                    transactions.length === 0 ? (

                        <div className="
                            rounded-2xl
                            bg-white
                            p-8
                            text-center
                            shadow
                            text-slate-600
                        ">
                            No transactions yet.
                        </div>

                    ) : (

                        transactions.map(
                            (transaction) => {

                                const isEarned =
                                    currentUserId !== null &&
                                    transaction.provider?.id ===
                                    currentUserId;

                                const displayedHours =
                                    isEarned
                                        ? transaction.hours
                                        : -transaction.hours;

                                return (

                                    <div
                                        key={transaction.id}
                                        className="
                                            rounded-2xl
                                            bg-white
                                            p-6
                                            shadow
                                        "
                                    >

                                        <div className="
                                            flex
                                            flex-col
                                            gap-4
                                            sm:flex-row
                                            sm:items-center
                                            sm:justify-between
                                        ">

                                            <div>

                                                <h2 className="
                                                    font-bold
                                                    text-slate-900
                                                ">
                                                    {
                                                        isEarned
                                                            ? "⬆️ Earned Time"
                                                            : "⬇️ Spent Time"
                                                    }
                                                </h2>

                                                <p className="
                                                    mt-2
                                                    text-slate-600
                                                ">
                                                    {
                                                        transaction.description
                                                    }
                                                </p>

                                                <p className="
                                                    mt-2
                                                    text-sm
                                                    text-slate-500
                                                ">
                                                    {
                                                        isEarned
                                                            ? `Helped: ${transaction.requester?.name || "Community member"}`
                                                            : `Helped by: ${transaction.provider?.name || "Community member"}`
                                                    }
                                                </p>

                                            </div>

                                            <p
                                                className={`
                                                    text-3xl
                                                    font-bold

                                                    ${
                                                        isEarned
                                                            ? "text-emerald-700"
                                                            : "text-red-600"
                                                    }
                                                `}
                                            >
                                                {
                                                    displayedHours > 0
                                                        ? "+"
                                                        : ""
                                                }

                                                {displayedHours}h
                                            </p>

                                        </div>

                                        <p className="
                                            mt-4
                                            text-sm
                                            text-slate-500
                                        ">
                                            {
                                                formatDate(
                                                    transaction.createdAt
                                                )
                                            }
                                        </p>

                                    </div>
                                );
                            }
                        )
                    )}

                </div>

            </div>

        </main>
    );
}