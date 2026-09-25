"use client";

import Link from "next/link";

import {
    useEffect,
    useMemo,
    useState
} from "react";

import {
    useParams
} from "next/navigation";

import {
    categoryLabels,
    currency,
    FundCategory
} from "@/lib/fundraising";

const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:8080";

type CommentItem = {
    id: number;
    authorId: number;
    authorName: string;
    body: string;
    replyToId: number | null;
    createdAt: string;
};

type Contribution = {
    id: number;
    campaignId: number;
    campaignTitle: string;
    donorId: number;
    donorName: string;
    amount: number;
    paymentMethod: string;
    paymentReference: string;
    paymentStatus:
        | "PENDING"
        | "VERIFIED"
        | "FAILED"
        | "REFUNDED";
    createdAt: string;
    verifiedAt: string | null;
};

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
    status:
        | "PENDING_REVIEW"
        | "APPROVED"
        | "REJECTED"
        | "CLOSED";
    authorId: number;
    authorName: string;
    createdAt: string;
    reviewNote: string | null;
    reactionCount: number;
    comments: CommentItem[];
    contributions: Contribution[];
};

type LoggedInUser = {
    id: number;
    name?: string;
};

export default function FundDetails() {

    const params =
        useParams<{
            fundId: string;
        }>();

    const fundId =
        Number(params.fundId);

    const [fund, setFund] =
        useState<Campaign | null>(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [amount, setAmount] =
        useState("500");

    const [method, setMethod] =
        useState("bKash");

    const [paymentReference, setPaymentReference] =
        useState("");

    const [comment, setComment] =
        useState("");

    const [replyTo, setReplyTo] =
        useState<number | null>(null);

    const [submittingContribution, setSubmittingContribution] =
        useState(false);

    const [submittingComment, setSubmittingComment] =
        useState(false);

    const [contributionMessage, setContributionMessage] =
        useState("");

    const user =
        useMemo<LoggedInUser | null>(() => {

            if (typeof window === "undefined") {
                return null;
            }

            try {

                const savedUser =
                    localStorage.getItem("user");

                if (!savedUser) {
                    return null;
                }

                return JSON.parse(savedUser);

            } catch {

                return null;
            }

        }, []);

    useEffect(() => {

        if (!Number.isNaN(fundId)) {
            loadCampaign();
        }

    }, [fundId]);

    async function loadCampaign() {

        try {

            setLoading(true);
            setError("");

            const response =
                await fetch(
                    `${API_URL}/api/funds/${fundId}`
                );

            if (!response.ok) {

                const message =
                    await response.text();

                throw new Error(
                    message ||
                    "Campaign not found."
                );
            }

            const data: Campaign =
                await response.json();

            setFund(data);

        } catch (error) {

            console.error(
                "Fundraising details loading error:",
                error
            );

            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to load campaign."
            );

        } finally {

            setLoading(false);
        }
    }

    async function react() {

        if (!user?.id) {

            setError(
                "Please login to support this campaign."
            );

            return;
        }

        try {

            setError("");

            const response =
                await fetch(
                    `${API_URL}/api/funds/${fundId}/reactions/user/${user.id}`,
                    {
                        method: "POST"
                    }
                );

            if (!response.ok) {

                const message =
                    await response.text();

                throw new Error(
                    message ||
                    "Failed to update reaction."
                );
            }

            const data:
                {
                    reacted: boolean;
                    reactionCount: number;
                } =
                await response.json();

            setFund(
                current =>
                    current
                        ? {
                            ...current,
                            reactionCount:
                                data.reactionCount
                        }
                        : current
            );

        } catch (error) {

            console.error(
                "Reaction error:",
                error
            );

            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to update reaction."
            );
        }
    }

    async function submitComment(
        e: React.FormEvent
    ) {

        e.preventDefault();

        if (!user?.id) {

            setError(
                "Please login to post a comment."
            );

            return;
        }

        if (!comment.trim()) {
            return;
        }

        try {

            setSubmittingComment(true);
            setError("");

            const response =
                await fetch(
                    `${API_URL}/api/funds/${fundId}/comments/user/${user.id}`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify({
                                body:
                                    comment.trim(),

                                replyToId:
                                    replyTo
                            })
                    }
                );

            if (!response.ok) {

                const message =
                    await response.text();

                throw new Error(
                    message ||
                    "Failed to post comment."
                );
            }

            setComment("");
            setReplyTo(null);

            await loadCampaign();

        } catch (error) {

            console.error(
                "Comment error:",
                error
            );

            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to post comment."
            );

        } finally {

            setSubmittingComment(false);
        }
    }

    async function contribute() {

        if (!user?.id) {

            setError(
                "Please login before making a contribution."
            );

            return;
        }

        if (!fund) {
            return;
        }

        const value =
            Number(amount);

        if (
            Number.isNaN(value) ||
            value <= 0
        ) {

            setError(
                "Contribution amount must be greater than 0."
            );

            return;
        }

        if (!paymentReference.trim()) {

            setError(
                "Please enter your payment reference."
            );

            return;
        }

        try {

            setSubmittingContribution(true);

            setError("");

            setContributionMessage("");

            const response =
                await fetch(
                    `${API_URL}/api/funds/${fundId}/contributions/user/${user.id}`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify({
                                amount:
                                    String(value),

                                paymentMethod:
                                    method,

                                paymentReference:
                                    paymentReference.trim()
                            })
                    }
                );

            if (!response.ok) {

                const message =
                    await response.text();

                throw new Error(
                    message ||
                    "Failed to record contribution."
                );
            }

            setContributionMessage(
                "Contribution submitted successfully. It will be added to the raised amount after admin verification."
            );

            setPaymentReference("");

            await loadCampaign();

        } catch (error) {

            console.error(
                "Contribution error:",
                error
            );

            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to record contribution."
            );

        } finally {

            setSubmittingContribution(false);
        }
    }

    async function downloadReceipt(
        contributionId: number
    ) {

        if (!user?.id) {
            return;
        }

        try {

            setError("");

            const response =
                await fetch(
                    `${API_URL}/api/funds/contributions/${contributionId}/receipt/user/${user.id}`
                );

            if (!response.ok) {

                const message =
                    await response.text();

                throw new Error(
                    message ||
                    "Receipt is not available."
                );
            }

            const receipt: Contribution =
                await response.json();

            const content =
`EcoKnot Contribution Receipt

Campaign: ${receipt.campaignTitle}
Donor: ${receipt.donorName}
Amount: ${currency(Number(receipt.amount))}
Payment Method: ${receipt.paymentMethod}
Payment Reference: ${receipt.paymentReference}
Payment Status: ${receipt.paymentStatus}
Date: ${new Date(receipt.createdAt).toLocaleString()}
Verified At: ${
    receipt.verifiedAt
        ? new Date(
            receipt.verifiedAt
        ).toLocaleString()
        : "Not available"
}`;

            const blob =
                new Blob(
                    [content],
                    {
                        type: "text/plain"
                    }
                );

            const url =
                URL.createObjectURL(blob);

            const anchor =
                document.createElement("a");

            anchor.href =
                url;

            anchor.download =
                `receipt-${receipt.paymentReference}.txt`;

            anchor.click();

            URL.revokeObjectURL(
                url
            );

        } catch (error) {

            console.error(
                "Receipt error:",
                error
            );

            setError(
                error instanceof Error
                    ? error.message
                    : "Receipt is not available."
            );
        }
    }

    if (loading) {

        return (

            <main className="
                min-h-screen
                bg-slate-50
            ">

                <p className="
                    mx-auto
                    max-w-5xl
                    p-10
                    text-slate-500
                ">
                    Loading campaign...
                </p>

            </main>
        );
    }

    if (
        error &&
        !fund
    ) {

        return (

            <main className="
                min-h-screen
                bg-slate-50
            ">

                <p className="
                    mx-auto
                    max-w-5xl
                    p-10
                    text-red-600
                ">
                    {error}
                </p>

            </main>
        );
    }

    if (!fund) {

        return (

            <main className="
                min-h-screen
                bg-slate-50
            ">

                <p className="
                    mx-auto
                    max-w-5xl
                    p-10
                ">
                    Campaign not found.
                </p>

            </main>
        );
    }

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

    const myContributions =
        user?.id
            ? fund.contributions.filter(
                item =>
                    item.donorId === user.id
            )
            : [];

    return (

        <main className="
            min-h-screen
            bg-slate-50
        ">

            <section className="
                mx-auto
                grid
                max-w-6xl
                gap-7
                px-6
                py-10
                lg:grid-cols-[1.5fr_0.8fr]
            ">

                <article className="
                    rounded-3xl
                    bg-white
                    p-7
                    shadow-sm
                    ring-1
                    ring-slate-200
                ">

                    <Link
                        href="/fundraising"
                        className="
                            text-sm
                            font-semibold
                            text-emerald-700
                        "
                    >
                        ← All campaigns
                    </Link>

                    <span className="
                        ml-4
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

                    <h1 className="
                        mt-5
                        text-3xl
                        font-bold
                    ">
                        {fund.title}
                    </h1>

                    <p className="
                        mt-2
                        text-slate-500
                    ">
                        For{" "}
                        {fund.beneficiary}
                        {" · "}
                        {fund.location}
                    </p>

                    <p className="
                        mt-2
                        text-sm
                        text-slate-500
                    ">
                        Created by{" "}
                        {fund.authorName}
                    </p>

                    <p className="
                        mt-7
                        whitespace-pre-wrap
                        leading-7
                        text-slate-700
                    ">
                        {fund.description}
                    </p>

                    <div className="
                        mt-7
                        border-y
                        py-5
                    ">

                        <div className="
                            h-3
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
                            mt-3
                            flex
                            justify-between
                            gap-4
                        ">

                            <b className="
                                text-xl
                            ">
                                {
                                    currency(
                                        Number(
                                            fund.raisedAmount
                                        )
                                    )
                                }
                            </b>

                            <span className="
                                text-slate-600
                            ">
                                raised of{" "}
                                {
                                    currency(
                                        Number(
                                            fund.goalAmount
                                        )
                                    )
                                }
                                {" · "}
                                {progress}%
                            </span>

                        </div>

                    </div>

                    {
                        error && (

                            <div className="
                                mt-5
                                rounded-xl
                                border
                                border-red-200
                                bg-red-50
                                p-4
                                text-sm
                                text-red-700
                            ">
                                {error}
                            </div>
                        )
                    }

                    <button
                        onClick={react}
                        className="
                            mt-6
                            rounded-xl
                            border
                            px-4
                            py-2
                            font-semibold
                        "
                    >
                        ♡ Support
                        {" "}
                        ({fund.reactionCount})
                    </button>

                    <section className="
                        mt-8
                    ">

                        <h2 className="
                            text-xl
                            font-bold
                        ">
                            Community discussion
                        </h2>

                        <div className="
                            mt-4
                            space-y-3
                        ">

                            {
                                fund.comments.map(
                                    item => (

                                        <div
                                            key={item.id}
                                            className={`
                                                rounded-xl
                                                p-3
                                                text-sm

                                                ${
                                                    item.replyToId
                                                        ? "ml-6 bg-emerald-50"
                                                        : "bg-slate-50"
                                                }
                                            `}
                                        >

                                            <b>
                                                {
                                                    item.authorName
                                                }
                                            </b>

                                            <p className="
                                                mt-1
                                            ">
                                                {
                                                    item.body
                                                }
                                            </p>

                                            <p className="
                                                mt-1
                                                text-xs
                                                text-slate-400
                                            ">
                                                {
                                                    new Date(
                                                        item.createdAt
                                                    ).toLocaleString()
                                                }
                                            </p>

                                            {
                                                user?.id ===
                                                fund.authorId &&
                                                !item.replyToId && (

                                                    <button
                                                        onClick={() =>
                                                            setReplyTo(
                                                                item.id
                                                            )
                                                        }
                                                        className="
                                                            mt-2
                                                            text-xs
                                                            font-bold
                                                            text-emerald-700
                                                        "
                                                    >
                                                        Reply as campaign author
                                                    </button>
                                                )
                                            }

                                        </div>
                                    )
                                )
                            }

                            {
                                fund.comments.length === 0 && (

                                    <p className="
                                        text-sm
                                        text-slate-500
                                    ">
                                        No comments yet.
                                    </p>
                                )
                            }

                        </div>

                        <form
                            onSubmit={submitComment}
                            className="
                                mt-4
                            "
                        >

                            {
                                replyTo && (

                                    <div className="
                                        mb-2
                                        flex
                                        items-center
                                        justify-between
                                        rounded-lg
                                        bg-emerald-50
                                        px-3
                                        py-2
                                        text-sm
                                        text-emerald-800
                                    ">

                                        <span>
                                            Replying as campaign author
                                        </span>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setReplyTo(
                                                    null
                                                )
                                            }
                                            className="
                                                font-bold
                                            "
                                        >
                                            Cancel
                                        </button>

                                    </div>
                                )
                            }

                            <div className="
                                flex
                                gap-2
                            ">

                                <input
                                    value={comment}
                                    onChange={
                                        e =>
                                            setComment(
                                                e.target.value
                                            )
                                    }
                                    placeholder={
                                        replyTo
                                            ? "Write your reply"
                                            : "Ask a question or leave encouragement"
                                    }
                                    className="
                                        flex-1
                                        rounded-xl
                                        border
                                        p-3
                                    "
                                />

                                <button
                                    disabled={
                                        submittingComment
                                    }
                                    className="
                                        rounded-xl
                                        bg-slate-800
                                        px-4
                                        text-white
                                        disabled:opacity-50
                                    "
                                >
                                    {
                                        submittingComment
                                            ? "Posting..."
                                            : "Post"
                                    }
                                </button>

                            </div>

                        </form>

                    </section>

                </article>

                <aside className="
                    h-fit
                    rounded-3xl
                    bg-white
                    p-6
                    shadow-sm
                    ring-1
                    ring-slate-200
                ">

                    <h2 className="
                        text-xl
                        font-bold
                    ">
                        Make a contribution
                    </h2>

                    <p className="
                        mt-2
                        text-sm
                        text-slate-600
                    ">
                        Submit your payment information.
                        The raised amount updates after admin verification.
                    </p>

                    {
                        contributionMessage && (

                            <div className="
                                mt-5
                                rounded-xl
                                bg-emerald-50
                                p-4
                                text-sm
                                text-emerald-800
                            ">
                                {contributionMessage}
                            </div>
                        )
                    }

                    <label className="
                        mt-5
                        block
                        text-sm
                        font-semibold
                    ">

                        Amount (BDT)

                        <input
                            type="number"
                            min="1"
                            value={amount}
                            onChange={
                                e =>
                                    setAmount(
                                        e.target.value
                                    )
                            }
                            className="
                                mt-1
                                w-full
                                rounded-xl
                                border
                                p-3
                            "
                        />

                    </label>

                    <label className="
                        mt-4
                        block
                        text-sm
                        font-semibold
                    ">

                        Payment provider

                        <select
                            value={method}
                            onChange={
                                e =>
                                    setMethod(
                                        e.target.value
                                    )
                            }
                            className="
                                mt-1
                                w-full
                                rounded-xl
                                border
                                p-3
                            "
                        >
                            <option>
                                bKash
                            </option>

                            <option>
                                Nagad
                            </option>

                            <option>
                                Bank transfer
                            </option>
                        </select>

                    </label>

                    <label className="
                        mt-4
                        block
                        text-sm
                        font-semibold
                    ">

                        Payment reference

                        <input
                            value={
                                paymentReference
                            }
                            onChange={
                                e =>
                                    setPaymentReference(
                                        e.target.value
                                    )
                            }
                            placeholder="Transaction/reference ID"
                            className="
                                mt-1
                                w-full
                                rounded-xl
                                border
                                p-3
                            "
                        />

                    </label>

                    <div className="
                        mt-5
                        grid
                        place-items-center
                        rounded-2xl
                        border-2
                        border-dashed
                        border-emerald-300
                        bg-emerald-50
                        p-6
                        text-center
                    ">

                        <div className="
                            grid
                            h-28
                            w-28
                            place-items-center
                            rounded
                            bg-white
                            text-xs
                            font-bold
                            text-slate-700
                            shadow
                        ">
                            PAYMENT QR
                            <br />
                            {method}
                            <br />
                            {
                                currency(
                                    Number(amount) ||
                                    0
                                )
                            }
                        </div>

                        <p className="
                            mt-3
                            text-xs
                            text-slate-600
                        ">
                            Demo payment placeholder.
                            Enter the real transaction reference after payment.
                        </p>

                    </div>

                    <button
                        onClick={contribute}
                        disabled={
                            submittingContribution ||
                            fund.status !== "APPROVED"
                        }
                        className="
                            mt-5
                            w-full
                            rounded-xl
                            bg-emerald-700
                            py-3
                            font-bold
                            text-white
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                        "
                    >
                        {
                            submittingContribution
                                ? "Submitting..."
                                : "Submit contribution"
                        }
                    </button>

                    {
                        myContributions.length > 0 && (

                            <div className="
                                mt-7
                                border-t
                                pt-5
                            ">

                                <h3 className="
                                    font-bold
                                ">
                                    My contributions
                                </h3>

                                <div className="
                                    mt-3
                                    space-y-3
                                ">

                                    {
                                        myContributions.map(
                                            item => (

                                                <div
                                                    key={item.id}
                                                    className="
                                                        rounded-xl
                                                        bg-slate-50
                                                        p-3
                                                        text-sm
                                                    "
                                                >

                                                    <div className="
                                                        flex
                                                        justify-between
                                                        gap-3
                                                    ">

                                                        <b>
                                                            {
                                                                currency(
                                                                    Number(
                                                                        item.amount
                                                                    )
                                                                )
                                                            }
                                                        </b>

                                                        <span className="
                                                            text-xs
                                                            font-bold
                                                        ">
                                                            {
                                                                item.paymentStatus
                                                            }
                                                        </span>

                                                    </div>

                                                    <p className="
                                                        mt-1
                                                        text-xs
                                                        text-slate-500
                                                    ">
                                                        {
                                                            item.paymentMethod
                                                        }
                                                        {" · "}
                                                        {
                                                            item.paymentReference
                                                        }
                                                    </p>

                                                    {
                                                        item.paymentStatus ===
                                                        "VERIFIED" && (

                                                            <button
                                                                onClick={() =>
                                                                    downloadReceipt(
                                                                        item.id
                                                                    )
                                                                }
                                                                className="
                                                                    mt-2
                                                                    font-bold
                                                                    text-emerald-700
                                                                    underline
                                                                "
                                                            >
                                                                Download receipt
                                                            </button>
                                                        )
                                                    }

                                                </div>
                                            )
                                        )
                                    }

                                </div>

                            </div>
                        )
                    }

                </aside>

            </section>

        </main>
    );
}