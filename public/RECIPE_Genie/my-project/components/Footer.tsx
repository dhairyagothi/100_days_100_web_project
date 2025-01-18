import React from 'react'
import { AiOutlineYoutube } from "react-icons/ai"

export const Footer = () => {
  return (
    <footer className= " mx-auto max-w-3xl px-4 sm:px-6 md:max-w-5xl">
        <hr className = " w-full h-0.5 mx-auto mt-8 bg-neutral-200 border-0"></hr>
            <div className="mx-auto p-4 flex flex-col text-center text-neutral-500 md:flex-row md:justify-between">
                <div className="text-neutral-500 dark:text-neutral-500">Find More Recipes on YouTube</div>
                <div className="flex flex-row items-center justify-center space-x-2 mb-1 bg-transparent">
                    <a href="https://www.youtube.com/" rel="noreferrer" target="_blank">
                        <AiOutlineYoutube 
                           className="hover:-translate-y-1 transition-transform cursor-pointer bg-transparent" size={30} />
                    </a>
                </div>
            </div>
    </footer>
  )
}
