import { useEffect, useState } from "react";
import { Link } from "wouter";

function page({ category }) {
  const [meals, setMeals] = useState([]);

  useEffect(() => {
    fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
    )
      .then((res) => res.json())
      .then((data) => {
        setMeals(data.meals);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-5 md:p-10 w-full bg-base-300 relative">
      <Link href="/">
        <button className="btn btn-circle bg-base-content hover:bg-neutral-content absolute top-5 md:top-10 left-3 md:left-10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="36"
            height="36"
            viewBox="0 0 24 24"
          >
            <path d="M20 11H7.41l2.29-2.29A1 1 0 1 0 8.29 7.29L3.71 12l4.59 4.59a1 1 0 0 0 1.42-1.42L7.41 13H20a1 1 0 0 0 0-2z" />
          </svg>
        </button>
      </Link>
      <h1 className="text-4xl md:text-6xl text-secondary mb-10">
        {category} 🍽️
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {meals.map((meal) => (
          <div
            key={meal.idMeal}
            className="card card-compact w-72 md:w-96 bg-base-100 shadow-xl"
          >
            <figure>
              <img
                src={meal.strMealThumb}
                alt={meal.strMeal}
                className="w-72 md:w-96 h-auto"
              />
            </figure>
            <div className="card-body">
              <h2 className="card-title text-lg md:text-xl text-accent flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-6 h-6 mr-2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                {meal.strMeal}
              </h2>
              <Link
                className="card-actions justify-end"
                href={`/meal/${meal.idMeal}`}
              >
                <button className="btn btn-primary text-sm md:text-base">
                  Try 🍴
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default page;
