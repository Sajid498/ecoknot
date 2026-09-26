"use client";


import Link from "next/link";

import {
  useEffect,
  useState
} from "react";



export default function Home() {


  const [user,setUser] =
    useState<any>(null);


  const [checkingAuth,setCheckingAuth] =
    useState(true);





  useEffect(()=>{


    const savedUser =
      localStorage.getItem(
        "user"
      );


    const token =
      localStorage.getItem(
        "token"
      );


    if(
      !savedUser
      ||
      !token
    ){


      setUser(
        null
      );


      setCheckingAuth(
        false
      );


      return;


    }





    try{


      const parsedUser =
        JSON.parse(
          savedUser
        );


      if(
        parsedUser?.id
        &&
        parsedUser?.email
        &&
        !isJwtExpired(
          token
        )
      ){


        setUser(
          parsedUser
        );


      }
      else{


        clearSession();


        setUser(
          null
        );


      }


    }
    catch(error){


      console.log(
        "Invalid homepage session:",
        error
      );


      clearSession();


      setUser(
        null
      );


    }





    setCheckingAuth(
      false
    );


  },[]);









  if(checkingAuth){


    return(


      <main className="
      min-h-screen
      bg-white
      ">


        <div className="
        flex
        min-h-screen
        items-center
        justify-center
        text-slate-500
        ">


          Loading EcoKnot...


        </div>


      </main>


    );


  }







  return(


    <main className="
    min-h-screen
    bg-white
    ">





      {/* HERO SECTION */}

      <section className="
      relative
      overflow-hidden
      bg-gradient-to-br
      from-emerald-50
      via-white
      to-teal-50
      ">





        <div className="
        absolute
        -left-32
        top-20
        h-72
        w-72
        rounded-full
        bg-emerald-200/30
        blur-3xl
        "/>





        <div className="
        absolute
        -right-32
        bottom-10
        h-80
        w-80
        rounded-full
        bg-teal-200/30
        blur-3xl
        "/>








        <div className={`
        relative
        mx-auto
        grid
        max-w-7xl
        items-center
        gap-14
        px-6
        py-16
        lg:grid-cols-2
        lg:py-24

        ${
          user

          ?

          "min-h-[calc(100vh-73px)]"

          :

          "min-h-screen"
        }
        `}>









          {/* LEFT SIDE */}

          <div>





            <div className="
            mb-6
            inline-flex
            items-center
            rounded-full
            border
            border-emerald-200
            bg-emerald-100/70
            px-4
            py-2
            text-sm
            font-semibold
            text-emerald-800
            ">


              One Platform. Infinite Impact.


            </div>









            <h1 className="
            max-w-3xl
            text-5xl
            font-bold
            leading-tight
            tracking-tight
            text-slate-950
            md:text-6xl
            ">


              {

                user

                ?

                <>


                  Welcome back


                  <span className="
                  block
                  text-emerald-700
                  ">


                    {user.name} 👋


                  </span>


                </>


                :

                <>


                  Stronger communities


                  <span className="
                  block
                  text-emerald-700
                  ">


                    start with connection.


                  </span>


                </>

              }


            </h1>









            <p className="
            mt-6
            max-w-2xl
            text-lg
            leading-8
            text-slate-600
            ">


              {

                user

                  ?

                  "Ready to make an impact? Manage your activities and help the community."

                  :

                  "EcoKnot brings blood donation, transparent fundraising, resource sharing, relief support, volunteer time exchange, and community communication together in one trusted platform."

              }


            </p>









            {/* ACTION BUTTONS */}

            <div className="
            mt-9
            flex
            flex-wrap
            gap-4
            ">


              {

                user

                  ?

                  <>





                    <Link

                      href="/blood-donation"

                      className="
                      rounded-xl
                      bg-emerald-700
                      px-7
                      py-3.5
                      font-semibold
                      text-white
                      shadow-lg
                      shadow-emerald-700/20
                      transition
                      hover:-translate-y-0.5
                      hover:bg-emerald-800
                      "

                    >


                      Create Blood Request


                    </Link>








                    <Link

                      href="/rescue"

                      className="
                      rounded-xl
                      border
                      border-slate-300
                      bg-white
                      px-7
                      py-3.5
                      font-semibold
                      text-slate-800
                      transition
                      hover:border-emerald-600
                      hover:text-emerald-700
                      "

                    >


                      Explore Relief Hub


                    </Link>




                  </>


                  :

                  <>





                    <Link

                      href="/login"

                      className="
                      rounded-xl
                      bg-emerald-700
                      px-7
                      py-3.5
                      font-semibold
                      text-white
                      shadow-lg
                      shadow-emerald-700/20
                      transition
                      hover:-translate-y-0.5
                      hover:bg-emerald-800
                      "

                    >


                      Log In


                    </Link>








                    <Link

                      href="/signup"

                      className="
                      rounded-xl
                      border
                      border-emerald-700
                      bg-white
                      px-7
                      py-3.5
                      font-semibold
                      text-emerald-700
                      transition
                      hover:-translate-y-0.5
                      hover:bg-emerald-50
                      "

                    >


                      Sign Up


                    </Link>








                    <Link

                      href="/rescue"

                      className="
                      rounded-xl
                      border
                      border-slate-300
                      bg-white
                      px-7
                      py-3.5
                      font-semibold
                      text-slate-800
                      transition
                      hover:border-emerald-600
                      hover:text-emerald-700
                      "

                    >


                      Explore Community


                    </Link>




                  </>

              }


            </div>










            {/* STATISTICS */}

            <div className="
            mt-12
            grid
            max-w-xl
            grid-cols-3
            gap-6
            border-t
            border-slate-200
            pt-8
            ">





              <div>


                <p className="
                text-2xl
                font-bold
                text-slate-900
                ">


                  500+


                </p>


                <p className="
                mt-1
                text-sm
                text-slate-500
                ">


                  Community Members


                </p>


              </div>








              <div>


                <p className="
                text-2xl
                font-bold
                text-slate-900
                ">


                  120+


                </p>


                <p className="
                mt-1
                text-sm
                text-slate-500
                ">


                  Resources Shared


                </p>


              </div>








              <div>


                <p className="
                text-2xl
                font-bold
                text-slate-900
                ">


                  50+


                </p>


                <p className="
                mt-1
                text-sm
                text-slate-500
                ">


                  Lives Supported


                </p>


              </div>




            </div>




          </div>










          {/* RIGHT SIDE */}

          <div className="
          relative
          ">





            <div className="
            rounded-3xl
            border
            border-white
            bg-white/90
            p-7
            shadow-2xl
            shadow-slate-900/10
            backdrop-blur
            ">





              <div className="
              flex
              items-center
              justify-between
              ">





                <div>


                  <p className="
                  text-sm
                  font-semibold
                  uppercase
                  tracking-wider
                  text-emerald-700
                  ">


                    Community Hub


                  </p>




                  <h2 className="
                  mt-2
                  text-3xl
                  font-bold
                  text-slate-900
                  ">


                    How can you make an impact?


                  </h2>


                </div>





                <div className="
                h-3
                w-3
                rounded-full
                bg-emerald-500
                "/>




              </div>








              <p className="
              mt-3
              text-slate-600
              ">


                Find the service you need or choose how you want to help.


              </p>










              {/* MODULE CARDS */}

              <div className="
              mt-8
              grid
              auto-rows-fr
              gap-4
              sm:grid-cols-2
              ">








                <Link
                  href="/blood-donation"
                  className="h-full"
                >


                  <div className="
                  h-full
                  rounded-2xl
                  border
                  border-red-100
                  bg-red-50
                  p-5
                  transition
                  hover:-translate-y-1
                  hover:shadow-lg
                  ">


                    <div className="
                    mb-4
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-xl
                    bg-red-100
                    text-xl
                    ">


                      🩸


                    </div>




                    <h3 className="
                    font-bold
                    text-slate-900
                    ">


                      Blood Donation


                    </h3>




                    <p className="
                    mt-2
                    text-sm
                    leading-6
                    text-slate-600
                    ">


                      Create urgent requests or connect with blood donors.


                    </p>


                  </div>


                </Link>









                <Link
                  href="/fundraising"
                  className="h-full"
                >


                  <div className="
                  h-full
                  rounded-2xl
                  border
                  border-amber-100
                  bg-amber-50
                  p-5
                  transition
                  hover:-translate-y-1
                  hover:shadow-lg
                  ">


                    <div className="
                    mb-4
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-xl
                    bg-amber-100
                    text-xl
                    ">


                      🤝


                    </div>




                    <h3 className="
                    font-bold
                    text-slate-900
                    ">


                      Fundraising


                    </h3>




                    <p className="
                    mt-2
                    text-sm
                    leading-6
                    text-slate-600
                    ">


                      Create and support transparent donation campaigns.


                    </p>


                  </div>


                </Link>









                <Link
                  href="/resources"
                  className="h-full"
                >


                  <div className="
                  h-full
                  rounded-2xl
                  border
                  border-emerald-100
                  bg-emerald-50
                  p-5
                  transition
                  hover:-translate-y-1
                  hover:shadow-lg
                  ">


                    <div className="
                    mb-4
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-xl
                    bg-emerald-100
                    text-xl
                    ">


                      ♻️


                    </div>




                    <h3 className="
                    font-bold
                    text-slate-900
                    ">


                      Resource Sharing


                    </h3>




                    <p className="
                    mt-2
                    text-sm
                    leading-6
                    text-slate-600
                    ">


                      Give useful community resources a second life.


                    </p>


                  </div>


                </Link>









                <Link
                  href="/rescue"
                  className="h-full"
                >


                  <div className="
                  h-full
                  rounded-2xl
                  border
                  border-orange-100
                  bg-orange-50
                  p-5
                  transition
                  hover:-translate-y-1
                  hover:shadow-lg
                  ">


                    <div className="
                    mb-4
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-xl
                    bg-orange-100
                    text-xl
                    ">


                      🌱


                    </div>




                    <h3 className="
                    font-bold
                    text-slate-900
                    ">


                      Relief Hub


                    </h3>




                    <p className="
                    mt-2
                    text-sm
                    leading-6
                    text-slate-600
                    ">


                      Connect surplus food and medicine with people before resources go to waste.


                    </p>


                  </div>


                </Link>









                <Link
                  href="/time-bank"
                  className="h-full"
                >


                  <div className="
                  h-full
                  rounded-2xl
                  border
                  border-blue-100
                  bg-blue-50
                  p-5
                  transition
                  hover:-translate-y-1
                  hover:shadow-lg
                  ">


                    <div className="
                    mb-4
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-xl
                    bg-blue-100
                    text-xl
                    ">


                      ⏳


                    </div>




                    <h3 className="
                    font-bold
                    text-slate-900
                    ">


                      Time Bank


                    </h3>




                    <p className="
                    mt-2
                    text-sm
                    leading-6
                    text-slate-600
                    ">


                      Exchange skills and volunteer hours using community time credits.


                    </p>


                  </div>


                </Link>






              </div>




            </div>


          </div>





        </div>


      </section>



    </main>

  );

}






function clearSession(){


  localStorage.removeItem(
    "user"
  );


  localStorage.removeItem(
    "token"
  );


  localStorage.removeItem(
    "activeModule"
  );


}






function isJwtExpired(
  token:string
){


  try{


    const parts =
      token.split(
        "."
      );


    if(parts.length !== 3){


      return true;


    }





    const payload =
      JSON.parse(

        decodeURIComponent(

          atob(
            parts[1]
              .replace(
                /-/g,
                "+"
              )
              .replace(
                /_/g,
                "/"
              )
          )
          .split("")
          .map(

            char =>

              "%"

              +

              (
                "00"
                +
                char
                  .charCodeAt(0)
                  .toString(16)
              )
              .slice(-2)

          )
          .join("")

        )

      );





    if(!payload.exp){


      return true;


    }





    return (

      payload.exp * 1000

      <=

      Date.now()

    );


  }
  catch(error){


    console.log(
      "Homepage JWT validation error:",
      error
    );


    return true;


  }


}