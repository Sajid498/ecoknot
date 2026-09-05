"use client";

import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useEffect, useState } from "react";


export default function Home() {


  const [user, setUser] = useState<any>(null);



  useEffect(() => {

    const savedUser = localStorage.getItem("user");


    if(savedUser){

      setUser(JSON.parse(savedUser));

    }

  }, []);




  return (

    <main className="min-h-screen bg-white">


      <Navbar />



      {/* Hero Section */}

      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-teal-50">


        <div className="absolute -left-32 top-20 h-72 w-72 rounded-full bg-emerald-200/30 blur-3xl" />

        <div className="absolute -right-32 bottom-10 h-80 w-80 rounded-full bg-teal-200/30 blur-3xl" />




        <div className="relative mx-auto grid min-h-[calc(100vh-73px)] max-w-7xl items-center gap-14 px-6 py-16 lg:grid-cols-2 lg:py-24">





          {/* Left Side */}


          <div>


            <div className="mb-6 inline-flex items-center rounded-full border border-emerald-200 bg-emerald-100/70 px-4 py-2 text-sm font-semibold text-emerald-800">

              One Platform. Infinite Impact.

            </div>






            <h1 className="max-w-3xl text-5xl font-bold leading-tight tracking-tight text-slate-950 md:text-6xl">


              {
                user ? (

                  <>

                    Welcome back

                    <span className="block text-emerald-700">

                      {user.name} 👋

                    </span>

                  </>


                ) : (

                  <>

                    Stronger communities

                    <span className="block text-emerald-700">

                      start with connection.

                    </span>

                  </>


                )
              }


            </h1>







            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">


              {
                user

                ?

                "Ready to make an impact? Manage your activities and help the community."

                :

                "EcoKnot brings blood donation, transparent fundraising, academic collaboration, resource sharing, and real-time communication together in one trusted community platform."

              }


            </p>







            {/* Buttons */}


            <div className="mt-9 flex flex-wrap gap-4">


              {
                user ? (

                  <>


                    <Link href="/blood-donation">


                      <button className="rounded-xl bg-emerald-700 px-7 py-3.5 font-semibold text-white shadow-lg shadow-emerald-700/20 transition hover:-translate-y-0.5 hover:bg-emerald-800">


                        Create Blood Request


                      </button>


                    </Link>





                    <Link href="/blood-donation">


                      <button className="rounded-xl border border-slate-300 bg-white px-7 py-3.5 font-semibold text-slate-800 transition hover:border-emerald-600 hover:text-emerald-700">


                        Explore Blood Donation


                      </button>


                    </Link>


                  </>


                )

                :

                (

                  <>


                    <Link href="/signup">


                      <button className="rounded-xl bg-emerald-700 px-7 py-3.5 font-semibold text-white shadow-lg shadow-emerald-700/20 transition hover:-translate-y-0.5 hover:bg-emerald-800">


                        Join EcoKnot


                      </button>


                    </Link>





                    <Link href="/blood-donation">


                      <button className="rounded-xl border border-slate-300 bg-white px-7 py-3.5 font-semibold text-slate-800 transition hover:border-emerald-600 hover:text-emerald-700">


                        Explore Community


                      </button>


                    </Link>


                  </>


                )

              }


            </div>







            {/* Statistics */}


            <div className="mt-12 grid max-w-xl grid-cols-3 gap-6 border-t border-slate-200 pt-8">


              <div>

                <p className="text-2xl font-bold text-slate-900">
                  500+
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Community Members
                </p>

              </div>




              <div>

                <p className="text-2xl font-bold text-slate-900">
                  120+
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Resources Shared
                </p>

              </div>




              <div>

                <p className="text-2xl font-bold text-slate-900">
                  50+
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Lives Supported
                </p>

              </div>



            </div>



          </div>









          {/* Right Side */}


          <div className="relative">


            <div className="rounded-3xl border border-white bg-white/90 p-7 shadow-2xl shadow-slate-900/10 backdrop-blur">



              <div className="flex items-center justify-between">


                <div>


                  <p className="text-sm font-semibold uppercase tracking-wider text-emerald-700">

                    Community Hub

                  </p>




                  <h2 className="mt-2 text-3xl font-bold text-slate-900">

                    How can you make an impact?

                  </h2>


                </div>



                <div className="h-3 w-3 rounded-full bg-emerald-500" />



              </div>






              <p className="mt-3 text-slate-600">

                Find the service you need or choose how you want to help.

              </p>






              <div className="mt-8 grid gap-4 sm:grid-cols-2">



                <Link href="/blood-donation">


                  <div className="group rounded-2xl border border-red-100 bg-red-50 p-5 transition hover:-translate-y-1 hover:shadow-lg">


                    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-red-100 text-xl">

                      🩸

                    </div>


                    <h3 className="font-bold text-slate-900">

                      Blood Donation

                    </h3>


                    <p className="mt-2 text-sm leading-6 text-slate-600">

                      Create urgent requests or connect with blood donors.

                    </p>


                  </div>


                </Link>





                <div className="rounded-2xl border border-amber-100 bg-amber-50 p-5">

                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-xl">

                    🤝

                  </div>

                  <h3 className="font-bold text-slate-900">
                    Fundraising
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Create and support transparent donation campaigns.
                  </p>

                </div>






                <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">

                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-xl">

                    📚

                  </div>

                  <h3 className="font-bold text-slate-900">
                    Academic Hub
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Share notes, materials, and academic knowledge.
                  </p>

                </div>







                <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5">


                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-xl">

                    ♻️

                  </div>


                  <h3 className="font-bold text-slate-900">
                    Resource Sharing
                  </h3>


                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Give useful community resources a second life.
                  </p>


                </div>



              </div>




            </div>


          </div>





        </div>


      </section>



    </main>

  );

}