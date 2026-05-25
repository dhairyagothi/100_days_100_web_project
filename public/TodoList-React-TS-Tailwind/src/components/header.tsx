import React from "react"
import { FaSun } from "react-icons/fa6";
import { FaMoon } from "react-icons/fa6";

interface ChildComponentProps {
    isDarkModeOn: boolean;
    toggleDarkMode: () => void
}

const Header: React.FC<ChildComponentProps> = ({isDarkModeOn, toggleDarkMode}) => {
    return (
        <header className="flex justify-between py-3 px-5 bg-slate-200 dark:bg-slate-800">
            <h1 className="text-2xl font-bold text-blue-600 dark:text-red-500">Todolist</h1>
            <div className="flex gap-4">
                <button className="bg-blue-600 dark:bg-red-500 text-slate-50 py-1 px-2 rounded-lg" onClick={()=>{window.print()}}>Export</button>
                <button className="bg-blue-600 dark:bg-red-500 text-slate-50 py-1 px-2 rounded-lg" onClick={()=>{toggleDarkMode()}}>
                    { isDarkModeOn ? <FaSun /> : <FaMoon /> }
                </button>
            </div>
        </header>
    )
}

export default Header