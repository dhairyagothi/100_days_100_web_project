import React from 'react'
import Link from 'next/link'
import { FaYoutube } from 'react-icons/fa'
import SlideUp from './SlideUp'

const recipes = [
    {
        name: "Detailed Recipe of Mango Smoothie",
        description:"Here is the Detailed Video Recipe",
        image:"https://recipesforthermomix.com/recipes-images/mango-smoothie-thermomix-thumb.jpg",
        link:"https://youtu.be/FYTHVTpGiUA?si=YUbWp6TIQgzLG5pB",
    },
    {
        name: "Detailed Recipe of White-Sauce Pasta",
        description:"Here is the Detailed Video Recipe",
        image:"https://spicysouthernkitchen.com/wp-content/uploads/French-Onion-Pasta-c-684x684.jpg",
        link:"https://youtu.be/gEYcNs9QenI?si=dJfoscd_3-FQXHiJ",
    },
    {
        name: "Detailed Recipe of Suji Halwa Recipe",
        description:"Here is the Detailed Video Recipe",
        image:"https://images.healthshots.com/healthshots/en/uploads/2022/10/02113806/SUJI-HALWA.jpg",
        link:"https://youtu.be/Iz_LieYpY9k?si=2izpiLyWXdqboeyC",
    },
    {
        name: "Detailed Recipe of fried Chana Chaat",
        description:"Here is the Detailed Video Recipe",
        image:"https://foodsandflavorsbyshilpi.com/wp-content/uploads/2021/04/FB-Thumnails-website-old-2021-08-27T223801.583.jpg",
        link:"https://youtu.be/TtK0UinxTE8?si=vfCh2ErA1PBGQFJC",

    },
]

export const RecipeSection = () => {
  return (
    <section id="recipes">
        <h1 className="text-center font-bold text-4xl">
            Detailed Recipe
            <hr className="w-6 h-1 mx-auto my-4 bg-rose-950 border-0 rounded"></hr>
        </h1>
        <div className="flex flex-col space-y-28">
            {recipes.map((recipes, idx) => {
                return (
                    <div key={idx}>
                        <SlideUp offset="-300px 0px -400px 0px"></SlideUp>
                        <div className="flex flex-col animate-slideUpCubicBezier animation-delay-3 md:flex-row md:space-x-12">
                            <div className="mt-8 md:w-1/2">
                            <img
                               src={recipes.image}
                               alt=""
                               width={1000}
                               height={1000}
                               className="rounded-xl shadow-xl hover:opacity-70"
                            /> <Link href={recipes.link} target="_blank"></Link>
                            </div>
                                <div className="mt-12 md:w-1/2">
                                    <h1 className="text-4xl font-bold mb-6">{recipes.name}</h1>
                                    <p>{recipes.description}
                                    </p>
                                    <div>
                                        <Link href={recipes.link} target="_blank">
                                          <FaYoutube size={30}
                                            className="hover:-translate-y-1 ransition-transform cursor-pointer"
                                          />
                                        </Link>
                                    </div>
                               </div>
                            </div>
                        </div>
                )
            })}

        </div>

    </section>
  )
}

