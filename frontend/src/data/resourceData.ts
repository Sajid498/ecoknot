export type Resource = {

    id:number;

    user:string;

    title:string;

    description:string;

    category:string;

};





export const resources:Resource[] = [

    {

        id:1,

        user:"Sajid",

        title:"CSE Notes",

        description:"Programming notes",

        category:"Education"

    },


    {

        id:2,

        user:"Rahim",

        title:"Machine Learning Tutorial",

        description:"ML beginner resources",

        category:"AI"

    },


    {

        id:3,

        user:"Nafis",

        title:"Database Notes",

        description:"SQL and database materials",

        category:"Database"

    }

];