import { useEffect, useState } from "react";

export default function App() {
  const [fact, setFact] = useState("Loading...");
  const generateFact = async () => {
    try{
      const res = await fetch("https://uselessfacts.jsph.pl/api/v2/facts/random");
      const data= await res.json();
      setFact(data.text);
    } catch(error){
      setFact("Failed to fetch fact")
    }
    
    useEffect(()=>{
      generateFact();
    }, []);
  };

  return (
    <div className="flex items-center justify-center mt-40">
      <div className="text-center bg-white shadow-2xl p-20 flex flex-col justify-center items-center gap-10 border border-gray-400 rounded-3xl">
        <div>
          <h1 className="font-bold text-4xl">💡</h1>
          <h1 className="font-bold text-4xl">
            Random <span className="text-violet-500">Fact</span> Generator
          </h1>
        </div>

        <p className="bg-violet-50 border border-violet-200 text-indigo-950 p-6 w-3xl wrap-break-word rounded-2xl font-medium">{fact}</p>

        <button
          onClick={generateFact}
          className="bg-gradient-to-r from-violet-600 to-pink-500 p-2 rounded-2xl text-white hover:from-violet-500 hover:to-pink-400 cursor-pointer"
        >
          Generate Fact
        </button>
      </div>
    </div>
  )
}