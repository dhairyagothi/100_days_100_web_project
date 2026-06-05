// =============================================
//  Recipezzz - script.js
//  Images: hardcoded TheMealDB CDN URLs (fast, no API call at runtime)
//  Fallback: emoji drawn on canvas (instant, zero network)
// =============================================

// ─── Emoji fallback: draws a colored tile with emoji instantly ───────────
function emojiPlaceholder(emoji, bg1, bg2) {
  const c = document.createElement('canvas');
  c.width = 600; c.height = 400;
  const ctx = c.getContext('2d');
  const g = ctx.createLinearGradient(0, 0, 600, 400);
  g.addColorStop(0, bg1); g.addColorStop(1, bg2);
  ctx.fillStyle = g; ctx.fillRect(0, 0, 600, 400);
  ctx.font = '120px serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(emoji, 300, 200);
  return c.toDataURL();
}

// Pre-built placeholders (generated once, reused)
const PH = {
  indian:    () => emojiPlaceholder('🍛', '#7c3aed', '#db2777'),
  pasta:     () => emojiPlaceholder('🍝', '#d97706', '#b45309'),
  pizza:     () => emojiPlaceholder('🍕', '#dc2626', '#ea580c'),
  salad:     () => emojiPlaceholder('🥗', '#16a34a', '#15803d'),
  soup:      () => emojiPlaceholder('🍲', '#ca8a04', '#a16207'),
  breakfast: () => emojiPlaceholder('🥞', '#f59e0b', '#d97706'),
  drink:     () => emojiPlaceholder('🥤', '#0ea5e9', '#0284c7'),
  dessert:   () => emojiPlaceholder('🍫', '#7c3aed', '#4c1d95'),
  sandwich:  () => emojiPlaceholder('🥪', '#92400e', '#78350f'),
  default:   () => emojiPlaceholder('🍽️', '#374151', '#1f2937'),
};

function getPlaceholder(tags) {
  const t = tags.map(x => x.toLowerCase()).join(' ');
  if (t.includes('indian') || t.includes('lucknawi')) return PH.indian();
  if (t.includes('pasta') || t.includes('italian')) return PH.pasta();
  if (t.includes('pizza') || t.includes('fusion'))  return PH.pizza();
  if (t.includes('salad') || t.includes('mediterranean')) return PH.salad();
  if (t.includes('soup'))      return PH.soup();
  if (t.includes('breakfast')) return PH.breakfast();
  if (t.includes('drink'))     return PH.drink();
  if (t.includes('dessert'))   return PH.dessert();
  if (t.includes('sandwich'))  return PH.sandwich();
  return PH.default();
}

// ─── Recipe Data ─────────────────────────────────────────────────────────
// img: direct TheMealDB CDN URL (pre-looked-up, no API call needed)
// Recipes without a MDB match use null → canvas fallback
const RECIPES = [
  {
    name: "Spaghetti Carbonara",
    img: "https://www.themealdb.com/images/media/meals/llcbn01574260722.jpg",
    ingredients: ["200g spaghetti","2 large eggs","100g pancetta or guanciale","50g Pecorino Romano or Parmesan cheese","Freshly crushed black pepper","Salt for boiling water"],
    instructions: "Bring a large pot of salted water to a boil and cook the spaghetti until al dente. Meanwhile, heat a pan over medium heat and crisp the diced pancetta until golden brown, then remove from heat. In a small bowl, whisk the eggs with the finely grated cheese and a generous amount of crushed black pepper. Drain the pasta, reserving a cup of starchy pasta water. Quickly toss the hot spaghetti into the pan with the pancetta, pour in the egg and cheese mixture, and stir vigorously away from direct heat, adding splashes of pasta water until a creamy sauce forms. Serve immediately.",
    tags: ["Italian","Pasta"]
  },
  {
    name: "Chicken Biryani",
    img: "https://www.themealdb.com/images/media/meals/obafof1511329192.jpg",
    ingredients: ["1 cup basmati rice","200g bone-in chicken","1 large onion, sliced","2 tomatoes, chopped","1 tbsp ginger-garlic paste","3 tbsp yogurt","1 tsp turmeric","1 tsp red chili powder","1 tsp biryani masala","Whole spices","Fresh mint and coriander","2 tbsp ghee"],
    instructions: "Soak and parboil the basmati rice until 70% cooked. Caramelize sliced onions in ghee, set half aside. Add ginger-garlic paste, tomatoes, and spices; sauté until oil separates. Add chicken and yogurt, cook until tender. Layer parboiled rice over chicken, top with fried onions and herbs. Seal and dum-cook on very low heat for 15 minutes. Fluff gently before serving.",
    tags: ["Indian","Rice"]
  },
  {
    name: "Vegetable Stir Fry",
    img: "https://www.themealdb.com/images/media/meals/1529444830.jpg",
    ingredients: ["1 bell pepper, sliced","1 carrot, julienned","1 zucchini, sliced","½ cup broccoli florets","2 tbsp soy sauce","1 tsp garlic, minced","1 tsp ginger, grated","1 tbsp sesame oil","1 tsp sesame seeds"],
    instructions: "Heat sesame oil in a wok over high heat. Add garlic and ginger, toss 10 seconds. Add carrots and broccoli, stir 2 minutes. Add bell pepper and zucchini, keep heat high. Drizzle soy sauce along edges, stir 2 more minutes. Garnish with sesame seeds and serve hot.",
    tags: ["Asian","Vegetarian"]
  },
  {
    name: "Pancakes",
    img: "https://www.themealdb.com/images/media/meals/rwuyqx1511383174.jpg",
    ingredients: ["1 cup all-purpose flour","1 large egg","1 cup whole milk","1 tbsp sugar","1 tsp baking powder","¼ tsp salt","2 tbsp melted butter","Extra butter for pan"],
    instructions: "Sift flour, sugar, baking powder, and salt. Whisk egg, milk, and melted butter separately; combine with dry mix, leaving small lumps. Heat a buttered non-stick skillet on medium-low. Ladle batter in; cook until bubbles form. Flip and cook 1 minute more until golden.",
    tags: ["Breakfast","American"]
  },
  {
    name: "Grilled Cheese Sandwich",
    img: null,
    ingredients: ["2 thick slices artisanal bread","2 tbsp unsalted butter, softened","2 slices sharp cheddar","1 slice Swiss or mozzarella"],
    instructions: "Butter one side of each bread slice. Place one slice butter-side down on a medium-low skillet. Layer cheddar and mozzarella, top with second slice butter-side up. Cook 3–4 minutes until golden, flip, press gently, cook 3 more minutes until cheese is fully melted.",
    tags: ["Sandwich","Quick"]
  },
  {
    name: "Tomato Soup",
    img: "https://www.themealdb.com/images/media/meals/stpuws1511191310.jpg",
    ingredients: ["4 large ripe tomatoes, diced","1 onion, chopped","2 cloves garlic, minced","2 cups vegetable broth","1 tbsp olive oil","¼ cup heavy cream","Fresh basil","Salt and black pepper"],
    instructions: "Sauté onion and garlic in olive oil 4 minutes. Add tomatoes and cook 5 minutes until collapsing. Pour in broth, season, bring to boil. Simmer covered 15 minutes. Blend until velvety with an immersion blender. Stir in cream, warm 1 minute, ladle into bowls.",
    tags: ["Soup","Vegetarian"]
  },
  {
    name: "Omelette",
    img: "https://www.themealdb.com/images/media/meals/wyxwsp1486979827.jpg",
    ingredients: ["2 large eggs","1 tbsp whole milk","1 tbsp unsalted butter","2 tbsp grated cheddar","1 tbsp chives, chopped","Salt and white pepper"],
    instructions: "Beat eggs with milk, salt, and white pepper until foamy. Melt butter in a small non-stick skillet on medium. Pour in eggs, tilt pan to coat evenly. Push cooked edges to center; let raw egg flow underneath. When mostly set, add cheese and chives on one half. Fold, slide onto plate, serve warm.",
    tags: ["Breakfast","Quick"]
  },
  {
    name: "Banana Smoothie",
    img: null,
    ingredients: ["1 ripe banana, frozen","1 cup chilled whole milk","1 tbsp honey","¼ cup Greek yogurt","Pinch of cinnamon","3 ice cubes"],
    instructions: "Slice frozen banana. Blend banana, milk, yogurt, and honey on high 45–60 seconds until thick and smooth. Add cinnamon and ice cubes, blend briefly. Adjust sweetness, pour into a chilled glass, serve immediately.",
    tags: ["Drink","Healthy"]
  },
  {
    name: "Garlic Bread",
    img: "https://www.themealdb.com/images/media/meals/sxysrt1468240488.jpg",
    ingredients: ["1 French baguette","50g softened unsalted butter","3 cloves garlic, minced","1 tbsp fresh parsley, chopped","2 tbsp grated Parmesan"],
    instructions: "Preheat oven to 180°C. Mix butter, garlic, parsley, and Parmesan into a paste. Slice baguette without cutting through; spread paste on cut surfaces. Wrap in foil. Bake 10 minutes, then open foil and broil 2 minutes until golden and crunchy.",
    tags: ["Side","Bread"]
  },
  {
    name: "Caesar Salad",
    img: "https://www.themealdb.com/images/media/meals/yn3g8m1598393734.jpg",
    ingredients: ["1 head romaine lettuce","50g Parmesan, shaved","1 cup garlic croutons","3 tbsp Caesar dressing","1 tsp fresh lemon juice","Cracked black pepper"],
    instructions: "Tear romaine into bite-sized pieces. Drizzle Caesar dressing and lemon juice, toss until every leaf is coated. Add croutons and half the Parmesan, toss gently. Top with remaining Parmesan and generous cracked pepper. Serve immediately.",
    tags: ["Salad","American"]
  },
  {
    name: "Chocolate Brownies",
    img: "https://www.themealdb.com/images/media/meals/sltsxu1511553563.jpg",
    ingredients: ["1 cup all-purpose flour","½ cup unsweetened cocoa powder","1 cup granulated sugar","2 large eggs","½ cup melted unsalted butter","1 tsp vanilla extract","½ cup semi-sweet chocolate chips"],
    instructions: "Preheat oven to 180°C; line an 8-inch pan. Whisk melted butter and sugar. Beat in eggs one at a time, add vanilla. Sift in flour and cocoa, fold gently. Fold in chocolate chips. Spread into pan; bake 22–25 minutes. Cool completely before slicing.",
    tags: ["Dessert","Baking"]
  },
  {
    name: "Fried Rice",
    img: "https://www.themealdb.com/images/media/meals/1bsv1q1560459826.jpg",
    ingredients: ["1 cup jasmine rice, cooked day-old","1 egg, beaten","1 carrot, finely diced","1 small onion, chopped","2 green onion stalks, sliced","2 tbsp light soy sauce","1 tbsp sesame oil","½ cup frozen peas, thawed"],
    instructions: "Scramble egg in sesame oil in a hot wok; set aside. Sauté onion and carrot 3 minutes. Add peas and green onion whites. Add cold rice, break up clumps, toss on high heat. Add soy sauce, stir-fry 3 minutes. Fold in egg and green onion tops, serve hot.",
    tags: ["Asian","Rice"]
  },
  {
    name: "Lemonade",
    img: null,
    ingredients: ["2 large lemons","1 cup filtered water","2 tbsp granulated sugar","Fresh mint leaves","Crushed ice"],
    instructions: "Roll lemons on countertop; squeeze out juice. Combine juice, sugar, and half the water; stir until sugar dissolves. Add remaining water; adjust to taste. Fill a glass with crushed ice, pour lemonade over, garnish with fresh mint.",
    tags: ["Drink","Summer"]
  },
  {
    name: "French Toast",
    img: "https://www.themealdb.com/images/media/meals/sywswr1511383814.jpg",
    ingredients: ["2 thick slices brioche or white bread","1 large egg","½ cup whole milk","1 tbsp white sugar","½ tsp ground cinnamon","1 tsp vanilla extract","1 tbsp unsalted butter"],
    instructions: "Whisk egg, milk, sugar, cinnamon, and vanilla in a shallow dish. Melt butter in a wide skillet on medium. Dip bread 10–15 seconds per side to absorb custard. Cook 3–4 minutes per side until golden brown and slightly puffed.",
    tags: ["Breakfast","French"]
  },
  {
    name: "Mango Lassi",
    img: null,
    ingredients: ["1 large ripe mango, diced","1 cup plain yogurt","½ cup chilled whole milk","1 tbsp honey","Pinch of cardamom powder"],
    instructions: "Blend mango 30 seconds until smooth. Add yogurt, milk, honey, and cardamom; blend 45 seconds until light and frothy. Thin with extra milk if too thick. Pour into a glass and serve immediately.",
    tags: ["Indian","Drink"]
  },
  {
    name: "Palak Paneer",
    img: "https://www.themealdb.com/images/media/meals/xxpqsy1511452222.jpg",
    ingredients: ["200g paneer cubes","2 bunches fresh spinach","1 onion, finely chopped","1 tomato, pureed","2 cloves garlic, minced","1 tsp ginger paste","1 tsp cumin seeds","1 tsp garam masala","½ tsp turmeric","2 tbsp heavy cream","1 tbsp oil"],
    instructions: "Blanch spinach 2 minutes, transfer to ice bath, blend smooth. Sauté cumin seeds, onion, garlic, and ginger 5 minutes. Add pureed tomato and turmeric; cook until oil separates. Stir in spinach puree, simmer 3 minutes. Add paneer and garam masala, stir gently. Simmer 2 minutes, stir in cream, serve.",
    tags: ["Indian","Vegetarian"]
  },
  {
    name: "Aloo Paratha",
    img: "https://www.themealdb.com/images/media/meals/quwtp31511796744.jpg",
    ingredients: ["2 cups whole wheat flour","2 potatoes, boiled","1 small onion, finely chopped","1 tsp cumin seeds","½ tsp red chili powder","½ tsp amchur powder","Salt","Warm water","Ghee for cooking"],
    instructions: "Knead flour with warm water and salt into smooth dough; rest 20 minutes. Mash boiled potatoes, mix in onion, cumin, chili, amchur, and salt. Stuff a dough ball with potato filling, seal, and roll into a disc. Cook on a hot tawa, flip after 1 minute, apply ghee both sides, press until golden spots appear.",
    tags: ["Indian","Breakfast"]
  },
  {
    name: "Chana Masala",
    img: "https://www.themealdb.com/images/media/meals/k9wb5l1604743650.jpg",
    ingredients: ["1 cup chickpeas, soaked and boiled","1 onion, finely chopped","2 tomatoes, pureed","2 cloves garlic, minced","1 tsp ginger paste","1 tsp garam masala","1 tsp cumin seeds","1 tsp chana masala powder","½ tsp turmeric","2 tbsp oil","Fresh coriander"],
    instructions: "Crackle cumin seeds in oil. Sauté onion, garlic, and ginger 6 minutes until golden. Add tomato puree with spices; cook until paste thickens. Add chickpeas and their cooking water for gravy. Mash a few chickpeas to thicken. Simmer 10 minutes, finish with garam masala and fresh coriander.",
    tags: ["Indian","Vegan"]
  },
  {
    name: "Dal Tadka",
    img: "https://www.themealdb.com/images/media/meals/wuxrtu1483564410.jpg",
    ingredients: ["1 cup yellow lentils","1 onion, chopped","2 tomatoes, diced","3 cloves garlic","1 tsp mustard seeds","1 tsp cumin seeds","1 tsp turmeric","1 tsp red chili powder","Pinch of asafoetida","2 tbsp ghee","Fresh coriander"],
    instructions: "Pressure-cook lentils with turmeric and salt until creamy. Sauté onion and half the garlic in ghee; add tomatoes and chili powder; cook soft. Pour lentils in, simmer 5 minutes. For tadka: heat ghee, add mustard, cumin, remaining garlic, and asafoetida until crackling. Pour over dal, garnish with coriander, cover immediately.",
    tags: ["Indian","Lentils"]
  },
  {
    name: "Masala Dosa",
    img: "https://www.themealdb.com/images/media/meals/xutquv1505330523.jpg",
    ingredients: ["2 cups parboiled rice","1 cup urad dal","2 potatoes","1 onion, sliced","1 tsp mustard seeds","Curry leaves","½ tsp turmeric","Salt","Oil or ghee"],
    instructions: "Soak rice and dal separately 6 hours; grind smooth; ferment batter overnight. Prepare filling: smash boiled potatoes; temper mustard seeds, curry leaves, onions, and turmeric; fold in potatoes. Spread fermented batter thin on a hot greased tawa; drizzle ghee at edges; cook until crispy and golden. Add potato filling, fold, serve with coconut chutney.",
    tags: ["Indian","South Indian"]
  },
  {
    name: "Margherita Pizza",
    img: "https://www.themealdb.com/images/media/meals/x0lk931587671540.jpg",
    ingredients: ["1 pizza base","½ cup San Marzano tomato sauce","100g fresh mozzarella, torn","Fresh basil leaves","1 tbsp extra virgin olive oil","Coarse sea salt"],
    instructions: "Preheat oven to 220°C with a pizza stone or tray. Spread tomato sauce on base, leaving 1-inch border. Arrange torn mozzarella. Bake 8–10 minutes until crust is golden and cheese is bubbling. Top with fresh basil, drizzle olive oil, sprinkle sea salt, slice and serve.",
    tags: ["Italian","Pizza"]
  },
  {
    name: "Greek Salad",
    img: "https://www.themealdb.com/images/media/meals/v3grx31587673158.jpg",
    ingredients: ["2 English cucumbers, unpeeled","3 large vine tomatoes","1 small red onion, ring-sliced","50g block Greek feta","½ cup Kalamata olives","2 tbsp extra virgin olive oil","1 tsp dried oregano","1 tbsp red wine vinegar"],
    instructions: "Slice cucumbers into half-moons; chop tomatoes into rustic chunks. Combine in a large bowl with red onion rings and Kalamata olives, toss gently. Whisk olive oil and red wine vinegar; drizzle over. Place feta block on top, sprinkle oregano, finish with cracked pepper.",
    tags: ["Salad","Mediterranean"]
  },
  {
    name: "Guacamole",
    img: "https://www.themealdb.com/images/media/meals/mv6x521619960700.jpg",
    ingredients: ["2 ripe Hass avocados","1 fresh lime","1 small tomato, seeded and diced","¼ cup red onion, finely chopped","2 tbsp fresh coriander, minced","½ tsp sea salt","Pinch of ground cumin"],
    instructions: "Scoop avocado flesh into a bowl; mash with a fork to a chunky texture. Squeeze lime juice over immediately. Fold in red onion, tomato, and coriander until combined. Season with sea salt and cumin. Serve immediately with tortilla chips.",
    tags: ["Mexican","Dip"]
  },
  {
    name: "Club Sandwich",
    img: null,
    ingredients: ["3 slices white sandwich bread","2 slices cooked chicken or turkey ham","2 strips smoked bacon","2 iceberg lettuce leaves","3 thin tomato slices","2 tbsp mayonnaise","1 tbsp butter for toasting"],
    instructions: "Butter and toast all bread slices until golden. Fry bacon until crispy; drain. Spread mayo on first slice; add lettuce and ham. Place second slice on top; add mayo, tomato, and bacon. Top with third slice, mayo-side down. Press, toothpick all four quadrants, cut into triangles diagonally.",
    tags: ["Sandwich","American"]
  },
  {
    name: "Paneer Tikka",
    img: "https://www.themealdb.com/images/media/meals/1550441882.jpg",
    ingredients: ["200g firm paneer, cubed","1 green bell pepper, squares","1 red onion, separated","½ cup thick Greek yogurt","1 tbsp tandoori masala","1 tsp ginger-garlic paste","1 tbsp lemon juice","1 tbsp mustard oil","½ tsp chaat masala"],
    instructions: "Whisk yogurt, tandoori masala, ginger-garlic paste, lemon juice, and mustard oil into a marinade. Coat paneer, bell pepper, and onion; refrigerate 30 minutes. Thread onto skewers alternating vegetables and paneer. Grill on a hot grill pan, turning every 3 minutes and brushing with oil, until charred edges appear. Dust with chaat masala, serve hot.",
    tags: ["Indian","Starter"]
  },
  {
    name: "Galouti Kebab",
    img: null,
    ingredients: ["250g finely minced lamb","1 tbsp raw papaya paste","1 tbsp ginger-garlic paste","1 tsp shahi jeera","Pinch of saffron","Ghee for frying","Spice mix: mace, cardamom, cloves"],
    instructions: "Marinate minced lamb with raw papaya paste for 4 hours to achieve the melt-in-mouth texture. Mix in ginger-garlic paste, saffron, and ground spice blend. Shape into delicate flat patties. Shallow fry in ghee in a heavy skillet until dark brown outside and velvety inside. Serve hot with Ulte Tawe ka Paratha.",
    tags: ["Lucknawi","Kebab"]
  },
  {
    name: "Lucknawi Mutton Biryani",
    img: null,
    ingredients: ["500g mutton","2 cups sela basmati rice","½ cup saffron milk","1 cup yogurt","Whole spices: star anise, mace, cinnamon","2 tbsp kewra water","Ghee"],
    instructions: "Slow-cook mutton with whole spices and yogurt to make fragrant yakhni broth. Parboil rice to 70%. Layer meat and rice in a handi, drizzling saffron milk and kewra water between layers. Seal with dough and dum-cook on low heat 20 minutes.",
    tags: ["Lucknawi","Rice"]
  },
  {
    name: "Shahi Tukda",
    img: null,
    ingredients: ["4 thick slices white bread","1 liter full-fat milk","½ cup sugar","Saffron strands","Cardamom powder","Crushed pistachios and almonds","Ghee for deep frying"],
    instructions: "Reduce milk until thick rabri; sweeten with sugar, flavor with cardamom and saffron. Deep-fry bread slices in ghee until crunchy golden brown. Dip fried bread in light sugar syrup, arrange on platter. Pour thick rabri over the top, garnish lavishly with crushed nuts.",
    tags: ["Lucknawi","Dessert"]
  },
  {
    name: "Makhan Malai",
    img: null,
    ingredients: ["1 liter fresh milk cream","¼ cup powdered sugar","Saffron","Rose water","Slivered almonds"],
    instructions: "Whisk chilled cream vigorously until incredibly light and frothy. Fold in powdered sugar, saffron, and a hint of rose water. Serve in earthen bowls, topped with slivered almonds. This cloud-like dessert dissolves on the tongue.",
    tags: ["Lucknawi","Dessert"]
  },
  {
    name: "Basket Chaat",
    img: null,
    ingredients: ["2 large potatoes, grated (for basket)","Boiled chickpeas","Papdi","Whisked yogurt","Tamarind chutney","Mint chutney","Pomegranate seeds","Sev"],
    instructions: "Deep fry grated potatoes in a small metal strainer to create a crispy edible basket. Fill with chickpeas, crushed papdi, and cubed potatoes. Pour chilled sweetened yogurt over filling, drizzle spicy mint and tangy tamarind chutneys. Top with sev and pomegranate seeds.",
    tags: ["Lucknawi","Street Food"]
  },
  {
    name: "Paneer Tikka Pizza",
    img: null,
    ingredients: ["250g pizza dough","150g paneer, small cubes","2 tbsp thick yogurt","1 tsp ginger-garlic paste","1 tsp tandoori masala","½ cup mozzarella","¼ cup sliced onions and bell peppers","3 tbsp pizza sauce"],
    instructions: "Marinate paneer in yogurt, ginger-garlic paste, and tandoori masala for 30 minutes. Roll dough into 10-inch circle; spread pizza sauce. Arrange marinated paneer, onions, and bell peppers. Cover with mozzarella. Bake at 220°C for 12–15 minutes until crust is golden and cheese is bubbling.",
    tags: ["Fusion","Pizza"]
  },
  {
    name: "Chicken Tikka Pizza",
    img: null,
    ingredients: ["250g pizza dough","200g boneless chicken, cubed","2 tbsp yogurt","1 tsp red chili powder","1 tsp lemon juice","½ cup mozzarella and cheddar mix","¼ cup red onions and capsicum","3 tbsp pizza sauce"],
    instructions: "Marinate chicken with yogurt, chili powder, and lemon juice for 1 hour. Pan-fry chicken 5–8 minutes until cooked. Roll dough, apply pizza sauce, add cheese layer. Place chicken tikka, onions, and capsicum on top. Bake at 200°C for 15 minutes until cheese starts browning.",
    tags: ["Fusion","Pizza"]
  },
  {
    name: "Corn and Cheese Pizza",
    img: null,
    ingredients: ["200g pizza dough","½ cup boiled sweet corn kernels","½ cup mozzarella, grated","¼ cup green capsicum and onion","2 tbsp pizza sauce","¼ tsp chili flakes and oregano"],
    instructions: "Flatten pizza dough; prick with fork. Spread pizza sauce; add half mozzarella. Add corn, capsicum, and onions. Cover with remaining cheese, sprinkle chili flakes and oregano. Bake at 210°C for 10–12 minutes until cheese melts and base turns golden.",
    tags: ["Vegetarian","Pizza"]
  }
];

// ─── Image resolver ────────────────────────────────────────────────────────
// Returns TheMealDB URL instantly if present; otherwise returns canvas data-URL
const _phCache = {};
function resolveImage(recipe) {
  if (recipe.img) return recipe.img;
  const key = recipe.tags[0] || 'default';
  if (!_phCache[key]) _phCache[key] = getPlaceholder(recipe.tags);
  return _phCache[key];
}

// ─── Favorites ─────────────────────────────────────────────────────────────
function getFavorites() {
  try { return JSON.parse(localStorage.getItem('recipezzz_fav') || '[]'); }
  catch { return []; }
}
function saveFavorites(f) { localStorage.setItem('recipezzz_fav', JSON.stringify(f)); }
function isFavorite(name) { return getFavorites().includes(name); }
function toggleFavorite(name) {
  let f = getFavorites();
  f = f.includes(name) ? f.filter(x => x !== name) : [...f, name];
  saveFavorites(f); return f.includes(name);
}

// ─── Page Detection ────────────────────────────────────────────────────────
const _p = window.location.pathname;
const isExplore = _p.includes('rec.html');
const isDetail  = _p.includes('recipe.html');

// ══════════════════════════════════════════════════════════════════════════
//  EXPLORE PAGE  (rec.html)
// ══════════════════════════════════════════════════════════════════════════
if (isExplore) {
  const grid       = document.getElementById('recipeGrid');
  const searchEl   = document.getElementById('searchInput');
  const selectEl   = document.getElementById('difficulty');
  const startBtn   = document.getElementById('start');
  const randomBtn  = document.getElementById('randomRecipe');

  // Build tag filter options
  const allTags = [...new Set(RECIPES.flatMap(r => r.tags))].sort();
  selectEl.innerHTML = `<option value="">All Recipes</option>` +
    allTags.map(t => `<option value="${t}">${t}</option>`).join('');

  function getFiltered() {
    const q   = searchEl.value.toLowerCase().trim();
    const tag = selectEl.value;
    return RECIPES.filter(r => {
      const matchQ   = !q || r.name.toLowerCase().includes(q) || r.tags.some(t => t.toLowerCase().includes(q));
      const matchTag = !tag || r.tags.includes(tag);
      return matchQ && matchTag;
    });
  }

  function renderGrid(list) {
    if (!list.length) {
      grid.innerHTML = '<div class="no-results">😕 No recipes found.</div>';
      return;
    }
    grid.innerHTML = list.map(r => {
      const imgSrc = resolveImage(r);
      const fav    = isFavorite(r.name) ? '❤️' : '🤍';
      const tags   = r.tags.map(t => `<span class="recipe-tag">${t}</span>`).join('');
      const preview = r.ingredients.slice(0, 3).join(', ') + '…';
      return `
        <div class="recipe-card" data-name="${r.name}">
          <div class="recipe-card-img-wrap">
            <img src="${imgSrc}" alt="${r.name}" loading="lazy"
              onerror="this.src='${getPlaceholder(r.tags)}'">
            <button class="recipe-fav-badge" data-fav="${r.name}" title="Favourite">${fav}</button>
          </div>
          <div class="recipe-info">
            <h3>${r.name}</h3>
            <p>${preview}</p>
            <div class="recipe-info-meta">${tags}</div>
          </div>
        </div>`;
    }).join('');

    grid.querySelectorAll('.recipe-card').forEach(card => {
      card.addEventListener('click', e => {
        if (e.target.closest('.recipe-fav-badge')) return;
        sessionStorage.setItem('selectedRecipe', card.dataset.name);
        window.location.href = 'recipe.html';
      });
    });
    grid.querySelectorAll('.recipe-fav-badge').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const now = toggleFavorite(btn.dataset.fav);
        btn.textContent = now ? '❤️' : '🤍';
      });
    });
  }

  searchEl.addEventListener('input',  () => renderGrid(getFiltered()));
  selectEl.addEventListener('change', () => renderGrid(getFiltered()));

  startBtn.addEventListener('click', () => {
    const list = getFiltered();
    if (list.length) { sessionStorage.setItem('selectedRecipe', list[0].name); window.location.href = 'recipe.html'; }
  });
  randomBtn.addEventListener('click', () => {
    const pick = RECIPES[Math.floor(Math.random() * RECIPES.length)];
    sessionStorage.setItem('selectedRecipe', pick.name);
    window.location.href = 'recipe.html';
  });

  renderGrid(RECIPES);
}

// ══════════════════════════════════════════════════════════════════════════
//  DETAIL PAGE  (recipe.html)
// ══════════════════════════════════════════════════════════════════════════
if (isDetail) {
  const container = document.getElementById('recipeContent');
  const recipeName = sessionStorage.getItem('selectedRecipe');
  const recipe = RECIPES.find(r => r.name === recipeName);

  if (!recipe) {
    container.innerHTML = `
      <div style="text-align:center;padding:60px">
        <h2>Recipe not found 😕</h2>
        <p style="color:#94a3b8;margin:16px 0 24px">Go back and select a recipe.</p>
        <a href="rec.html" class="hero-btn primary-btn" style="text-decoration:none;padding:14px 28px">← Browse Recipes</a>
      </div>`;
  } else {
    document.title = `Recipezzz - ${recipe.name}`;
    const imgSrc    = resolveImage(recipe);
    const favLabel  = isFavorite(recipe.name) ? '❤️ Saved' : '🤍 Save';
    const tags      = recipe.tags.map(t => `<span>${t}</span>`).join('');
    const ingItems  = recipe.ingredients.map(i => `<li>${i}</li>`).join('');

    container.innerHTML = `
      <img class="recipe-image" src="${imgSrc}" alt="${recipe.name}"
        onerror="this.src='${getPlaceholder(recipe.tags)}'">
      <h1 class="recipe-title">${recipe.name}</h1>
      <div class="recipe-meta">
        ${tags}
        <span>🛒 ${recipe.ingredients.length} ingredients</span>
      </div>
      <div class="recipe-section">
        <h3>🛒 Ingredients</h3>
        <ul class="ingredient-list">${ingItems}</ul>
      </div>
      <div class="recipe-section">
        <h3>👨‍🍳 Instructions</h3>
        <p class="instructions">${recipe.instructions}</p>
      </div>
      <div class="recipe-actions">
        <button id="favoriteBtn">${favLabel}</button>
        <button id="speakBtn">🔊 Read Aloud</button>
        <button id="copyBtn">📋 Copy Recipe</button>
        <button id="printBtn">🖨️ Print</button>
      </div>`;

    // Favourite
    document.getElementById('favoriteBtn').addEventListener('click', function() {
      const now = toggleFavorite(recipe.name);
      this.textContent = now ? '❤️ Saved' : '🤍 Save';
    });

    // Text-to-speech
    let speaking = false;
    document.getElementById('speakBtn').addEventListener('click', function() {
      if (speaking) { speechSynthesis.cancel(); this.textContent = '🔊 Read Aloud'; speaking = false; return; }
      const u = new SpeechSynthesisUtterance(
        `${recipe.name}. Ingredients: ${recipe.ingredients.join(', ')}. Instructions: ${recipe.instructions}`
      );
      u.rate = 0.92;
      u.onend = () => { document.getElementById('speakBtn').textContent = '🔊 Read Aloud'; speaking = false; };
      speechSynthesis.speak(u);
      this.textContent = '⏹ Stop'; speaking = true;
    });

    // Copy
    document.getElementById('copyBtn').addEventListener('click', function() {
      const txt = `${recipe.name}\n\nIngredients:\n${recipe.ingredients.map(i=>'• '+i).join('\n')}\n\nInstructions:\n${recipe.instructions}`;
      navigator.clipboard.writeText(txt).then(() => {
        this.textContent = '✅ Copied!';
        setTimeout(() => this.textContent = '📋 Copy Recipe', 2000);
      });
    });

    // Print
    document.getElementById('printBtn').addEventListener('click', () => window.print());
  }
}