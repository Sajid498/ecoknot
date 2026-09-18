"use client";


import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";





const API_URL =
    "http://localhost:8080";






export default function Navbar() {



  const router = useRouter();





  const [user,setUser] =
    useState<any>(null);



  const [activeModule,setActiveModule] =
    useState("");



  const [unreadCount,setUnreadCount] =
    useState(0);









  useEffect(()=>{


    const savedUser =
      localStorage.getItem("user");



    if(savedUser){


      const userData =
        JSON.parse(savedUser);



      setUser(
        userData
      );



      loadUnreadCount(
        userData.id
      );


    }







    const savedModule =
      localStorage.getItem("activeModule");



    if(savedModule){


      setActiveModule(
        savedModule
      );


    }



  },[]);









  async function loadUnreadCount(
      userId:number
  ){


    try{


      const response =
        await fetch(

          `${API_URL}/api/notifications/unread-count/${userId}`

        );



      if(!response.ok){

        return;

      }




      const data =
        await response.json();




      setUnreadCount(
        data.count
      );



    }
    catch(error){


      console.log(error);


    }


  }









  const isBloodSection =
      activeModule === "blood";









  const handleLogout = () => {


    localStorage.removeItem("user");

    localStorage.removeItem("activeModule");


    setUser(null);

    setActiveModule("");

    setUnreadCount(0);



    router.push("/login");


  };









  const handleBackToMain = () => {


    localStorage.removeItem(
      "activeModule"
    );


    setActiveModule("");

    router.push("/");


  };









  const handleLogoClick = () => {


    localStorage.removeItem(
      "activeModule"
    );


    setActiveModule("");


  };
return (

<header className="
sticky
top-0
z-50
border-b
border-slate-200
bg-white/95
backdrop-blur
">


<div className="
mx-auto
flex
max-w-7xl
items-center
justify-between
px-6
py-4
">







<Link

href="/"

onClick={handleLogoClick}

className="flex items-center gap-2"

>


<div className="
flex
h-10
w-10
items-center
justify-center
rounded-xl
bg-emerald-700
text-lg
font-bold
text-white
">

E

</div>




<div>


<h1 className="
text-xl
font-bold
text-slate-900
">

EcoKnot

</h1>



<p className="
text-xs
text-slate-500
">

Community Connected

</p>



</div>


</Link>









<nav className="
hidden
items-center
gap-7
lg:flex
">



{

isBloodSection ?


<>


<button

onClick={handleBackToMain}

className="
text-sm
font-semibold
text-slate-600
hover:text-emerald-700
"

>

← Main Menu

</button>






<Link

href="/blood-donation"

className="
text-sm
font-semibold
text-emerald-700
"

>

🩸 Blood Donation

</Link>






<Link

href="/my-requests"

className="
text-sm
font-medium
text-slate-600
hover:text-emerald-700
"

>

📋 My Requests

</Link>






<Link

href="/my-donations"

className="
text-sm
font-medium
text-slate-600
hover:text-emerald-700
"

>

❤️ My Donations

</Link>






<Link

href="/donation-history"

className="
text-sm
font-medium
text-slate-600
hover:text-emerald-700
"

>

🩸 Donation History

</Link>






<Link

href="/messages"

className="
text-sm
font-medium
text-slate-600
hover:text-emerald-700
"

>

💬 Messages

</Link>



</>



:



<>


<Link

href="/"

className="
text-sm
font-semibold
text-emerald-700
"

>

Home

</Link>






<Link

href="/blood-donation"

className="
text-sm
font-medium
text-slate-600
hover:text-emerald-700
"

>

Blood Donation

</Link>






<Link

href="#"

className="
text-sm
font-medium
text-slate-600
hover:text-emerald-700
"

>

Campaigns

</Link>






<Link

href="#"

className="
text-sm
font-medium
text-slate-600
hover:text-emerald-700
"

>

Resources

</Link>






<Link

href="#"

className="
text-sm
font-medium
text-slate-600
hover:text-emerald-700
"

>

Academic Hub

</Link>



</>


}


</nav>









<div className="
flex
items-center
gap-3
">






{

user ?


<>


{/* Notification Bell with Badge */}


<Link

href="/notifications"

className="
relative
rounded-lg
p-2
text-xl
text-slate-700
transition
hover:bg-emerald-50
hover:text-emerald-700
"

title="Notifications"

>


🔔



{

unreadCount > 0 &&


<span

className="
absolute
-right-1
-top-1
flex
h-5
w-5
items-center
justify-center
rounded-full
bg-red-600
text-xs
font-bold
text-white
"

>

{unreadCount}

</span>


}



</Link>









<span className="
hidden
text-sm
font-semibold
text-slate-700
sm:block
">

{user.name}

</span>









<Link href="/profile">


<button

className="
rounded-lg
px-4
py-2
text-sm
font-semibold
text-slate-700
hover:bg-slate-100
"

>

Profile

</button>


</Link>









<button

onClick={handleLogout}

className="
rounded-lg
bg-emerald-700
px-5
py-2.5
text-sm
font-semibold
text-white
hover:bg-emerald-800
"

>

Logout

</button>



</>





:





<>


<Link href="/login">


<button

className="
hidden
rounded-lg
px-4
py-2
text-sm
font-semibold
text-slate-700
hover:bg-slate-100
sm:block
"

>

Log In

</button>


</Link>








<Link href="/signup">


<button

className="
rounded-lg
bg-emerald-700
px-5
py-2.5
text-sm
font-semibold
text-white
"

>

Sign Up

</button>


</Link>


</>


}



</div>






</div>


</header>


);



}