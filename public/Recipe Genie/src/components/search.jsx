import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";

const Search = ({
  handleSearchFocus,
  handleBlur,
  showResults,
  setShowResults,
}) => {
  const [input, setInput] = useState("");
  const [meals, setMeals] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const resultsRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (input) {
      fetchMeals(input);
    } else {
      setMeals([]);
    }
  }, [input]);

  const fetchMeals = (value) => {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${value}`)
      .then((response) => response.json())
      .then((data) => setMeals(data.meals));
  };

  const handleSearch = (value) => {
    setInput(value);
    if (!value) {
      setMeals([]);
      return;
    }
    fetchMeals(value);
  };

  const handleKeyDown = (event) => {
    if (event.key === "ArrowDown") {
      setActiveIndex((prev) => {
        const newIndex = prev < meals.length - 1 ? prev + 1 : prev;
        scrollIntoView(newIndex);
        return newIndex;
      });
    } else if (event.key === "ArrowUp") {
      setActiveIndex((prev) => {
        const newIndex = prev > 0 ? prev - 1 : prev;
        scrollIntoView(newIndex);
        return newIndex;
      });
    } else if (event.key === "Enter" && activeIndex >= 0) {
      window.location.href = `/meal/${meals[activeIndex].idMeal}`;
    } else if (event.key === "Escape") {
      setShowResults(false);
      inputRef.current.blur();
    }
  };

  const scrollIntoView = (index) => {
    if (resultsRef.current) {
      const resultItems = resultsRef.current.children;
      if (resultItems[index]) {
        resultItems[index].scrollIntoView({
          block: "nearest",
          behavior: "smooth",
        });
      }
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [meals, activeIndex]);

  return (
    <div id="searchBar" className="flex flex-col relative">
      <label className="input input-bordered flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="w-4 h-4 opacity-70"
        >
          <path
            fillRule="evenodd"
            d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
            clipRule="evenodd"
          />
        </svg>
        <input
          ref={inputRef}
          type="text"
          className="grow"
          placeholder="Search for your meal"
          value={input}
          onChange={(e) => {
            handleSearch(e.target.value);
            setShowResults(true);
          }}
          onKeyDown={handleKeyDown}
          onFocus={handleSearchFocus}
          onBlur={handleBlur}
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          className="w-4 h-4 cursor-pointer"
          stroke="currentColor"
          onClick={() => handleSearch("")}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </label>

      {showResults && input && (
        <div
          ref={resultsRef}
          className="w-80 max-h-80 overflow-y-scroll no-scrollbar bg-neutral p-2 rounded-xl flex flex-col gap-2 absolute top-12 md:top-20 md:right-0 z-10"
        >
          {input &&
            meals &&
            meals.map((meal, index) => (
              <Link key={meal.idMeal} href={`/meal/${meal.idMeal}`}>
                <div
                  className={`${
                    index === activeIndex ? "bg-base-100" : ""
                  } p-1 rounded-xl flex items-center justify-start gap-3`}
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    window.location.href = `/meal/${meal.idMeal}`;
                  }}
                >
                  <img
                    src={meal.strMealThumb}
                    alt={meal.strMeal}
                    className="w-10 h-10 rounded-full"
                  />
                  <span>{meal.strMeal}</span>
                </div>
              </Link>
            ))}
        </div>
      )}
    </div>
  );
};
export default Search;