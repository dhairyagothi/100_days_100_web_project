import { useEffect, useState } from "react";
import { Link } from "wouter";
import Search from "../components/search";
import { ShepherdJourneyProvider, useShepherd } from "react-shepherd";

function page() {
  const [categories, setCategories] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const handleSearchFocus = () => {
    setShowResults(true);
  };

  const handleBlur = () => {
    setTimeout(() => {
      setShowResults(false);
    }, 200);
  };

  useEffect(() => {
    fetch("https://www.themealdb.com/api/json/v1/1/categories.php")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data.categories);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  function StartTour() {
    const shepherd = useShepherd();
    const tour = new shepherd.Tour({
      useModalOverlay: true,
      defaultStepOptions: {
        cancelIcon: true,
        scrollTo: false,
        classes:
          "bg-base-100 shadow-xl p-5 w-96 rounded-lg border-2 border-indigo-500",
      },
    });

    const Steps = [
      {
        id: "intro",
        attachTo: { element: "#main", on: "bottom" },
        buttons: [
          {
            classes: "btn btn-error btn-sm mr-2", // Added mr-2 for margin-right
            text: "🚪 Exit",
            action() {
              return this.cancel();
            },
          },
          {
            classes: "btn btn-success btn-sm", // Used btn-sm for smaller buttons
            text: "➡️ Next",
            action() {
              return this.next();
            },
          },
        ],
        title:
          "<span class='text-lg font-bold'>👋 Welcome to Recipe Genie</span>", // Added classes for larger, bold title
        text: [
          "<p>Recipe Genie is your go-to platform for discovering <b>delicious recipes</b> for all your favorite meals! 🍲</p>",
        ],
      },
      {
        id: "search",
        attachTo: { element: "#searchBar", on: "bottom" },
        buttons: [
          {
            classes: "btn btn-error btn-sm mr-2", // Added mr-2 for margin-right
            text: "🚪 Exit",
            action() {
              return this.cancel();
            },
          },
          {
            classes: "btn btn-success btn-sm", // Used btn-sm for smaller buttons
            text: "➡️ Next",
            action() {
              return this.next();
            },
          },
        ],
        title: "<span class='text-lg font-bold'>🔍 Search</span>", // Added classes for larger, bold title
        text: [
          "<p>Use the search bar to find <b>your favorite meals</b> and their recipes. Happy cooking! 🥘</p>",
        ],
      },
      {
        id: "random",
        attachTo: { element: "#randomMeal", on: "bottom" },
        buttons: [
          {
            classes: "btn btn-error btn-sm mr-2", // Added mr-2 for margin-right
            text: "🚪 Exit",
            action() {
              return this.cancel();
            },
          },
          {
            classes: "btn btn-success btn-sm", // Used btn-sm for smaller buttons
            text: "➡️ Next",
            action() {
              return this.next();
            },
          },
        ],
        title: "<span class='text-lg font-bold'>🎲 Random Meal</span>", // Added classes for larger, bold title
        text: [
          "<p>Feeling adventurous? Click here to get a <b>random meal recipe</b> and surprise yourself! 🍛</p>",
        ],
      },
      {
        id: "categories",
        attachTo: { element: ".categories", on: "bottom" },
        buttons: [
          {
            classes: "btn btn-error btn-sm mr-2", // Added mr-2 for margin-right
            text: "🚪 Exit",
            action() {
              return this.cancel();
            },
          },
          {
            classes: "btn btn-success btn-sm", // Used btn-sm for smaller buttons
            text: "🎉 Finish",
            action() {
              return this.complete();
            },
          },
        ],
        title: "<span class='text-lg font-bold'>📚 Categories</span>", // Added classes for larger, bold title
        text: [
          "<p>Explore our <b>diverse categories</b> to find the perfect meal for any occasion. Bon appétit! 🍽️</p>",
        ],
      },
    ];

    tour.addSteps(Steps);

    return (
      <button className="btn btn-sm btn-secondary text-lg" onClick={tour.start}>
        Start Tour {"->"}
      </button>
    );
  }

  return (
    <ShepherdJourneyProvider>
      <div className="navbar bg-base-300 flex flex-col md:flex-row">
        <div className="flex-1">
          <Link
            href="#"
            id="main"
            className="btn btn-ghost text-xl text-accent"
          >
            🍱 Recipe Genie
          </Link>
        </div>
        <Search
          handleBlur={handleBlur}
          handleSearchFocus={handleSearchFocus}
          showResults={showResults}
          setShowResults={setShowResults}
        />
      </div>

      <div
        className={`flex flex-col items-center justify-center p-5 md:p-10 w-full bg-base-200 ${
          !showResults ? "opacity-100" : "opacity-80 blur-sm"
        }`}
      >
        <div class="flex flex-col items-center justify-center p-5 md:p-10 w-full bg-base-900 text-white">
          <div class="text-lg md:text-2xl mb-6 text-primary flex items-center justify-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              class="w-8 h-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v16m8-8H4"
              ></path>
            </svg>
            <span>
              Click on the button below to start the tour and explore the
              website.
            </span>
          </div>

          <StartTour />

          <div class="text-xl md:text-2xl text-secondary mb-6 mt-10 md:mt-16 flex items-center justify-center space-x-2">
            <span>🍴 Start Your Food Adventure</span>
          </div>

          <Link href="/random">
            <button id="randomMeal" class="btn btn-accent text-lg md:text-xl">
              🎲 Enjoy a Surprise Meal
            </button>
          </Link>
        </div>

        <div className="divider"></div>

        <h1 className="categories text-xl md:text-2xl text-secondary mb-10 flex items-center">
          🍽️ Explore Diverse Categories for Your Perfect Meal
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {categories.map((category) => (
            <div className="card card-compact w-72 md:w-96 bg-base-100 shadow-xl pt-2">
              <figure>
                <img
                  src={category.strCategoryThumb}
                  alt={category.strCategory}
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
                  {category.strCategory}
                </h2>
                <p className="text-sm md:text-base">
                  {category.strCategoryDescription.slice(0, 150) + " ..."}
                </p>
                <Link
                  className="card-actions justify-end"
                  href={`/category/${category.strCategory}`}
                >
                  <button className="btn btn-primary text-sm md:text-base">
                    Explore
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ShepherdJourneyProvider>
  );
}
export default page;
