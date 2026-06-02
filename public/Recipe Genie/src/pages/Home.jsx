import { useEffect, useState } from "react";
import { Link } from "wouter";
import Search from "../components/search";
import { ShepherdJourneyProvider, useShepherd } from "react-shepherd";


function page() {
  const [categories, setCategories] = useState([]);
  const [showResults, setShowResults] = useState(false);
    const [loading, setLoading] = useState(true);
  const handleSearchFocus = () => {
    setShowResults(true);
  };

  const handleBlur = () => {
    setTimeout(() => {
      setShowResults(false);
    }, 200);
  };

  useEffect(() => {
    setLoading(true);
    fetch("https://www.themealdb.com/api/json/v1/1/categories.php")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data.categories);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
      
      
  }, []);

  function StartTour() {
    const shepherd = useShepherd();
    const tour = new shepherd.Tour({
      useModalOverlay: true,
        modalOverlayOpeningPadding: 8,
        modalOverlayOpeningRadius: 16,
      defaultStepOptions: {
  cancelIcon: {
    enabled: true,
  },
  scrollTo: false,
  classes:
    "bg-white shadow-2xl rounded-2xl border border-orange-200 p-6 max-w-md",
},
    });

    const Steps = [
      {
        id: "intro",
        attachTo: { element: "#main", on: "bottom" },
        buttons: [
          {
            classes:
"bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-all duration-300 ", // Added mr-2 for margin-right
            text: "🚪 Exit",
            action() {
              return this.cancel();
            },
          },
          {
            classes:
"bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-all duration-300 ", // Used btn-sm for smaller buttons
            text: "➡️ Next",
            action() {
              return this.next();
            },
          },
        ],
        title:
"<span style='font-size:22px;font-weight:700;color:#ea580c;'>👋 Welcome to Recipe Genie</span>", // Added classes for larger, bold title
        text: [
  "<p style='font-size:16px;line-height:1.7;color:#444;'>Recipe Genie helps you discover <b>delicious recipes</b> from around the world 🍜</p>",
],
      },
      {
        id: "search",
        attachTo: { element: "#searchBar", on: "bottom" },
        buttons: [
          {
            classes: "btn btn-error btn-sm mr-2 ", // Added mr-2 for margin-right
            text: "🚪 Exit",
            action() {
              return this.cancel();
            },
          },
          {
            classes: "btn btn-success btn-sm ", // Used btn-sm for smaller buttons
            text: "➡️ Next",
            action() {
              return this.next();
            },
          },
        ],
        title: "<span className='text-lg font-bold'>🔍 Search</span>", // Added classes for larger, bold title
        text: [
          "<p>Use the search bar to find <b>your favorite meals</b> and their recipes. Happy cooking! 🥘</p>",
        ],
      },
      {
        id: "random",
        attachTo: { element: "#randomMeal", on: "bottom" },
        buttons: [
          {
            classes: "btn btn-error btn-sm mr-2 ", // Added mr-2 for margin-right
            text: "🚪 Exit",
            action() {
              return this.cancel();
            },
          },
          {
            classes: "btn btn-success btn-sm ", // Used btn-sm for smaller buttons
            text: "➡️ Next",
            action() {
              return this.next();
            },
          },
        ],
        title: "<span className='text-lg font-bold'>🎲 Random Meal</span>", // Added classes for larger, bold title
        text: [
          "<p>Feeling adventurous? Click here to get a <b>random meal recipe</b> and surprise yourself! 🍛</p>",
        ],
      },
      {
        id: "categories",
        attachTo: { element: ".categories", on: "bottom" },
        buttons: [
          {
            classes: "btn btn-error btn-sm mr-2 ", // Added mr-2 for margin-right
            text: "🚪 Exit",
            action() {
              return this.cancel();
            },
          },
          {
            classes: "btn btn-success btn-sm ", // Used btn-sm for smaller buttons
            text: "🎉 Finish",
            action() {
              return this.complete();
            },
          },
        ],
        title: "<span className='text-lg font-bold'>📚 Categories</span>", // Added classes for larger, bold title
        text: [
          "<p>Explore our <b>diverse categories</b> to find the perfect meal for any occasion. Bon appétit! 🍽️</p>",
        ],
      },
    ];

    tour.addSteps(Steps);

    if (loading) {
  return (
    <div className="flex justify-center items-center h-screen">
      <span className="loading loading-spinner loading-lg text-orange-500"></span>
    </div>
  );
}

    return (
      <button 
        className="
        mt-6
        bg-white
        text-orange-500
        font-semibold
        px-6
        py-3
        rounded-full
        shadow-md
        hover:scale-105
        transition-all
        duration-300
        border-none
        "
       onClick={tour.start}>
        Start Tour {"->"}
      </button>
    );
  }

  return (
    <ShepherdJourneyProvider>
      <div className="navbar bg-white shadow-lg backdrop-blur-md px-6 py-4 flex flex-col mt-6 md:flex-row sticky top-0 z-50">
        <div className="flex-1">
          <Link
            href="#"
            id="main"
            className="text-3xl font-extrabold text-orange-500 tracking-wide"
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
        <div className="flex flex-col items-center justify-center text-center py-10 md:py-14 px-6 w-full bg-gradient-to-r from-orange-400 to-red-400 text-white rounded-3xl shadow-2xl">
          <div className="text-lg md:text-2xl mb-6 text-primary flex items-center justify-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-8 h-8"
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

          <div className="text-xl md:text-2xl text-secondary mb-6 mt-10 md:mt-16 flex items-center justify-center space-x-2">
            <span className="text-4xl md:text-5xl font-bold leading-tight">
  Discover Delicious Recipes & Culinary Ideas 🍜
</span>
<p className="mt-4 text-lg md:text-xl text-orange-100 max-w-2xl">
  Explore recipes from around the world and discover your next favorite meal.
</p>
          </div>

          <Link href="/random">
            <button id="randomMeal" className="
bg-white
text-orange-500
font-semibold
px-8
py-4
rounded-full
shadow-lg
hover:scale-105
hover:bg-orange-100
transition-all
duration-300
border-none
">
              🎲 Enjoy a Surprise Meal
            </button>
          </Link>
        </div>

        <div className="divider"></div>

        <h1 className="
categories
text-3xl
md:text-4xl
font-bold
text-gray-800
mb-14
text-center
">
          🍽️ Browse Recipe Categories
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {categories.map((category) => (
            <div key={category.idCategory} className="
group
bg-white
rounded-3xl
overflow-hidden
shadow-lg
hover:shadow-2xl
hover:-translate-y-2 hover:scale-[1.02]
transition-all
duration-300
">
              <figure>
                <img
                  src={category.strCategoryThumb}
                  alt={category.strCategory}
                  className="w-full h-64 object-cover group-hover:scale-105 transition duration-500"
                />
              </figure>
              <div className="card-body p-6">
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
                <p className="text-gray-600 leading-relaxed text-sm md:text-base line-clamp-3">
                  {category.strCategoryDescription.slice(0, 150) + " ..."}
                </p>
                <Link
                  className="card-actions justify-end"
                  href={`/category/${category.strCategory}`}
                >
                  <button className="
                    bg-orange-500
                    hover:bg-orange-600
                    text-white
                    rounded-full
                    px-5    
                    border-none
                    shadow-md
                    ">
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
