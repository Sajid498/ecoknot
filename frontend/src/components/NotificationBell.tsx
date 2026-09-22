"use client";


import {
    useEffect,
    useState
} from "react";





const API_URL =

    process.env.NEXT_PUBLIC_API_URL ||

    "http://localhost:8080";







interface Notification {


    id:number;


    message:string;


    type:string;


    readStatus:boolean;


    createdAt:string;


}









export default function NotificationBell(){



    const [notifications,setNotifications] =

        useState<Notification[]>([]);





    const [unreadCount,setUnreadCount] =

        useState(0);





    const [open,setOpen] =

        useState(false);





    const [userId,setUserId] =

        useState<number | null>(null);









    useEffect(()=>{


        const savedUser =

            localStorage.getItem("user");



        if(savedUser){



            const user =

                JSON.parse(savedUser);



            setUserId(

                user.id

            );



            loadNotifications(

                user.id

            );


        }



    },[]);









    async function loadNotifications(

        id:number

    ){



        try{


            const response =

                await fetch(

`${API_URL}/api/notifications/user/${id}`

                );





            const data =

                await response.json();





            setNotifications(data);





            const unread =

                data.filter(

                    (item:Notification)=>

                    !item.readStatus

                ).length;





            setUnreadCount(unread);



        }

        catch(error){


            console.log(

                "Notification error",

                error

            );


        }



    }









    async function markAsRead(

        id:number

    ){



        try{


            await fetch(

`${API_URL}/api/notifications/read/${id}`,

                {

                    method:"PUT"

                }

            );





            if(userId){


                loadNotifications(

                    userId

                );


            }



        }

        catch(error){


            console.log(error);


        }


    }









return(



<div className="
relative
">





<button

onClick={()=>setOpen(!open)}

className="
relative
rounded-xl
p-2
hover:bg-slate-100
transition
"

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
bg-red-500
text-xs
font-bold
text-white
"

>

{unreadCount}

</span>


}



</button>









{

open &&



<div

className="
absolute
right-0
mt-3
w-80
rounded-2xl
bg-white
shadow-xl
border
border-slate-200
z-50
"

>





<div

className="
border-b
p-4
font-bold
text-slate-900
"

>

🔔 Notifications

</div>









<div

className="
max-h-96
overflow-y-auto
"

>







{

notifications.length === 0 ?





<div

className="
p-5
text-center
text-slate-500
"

>

No notifications

</div>







:






notifications.map((notification)=>(



<div

key={notification.id}

onClick={()=>markAsRead(notification.id)}

className={`

cursor-pointer

border-b

p-4

hover:bg-slate-50

${

!notification.readStatus

?

"bg-emerald-50"

:

""

}

`}

>




<p

className="
text-sm
font-medium
text-slate-800
"

>

{notification.message}

</p>





<p

className="
mt-2
text-xs
text-slate-500
"

>

{

new Date(

notification.createdAt

)

.toLocaleString()

}

</p>





</div>



))


}




</div>







</div>


}





</div>



);


}