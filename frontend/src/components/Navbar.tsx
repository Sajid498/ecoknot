"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";


export default function Navbar() {


  const router = useRouter();


  const [user, setUser] = useState<any>(null);



  useEffect(() => {

    const savedUser = localStorage.getItem("user");


    if(savedUser){

      setUser(JSON.parse(savedUser));

    }

  }, []);




  const handleLogout = () => {


    localStorage.removeItem("user");


    setUser(null);


    router.push("/login");


  };





  return (

    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">

      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">



        {/* Logo */}

        <Link href="/" className="flex items-center gap-2">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-700 text-lg font-bold text-white">

            E

          </div>


          <div>

            <h1 className="text-xl font-bold text-slate-900">

              EcoKnot

            </h1>


            <p className="text-xs text-slate-500">

              Community Connected

            </p>


          </div>


        </Link>





        {/* Navigation */}

        <nav className="hidden items-center gap-7 lg:flex">


          <Link
            href="/"
            className="text-sm font-semibold text-emerald-700"
          >
            Home
          </Link>



          <Link
            href="/blood-donation"
            className="text-sm font-medium text-slate-600 transition hover:text-emerald-700"
          >
            Blood Donation
          </Link>




          <Link
            href="#"
            className="text-sm font-medium text-slate-600 transition hover:text-emerald-700"
          >
            Campaigns
          </Link>




          <Link
            href="#"
            className="text-sm font-medium text-slate-600 transition hover:text-emerald-700"
          >
            Resources
          </Link>




          <Link
            href="#"
            className="text-sm font-medium text-slate-600 transition hover:text-emerald-700"
          >
            Academic Hub
          </Link>



        </nav>





        {/* Authentication */}

        <div className="flex items-center gap-3">


          {
            user ? (

              <>


                <span className="hidden text-sm font-semibold text-slate-700 sm:block">

                  {user.name}

                </span>



               <Link href="/profile">

  <button className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">

    Profile

  </button>

</Link>



                <button

                  onClick={handleLogout}

                  className="rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800"

                >

                  Logout

                </button>


              </>


            ) : (


              <>


                <Link href="/login">

                  <button className="hidden rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 sm:block">

                    Log In

                  </button>

                </Link>




                <Link href="/signup">

                  <button className="rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800">

                    Sign Up

                  </button>

                </Link>


              </>


            )

          }


        </div>



      </div>

    </header>

  );

}