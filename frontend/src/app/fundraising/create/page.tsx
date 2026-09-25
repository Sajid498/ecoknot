"use client";

import {
    useState
} from "react";

import {
    useRouter
} from "next/navigation";

import {
    categoryLabels,
    FundCategory
} from "@/lib/fundraising";

const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:8080";

type FundForm = {
    title: string;
    category: FundCategory;
    description: string;
    location: string;
    beneficiary: string;
    contact: string;
    goalAmount: string;
};

export default function CreateFundraiser() {

    const router =
        useRouter();

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");

    const [form, setForm] =
        useState<FundForm>({
            title: "",
            category: "MEDICAL",
            description: "",
            location: "",
            beneficiary: "",
            contact: "",
            goalAmount: ""
        });

    function change(
        e:
            React.ChangeEvent<
                HTMLInputElement |
                HTMLSelectElement |
                HTMLTextAreaElement
            >
    ) {

        const {
            name,
            value
        } = e.target;

        setForm(
            previous => ({
                ...previous,
                [name]: value
            })
        );
    }

    async function submit(
        e: React.FormEvent
    ) {

        e.preventDefault();

        setError("");

        const savedUser =
            localStorage.getItem("user");

        if (!savedUser) {

            router.push("/login");

            return;
        }

        let user;

        try {

            user =
                JSON.parse(savedUser);

        } catch {

            localStorage.removeItem("user");

            router.push("/login");

            return;
        }

        if (!user?.id) {

            setError(
                "Unable to identify the logged-in user."
            );

            return;
        }

        const goalAmount =
            Number(form.goalAmount);

        if (
            Number.isNaN(goalAmount) ||
            goalAmount <= 0
        ) {

            setError(
                "Target amount must be greater than 0."
            );

            return;
        }

        const payload = {
            title:
                form.title.trim(),

            category:
                form.category,

            description:
                form.description.trim(),

            beneficiary:
                form.beneficiary.trim(),

            location:
                form.location.trim(),

            contactNumber:
                form.contact.trim(),

            goalAmount:
                goalAmount
        };

        try {

            setSaving(true);

            const response =
                await fetch(
                    `${API_URL}/api/funds/user/${user.id}`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(
                                payload
                            )
                    }
                );

            if (!response.ok) {

                const message =
                    await response.text();

                throw new Error(
                    message ||
                    "Failed to create campaign."
                );
            }

            await response.json();

            router.push(
                "/fundraising/my-campaigns"
            );

        } catch (error) {

            console.error(
                "Fundraising creation error:",
                error
            );

            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to create campaign."
            );

        } finally {

            setSaving(false);
        }
    }

    return (

        <main className="
            min-h-screen
            bg-slate-50
        ">

            <form
                onSubmit={submit}
                className="
                    mx-auto
                    max-w-3xl
                    px-6
                    py-10
                "
            >

                <div className="
                    rounded-3xl
                    bg-white
                    p-7
                    shadow-sm
                    ring-1
                    ring-slate-200
                ">

                    <h1 className="
                        text-3xl
                        font-bold
                    ">
                        Start a fundraiser
                    </h1>

                    <p className="
                        mt-2
                        text-slate-600
                    ">
                        Campaigns are reviewed before they are published.
                        Share only accurate, consented information.
                    </p>

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
                                font-medium
                                text-red-700
                            ">
                                {error}
                            </div>
                        )
                    }

                    <div className="
                        mt-7
                        grid
                        gap-5
                        md:grid-cols-2
                    ">

                        <input
                            required
                            name="title"
                            value={form.title}
                            onChange={change}
                            placeholder="Campaign title"
                            className="
                                rounded-xl
                                border
                                p-3
                                md:col-span-2
                            "
                        />

                        <select
                            name="category"
                            value={form.category}
                            onChange={change}
                            className="
                                rounded-xl
                                border
                                p-3
                            "
                        >

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

                        <input
                            required
                            name="goalAmount"
                            type="number"
                            min="1"
                            value={form.goalAmount}
                            onChange={change}
                            placeholder="Target amount (BDT)"
                            className="
                                rounded-xl
                                border
                                p-3
                            "
                        />

                        <input
                            required
                            name="beneficiary"
                            value={form.beneficiary}
                            onChange={change}
                            placeholder="Beneficiary name"
                            className="
                                rounded-xl
                                border
                                p-3
                            "
                        />

                        <input
                            required
                            name="location"
                            value={form.location}
                            onChange={change}
                            placeholder="Location"
                            className="
                                rounded-xl
                                border
                                p-3
                            "
                        />

                        <input
                            required
                            name="contact"
                            value={form.contact}
                            onChange={change}
                            placeholder="Contact number"
                            className="
                                rounded-xl
                                border
                                p-3
                                md:col-span-2
                            "
                        />

                        <textarea
                            required
                            name="description"
                            value={form.description}
                            onChange={change}
                            rows={6}
                            placeholder="Explain the need, use of funds, and relevant verification details"
                            className="
                                rounded-xl
                                border
                                p-3
                                md:col-span-2
                            "
                        />

                    </div>

                    <button
                        disabled={saving}
                        className="
                            mt-7
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
                            saving
                                ? "Submitting…"
                                : "Submit for review"
                        }

                    </button>

                </div>

            </form>

        </main>
    );
}