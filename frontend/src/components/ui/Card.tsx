import React from "react";


interface CardProps {

    children: React.ReactNode;

    className?: string;

}



export default function Card({

    children,

    className = ""

}: CardProps) {


    return (

        <div

            className={`
                bg-white
                border
                border-slate-200
                rounded-2xl
                shadow-sm
                hover:shadow-md
                transition-all
                duration-200
                ${className}
            `}

        >

            {children}

        </div>

    );

}