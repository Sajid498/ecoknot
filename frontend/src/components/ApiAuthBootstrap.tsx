import Script from "next/script";


const API_URL =
    process.env.NEXT_PUBLIC_API_URL
    ||
    "http://localhost:8080";


export default function ApiAuthBootstrap() {


    const script = `

(function () {

    if (window.__ECOKNOT_AUTH_FETCH_INSTALLED__) {
        return;
    }

    window.__ECOKNOT_AUTH_FETCH_INSTALLED__ = true;

    const API_URL =
        "${API_URL}";

    const originalFetch =
        window.fetch.bind(window);


    function isAuthEndpoint(url) {

        return (
            url.includes("/api/users/login")
            ||
            url.includes("/api/users/signup")
        );

    }


    window.fetch =
        async function(input, init) {

            const url =
                typeof input === "string"

                    ?

                    input

                    :

                    input instanceof Request

                        ?

                        input.url

                        :

                        String(input);


            if (
                !url.startsWith(API_URL)
                ||
                isAuthEndpoint(url)
            ) {

                return originalFetch(
                    input,
                    init
                );

            }


            const token =
                localStorage.getItem(
                    "token"
                );


            if (!token) {

                return originalFetch(
                    input,
                    init
                );

            }


            const headers =
                new Headers(

                    input instanceof Request

                        ?

                        input.headers

                        :

                        undefined

                );


            if (init?.headers) {

                new Headers(
                    init.headers
                ).forEach(
                    (value,key) => {

                        headers.set(
                            key,
                            value
                        );

                    }
                );

            }


            if (
                !headers.has(
                    "Authorization"
                )
            ) {

                headers.set(

                    "Authorization",

                    "Bearer " + token

                );

            }


            const response =
                await originalFetch(

                    input,

                    {
                        ...init,
                        headers
                    }

                );


            if (
                response.status === 401
                &&
                localStorage.getItem(
                    "token"
                )
            ) {

                localStorage.removeItem(
                    "token"
                );

                localStorage.removeItem(
                    "user"
                );

                localStorage.removeItem(
                    "activeModule"
                );


                if (
                    window.location.pathname
                    !==
                    "/login"
                ) {

                    window.location.href =
                        "/login";

                }

            }


            return response;

        };

})();

`;


    return (

        <Script

            id="ecoknot-api-auth-bootstrap"

            strategy="beforeInteractive"

        >

            {script}

        </Script>

    );

}