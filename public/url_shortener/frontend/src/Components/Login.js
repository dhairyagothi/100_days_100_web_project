import React from 'react'
import { useState } from 'react'
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { endpoints} from '../utils/api';



export default function Login() {
  const navigate = useNavigate();
  const [error, seterror] = useState("");
  const [success, setsuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const [Logindata, setLogindata] = useState({
    email: "",
    password: ""
  })

  const onChaneHandler = (e) => {
    setLogindata({
      ...Logindata, [e.target.name]: e.target.value
    })
  }


  const SubmitHandler = async (e) => {
    e.preventDefault()
    seterror("")
    setLoading(true) // ✅ start loading

    const response = await fetch(endpoints.LOGIN, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify(Logindata)
    })

    const data = await response.json()

    if (!response.ok) {
      seterror(data.msg)
      setLoading(false) // ✅ stop loading
    }
    else {
      setsuccess(data.msg)

      setTimeout(() => {
        navigate("/");
      }, 2000)
    }
  }

  return (
    <>





      <Helmet>
        <title>Login </title>

        <meta
          name="description"
          content="Login to App Nests to manage your shortened links, track analytics, and access your personalized app ecosystem."
        />

        <meta
          name="keywords"
          content="login App Nests, user login, URL shortener login, secure login"
        />

        <meta property="og:title" content="Login - App Nests" />
        <meta
          property="og:description"
          content="Access your App Nests dashboard and manage your links securely."
        />
      </Helmet>






      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center">

        {/* 🔥 LOADING OVERLAY */}
        {loading && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-white text-sm">Logging in...</p>
            </div>
          </div>
        )}

        {/* Container */}
        <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-lg">

          {/* Heading */}
          <h1 className="text-2xl font-semibold mb-6 text-center">
            Login to your account
          </h1>

          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-2 rounded-lg text-sm mb-4 text-center">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-500/10 border border-green-500 text-green-400 px-4 py-2 rounded-lg text-sm mb-4 text-center">
              {success}
            </div>
          )}

          {/* Form */}
          <form onSubmit={SubmitHandler} className="flex flex-col gap-4">

            {/* Email */}
            <div>
              <label className="block text-sm mb-1 text-zinc-400">
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                onChange={onChaneHandler}
                name='email'
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-500 transition"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm mb-1 text-zinc-400">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                onChange={onChaneHandler}
                name='password'
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-500 transition"
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading} // ✅ disable while loading
              className="bg-emerald-500 hover:bg-emerald-400 text-zinc-900 font-semibold py-2 rounded-lg transition"
            >
              {loading ? "Logging in..." : "Login"} {/* ✅ dynamic text */}
            </button>

          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-zinc-700"></div>
            <span className="text-sm text-zinc-500">or</span>
            <div className="flex-1 h-px bg-zinc-700"></div>
          </div>

          {/* Signup */}
          <p className="text-center text-sm text-zinc-400">
            Don’t have an account?{" "}
            <button className="text-emerald-400 hover:text-emerald-300"
              onClick={() => { window.location.href = "/signup" }}
            >
              Sign up
            </button>
          </p>

        </div>
      </div>

    </>
  );
}
