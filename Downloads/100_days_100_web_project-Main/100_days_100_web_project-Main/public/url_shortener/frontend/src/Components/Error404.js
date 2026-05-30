
import { Helmet } from "react-helmet";



export default function Error404() {


  return (

    <>  <Helmet>
      <title>Page Not Found</title>

      <meta
        name="description"
        content="The page you are looking for does not exist. Go back and continue using App Nests."
      />

      <meta
        name="robots"
        content="noindex, nofollow"
      />

      <meta property="og:title" content="404 - Page Not Found" />
      <meta
        property="og:description"
        content="Oops! This page does not exist on App Nests."
      />
    </Helmet>


      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center px-4">

        {/* Big 404 */}
        <h1 className="text-[120px] font-bold text-zinc-800 animate-pulse">
          404
        </h1>

        {/* Message */}
        <p className="text-xl text-zinc-300 mt-2 text-center">
          Page not found
        </p>

        <p className="text-sm text-zinc-500 mt-1 text-center max-w-md">
          The page you are looking for doesn’t exist or has been moved.
        </p>

        {/* Button */}
        <button
          onClick={() => window.location.href = "/"}
          className="mt-6 bg-emerald-500 hover:bg-emerald-400 text-zinc-900 font-semibold px-5 py-2 rounded-lg transition-all duration-300 hover:scale-105 active:scale-95"
        >
          Go Back Home
        </button>

        {/* Floating animation elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">

          <div className="w-32 h-32 bg-emerald-500/10 rounded-full absolute top-20 left-10 animate-bounce"></div>

          <div className="w-24 h-24 bg-emerald-400/10 rounded-full absolute bottom-20 right-10 animate-ping"></div>

          <div className="w-16 h-16 bg-zinc-700/20 rounded-full absolute top-1/2 left-1/3 animate-pulse"></div>

        </div>

      </div>

    </>
  );
}
