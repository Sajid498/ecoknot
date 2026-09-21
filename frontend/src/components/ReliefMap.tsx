"use client";


import {
    useEffect,
    useState
} from "react";


import {
    MapContainer,
    TileLayer,
    Marker,
    Popup
} from "react-leaflet";


import {
    RescueDonation
} from "@/types/rescue";








interface Props{


    rescues:RescueDonation[];


}









export default function ReliefMap({

    rescues

}:Props){





    const [markerIcon,setMarkerIcon] =

        useState<any>(null);







    useEffect(()=>{



        async function loadIcon(){


            const leaflet =

                await import("leaflet");





            const icon =

                new leaflet.Icon({



                    iconUrl:

                    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",




                    iconRetinaUrl:

                    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",




                    shadowUrl:

                    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",




                    iconSize:[25,41],




                    iconAnchor:[12,41],



                });





            setMarkerIcon(icon);



        }





        loadIcon();



    },[]);












    return(



<div className="
h-[450px]
w-full
overflow-hidden
rounded-3xl
shadow-lg
">







<MapContainer


center={[

23.8103,

90.4125

]}


zoom={12}


className="h-full w-full"


>







<TileLayer


url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"


/>









{

markerIcon &&

rescues.map((rescue)=>(



rescue.latitude !== null &&

rescue.longitude !== null &&




<Marker


key={rescue.id}


position={[

rescue.latitude,

rescue.longitude

]}


icon={markerIcon}


>







<Popup>


<div className="space-y-2">





<h2 className="
font-bold
text-lg
">

{rescue.title}

</h2>







<p>

📦 Quantity:

{rescue.quantity}

</p>







<p>

📍 Location:

{rescue.location}

</p>







<p>

🌱 Type:

{rescue.type}

</p>







</div>


</Popup>







</Marker>



))


}








</MapContainer>






</div>



    );


}