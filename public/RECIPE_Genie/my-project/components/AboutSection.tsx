"use client"
import React from 'react';
import { Link } from "react-scroll";
import { useState } from 'react';


export const AboutSection = () => {
    const [flippedCard, setFlippedCard]= useState<number | null>(null);
    const handleCardHover = (index: number) => {
        setFlippedCard(index);
    };
    return (
        <div className="min-h-screen flex flex-col items-center justify-center">
            <h1 className="text-3xl font-bold mb-8 ">Some Recipes</h1>
            <div className="flex space-x-6">
                {/* Card 1 */}
                <div
                    onMouseEnter={() => handleCardHover(1)}
                    onMouseLeave={() => setFlippedCard(null)}
                    className="w-72 h-100 perspective"
                >
                    <div
                        className={`relative w-full h-full rounded-lg shadow-lg transform-style-preserve-3d transition-transform duration-500 ${
                            flippedCard === 1 ? "rotate-y-180" : ""
                        }`}
                    >
                        {/* Front Side */}
                        <div className="absolute w-full h-full bg-white rounded-lg p-6 flex flex-col justify-between items-center backface-hidden">
                            <img
                                className="w-full h-40 object-cover rounded-md"
                                src="https://th.bing.com/th/id/OIP.qgQSg9U4ihWmMbFgaAJhGwAAAA?rs=1&pid=ImgDetMain"
                                alt="Card 1"
                            />
                            <div className="mt-4">
                                <div className="font-bold text-xl text-amber-500">Mango Smoothie</div>
                                <p className="text-gray-700 text-base text-center mt-2">
                                    Hover Here For the Recipe....
                                </p>
                            </div>
                        </div>

                        {/* Back Side */}
                        <div className="absolute w-full h-full bg-pink-300 text-white rounded-lg p-6 flex items-center justify-center transform rotate-y-180 backface-hidden">
                            <div className="text-lg font-semi-bold ">
                                <p>
                                  Ingredients:<br></br>
                                  1 cup chopped mango
                                  1/2 cup yogurt
                                  1/2 cup milk
                                  Honey/sugar (optional)
                                  Ice cubes (optional) <br></br>
                                  Instructions:<br></br>
                                  Blend mango, yogurt, milk, and honey/sugar.
                                  Add ice cubes, blend again.
                                  Pour and enjoy!
                                   It's a tropical delight in a glass! 🥭</p>
                            </div>
                        </div>
                    </div>
                </div>
                {/*Card 2*/}
                <div
                    onMouseEnter={() => handleCardHover(2)}
                    onMouseLeave={() => setFlippedCard(null)}
                    className="w-72 h-100 perspective"
                >
                    <div
                        className={`relative w-full h-full rounded-lg shadow-lg transform-style-preserve-3d transition-transform duration-500 ${
                            flippedCard === 2 ? "rotate-y-180" : ""
                        }`}
                    >
                        {/* Front Side */}
                        <div className="absolute w-full h-full bg-white rounded-lg p-6 flex flex-col justify-between items-center backface-hidden">
                            <img
                                className="w-full h-40 object-cover rounded-md"
                                src="https://www.funfoodfrolic.com/wp-content/uploads/2020/10/Suji-Halwa-2.jpg"
                                alt="Card 3"
                            />
                            <div className="mt-4">
                                <div className="font-bold text-xl text-orange-900">Suji Halwa</div>
                                <p className="text-gray-700 text-base text-center mt-2">
                                    Hover Here For the Recipe....
                                </p>
                            </div>
                        </div>

                        {/* Back Side */}
                        <div className="absolute w-full h-full bg-purple-300 text-white rounded-lg p-6 flex items-center justify-center transform rotate-y-180 backface-hidden">
                            <div className="relative font-semi-bold ">
                                <p>
                                  Ingredients:<br></br>
                                  1 cup suji 
                                  1 cup sugar
                                  3 cups water
                                  1/2 cup ghee
                                  1/4 cup mixed nuts (cashews, almonds, raisins)
                                  1/4 teaspoon cardamom powder <br></br>
                                  Instructions:<br></br>
                                  Heat 1/2 cup ghee, add 1 cup suji, and stir until golden brown.
                                  Boil 3 cups water with 1 cup sugar until dissolved.
                                  Gradually add syrup to suji, stirring constantly.
                                  Add 1/4 tsp cardamom powder, mixed nuts, and cook for a few minutes.
                                  Enjoy your Suji Halwa! 🍽️</p>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Card 3 */}
                <div
                    onMouseEnter={() => handleCardHover(3)}
                    onMouseLeave={() => setFlippedCard(null)}
                    className="w-72 h-96 perspective"
                >
                    <div
                        className={`relative w-full h-full rounded-lg shadow-lg transform-style-preserve-3d transition-transform duration-500 ${
                            flippedCard === 3 ? "rotate-y-180" : ""
                        }`}
                    >
                        {/* Front Side */}
                        <div className="absolute w-full h-full bg-white rounded-lg p-6 flex flex-col justify-between items-center backface-hidden">
                            <img
                                className="w-full h-40 object-cover rounded-md"
                                src="https://www.whiskaffair.com/wp-content/uploads/2021/05/White-Sauce-Pasta-2-4-1200x1800.jpg"
                                alt="Card 2"
                            />
                            <div className="mt-4">
                                <div className="font-bold text-xl text-yellow-300">White Sauce Pasta</div>
                                <p className="text-gray-700 text-base text-center mt-2">
                                    Hover Here For the Recipe...
                                </p>
                            </div>
                        </div>

                        {/* Back Side */}
                        <div className="absolute w-full h-full bg-blue-300 text-white rounded-lg p-6 flex items-center justify-center transform rotate-y-180 backface-hidden">
                            <div className="text-lg font-semi-bold">
                                <p>
                                  Ingredients:<br></br>
                                    200g pasta
                                    2 tbsp butter
                                    2 tbsp flour
                                    1½ cups milk
                                    Salt, pepper, nutmeg (optional)
                                    1/2 cup cheese (optional)
                                  Instructions:<br></br>
                                    Cook pasta, set aside.
                                    Melt butter, stir in flour.
                                    Add milk, cook until thick.
                                    Season and add cheese.
                                    Mix in pasta.
                                  Enjoy your pasta! 🍝
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
               
                {/* Card 4 */}
                <div
                    onMouseEnter={() => handleCardHover(4)}
                    onMouseLeave={() => setFlippedCard(null)}
                    className="w-72 h-100 perspective"
                >
                    <div
                        className={`relative w-full h-full rounded-lg shadow-lg transform-style-preserve-3d transition-transform duration-500 ${
                            flippedCard === 4 ? "rotate-y-180" : ""
                        }`}
                    >
                        {/* Front Side */}
                        <div className="absolute w-full h-full bg-white rounded-lg p-6 flex flex-col justify-between items-center backface-hidden">
                            <img
                                className="w-full h-40 object-cover rounded-md"
                                src="https://www.indianveggiedelight.com/wp-content/uploads/2022/01/kala-chana-chaat-recipe-featured.jpg"
                                alt="Card 4"
                            />
                            <div className="mt-4">
                                <div className="font-bold text-xl text-green-800">Fried Chana Chaat</div>
                                <p className="text-gray-700 text-base text-center mt-2">
                                    Hover Here For the Recipe....
                                </p>
                            </div>
                        </div>

                        {/* Back Side */}
                        <div className="absolute w-full h-full bg-slate-500 text-white rounded-lg p-6 flex items-center justify-center transform rotate-y-180 backface-hidden">
                            <div className="relative font-semi-bold ">
                                <p>
                                  Ingredients:<br></br>
                                  1 cup fried chana 
                                  1 chopped onion 
                                  1 chopped tomato 
                                  1 green chili 
                                  1 tablespoon chopped coriander leaves 
                                  1 teaspoon chaat masala
                                  1/2 teaspoon lemon juice
                                  Salt to taste<br></br>
                                  Instructions:<br></br>
                                  In a bowl, combine fried chana, onion, tomato, green chili, and coriander leaves.
                                  Add chaat masala, lemon juice, and salt.
                                  Toss: Mix well and serve immediately.
                                  Enjoy your tangy and spicy Fried Chana Chaat! 🌶️</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Scoped Styles */}
            <style jsx>
                {`
                    .perspective {
                        perspective: 1000px;
                    }
                    .transform-style-preserve-3d {
                        transform-style: preserve-3d;
                    }
                    .backface-hidden {
                        backface-visibility: hidden;
                    }
                    .rotate-y-180 {
                        transform: rotateY(180deg);
                    }
                `}
            </style>
        </div>
    );
};