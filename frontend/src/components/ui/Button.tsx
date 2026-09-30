import React from "react";


interface ButtonProps {

    children: React.ReactNode;

    type?: "button" | "submit";

    variant?:
        "primary"
        |
        "secondary"
        |
        "danger";

    className?: string;

    onClick?: () => void;

}



export default function Button({

    children,

    type="button",

    variant="primary",

    className="",

    onClick

}: ButtonProps){



    const styles = {


        primary:
        `
        bg-green-600
        text-white
        hover:bg-green-700
        `,


        secondary:
        `
        bg-sky-600
        text-white
        hover:bg-sky-700
        `,


        danger:
        `
        bg-red-600
        text-white
        hover:bg-red-700
        `


    };



    return (

        <button

            type={type}

            onClick={onClick}

            className={`
                px-5
                py-2.5
                rounded-xl
                font-semibold
                transition
                duration-200
                ${styles[variant]}
                ${className}
            `}

        >

            {children}

        </button>

    );

}