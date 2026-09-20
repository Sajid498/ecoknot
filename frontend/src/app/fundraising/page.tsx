"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { categoryLabels, currency, demoFunds, Fund, getFunds, saveFunds } from "@/lib/fundraising";

export default function FundraisingPage() {
  const [funds, setFunds] = useState<Fund[]>([]); const [category, setCategory] = useState("ALL");
  useEffect(() => setFunds(getFunds()), []);
  const visible = funds.filter(f => f.status === "APPROVED" && (category === "ALL" || f.category === category));
  return <main className="min-h-screen bg-slate-50"><Navbar /><section className="mx-auto max-w-7xl px-6 py-10">
    <div className="rounded-3xl bg-gradient-to-br from-emerald-800 to-teal-700 p-8 text-white shadow-xl md:p-12"><p className="font-semibold text-emerald-100">ECO KNOT FUNDRAISING</p><h1 className="mt-2 text-4xl font-bold">Give with confidence.</h1><p className="mt-3 max-w-2xl text-emerald-50">Verified community campaigns, transparent progress, and a receipt for every contribution.</p><Link href="/fundraising/create" className="mt-6 inline-block rounded-xl bg-white px-5 py-3 font-bold text-emerald-800">Start a fundraiser</Link></div>
    <div className="mt-8 flex flex-wrap items-center justify-between gap-4"><h2 className="text-2xl font-bold">Verified campaigns</h2><select value={category} onChange={e => setCategory(e.target.value)} className="rounded-xl border border-slate-300 bg-white p-3"><option value="ALL">All categories</option>{Object.entries(categoryLabels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></div>
    <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{visible.map(f => { const progress = Math.min(100, Math.round(f.raisedAmount / f.goalAmount * 100)); return <article key={f.id} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200"><div className="flex justify-between gap-3"><span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">{categoryLabels[f.category]}</span><span className="text-sm text-slate-500">{f.location}</span></div><h3 className="mt-4 text-xl font-bold text-slate-900">{f.title}</h3><p className="mt-2 line-clamp-2 text-sm text-slate-600">{f.description}</p><div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full bg-emerald-600" style={{ width: `${progress}%` }} /></div><div className="mt-2 flex justify-between text-sm"><b>{currency(f.raisedAmount)}</b><span className="text-slate-500">of {currency(f.goalAmount)}</span></div><Link href={`/fundraising/${f.id}`} className="mt-5 block rounded-xl border border-emerald-700 py-2 text-center font-semibold text-emerald-700 hover:bg-emerald-50">View campaign</Link></article>})}</div>
    {visible.length === 0 && <div className="mt-8 rounded-2xl bg-white p-10 text-center text-slate-500 shadow-sm"><p>No approved campaigns yet. New campaigns appear here after review.</p><button onClick={() => { const demo = demoFunds(); saveFunds(demo); setFunds(demo); }} className="mt-5 rounded-xl bg-emerald-700 px-5 py-3 font-bold text-white">Load sample fundraising demo</button><p className="mt-3 text-xs">This adds local sample data only; it does not create an account or process a payment.</p></div>}
  </section></main>;
}
