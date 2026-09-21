"use client";


import {
    MapContainer,
    TileLayer,
    Marker,
    Popup
} from "react-leaflet";


import {
    Icon
} from "leaflet";


import {
    RescueDonation
} from "@/types/rescue";







interface Props{


    rescues:RescueDonation[];


}








const markerIcon = new Icon({


    iconUrl:

    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",



    iconRetinaUrl:

    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",



    shadowUrl:

    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",



    iconSize:[25,41],


    iconAnchor:[12,41],


});









export default function ReliefMap({

    rescues

}:Props){



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

rescues.map((rescue)=>(


rescue.latitude &&

rescue.longitude &&



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