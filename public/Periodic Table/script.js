const elements = [
    { number: 1, symbol: "H", name: "Hydrogen", mass: "1.008", group: 1, period: 1 },
    { number: 2, symbol: "He", name: "Helium", mass: "4.0026", group: 18, period: 1 },
    { number: 3, symbol: "Li", name: "Lithium", mass: "6.94", group: 1, period: 2 },
    { number: 4, symbol: "Be", name: "Beryllium", mass: "9.0122", group: 2, period: 2 },
    { number: 5, symbol: "B", name: "Boron", mass: "10.81", group: 13, period: 2 },
    { number: 6, symbol: "C", name: "Carbon", mass: "12.011", group: 14, period: 2 },
    { number: 7, symbol: "N", name: "Nitrogen", mass: "14.007", group: 15, period: 2 },
    { number: 8, symbol: "O", name: "Oxygen", mass: "15.999", group: 16, period: 2 },
    { number: 9, symbol: "F", name: "Fluorine", mass: "18.998", group: 17, period: 2 },
    { number: 10, symbol: "Ne", name: "Neon", mass: "20.180", group: 18, period: 2 },
    { number: 11, symbol: "Na", name: "Sodium", mass: "22.990", group: 1, period: 3 },
    { number: 12, symbol: "Mg", name: "Magnesium", mass: "24.305", group: 2, period: 3 },
    { number: 13, symbol: "Al", name: "Aluminium", mass: "26.982", group: 13, period: 3 },
    { number: 14, symbol: "Si", name: "Silicon", mass: "28.085", group: 14, period: 3 },
    { number: 15, symbol: "P", name: "Phosphorus", mass: "30.974", group: 15, period: 3 },
    { number: 16, symbol: "S", name: "Sulfur", mass: "32.06", group: 16, period: 3 },
    { number: 17, symbol: "Cl", name: "Chlorine", mass: "35.45", group: 17, period: 3 },
    { number: 18, symbol: "Ar", name: "Argon", mass: "39.948", group: 18, period: 3 },
    { number: 19, symbol: "K", name: "Potassium", mass: "39.098", group: 1, period: 4 },
    { number: 20, symbol: "Ca", name: "Calcium", mass: "40.078", group: 2, period: 4 },
    { number: 21, symbol: "Sc", name: "Scandium", mass: "44.956", group: 3, period: 4 },
    { number: 22, symbol: "Ti", name: "Titanium", mass: "47.867", group: 4, period: 4 },
    { number: 23, symbol: "V", name: "Vanadium", mass: "50.942", group: 5, period: 4 },
    { number: 24, symbol: "Cr", name: "Chromium", mass: "51.996", group: 6, period: 4 },
    { number: 25, symbol: "Mn", name: "Manganese", mass: "54.938", group: 7, period: 4 },
    { number: 26, symbol: "Fe", name: "Iron", mass: "55.845", group: 8, period: 4 },
    { number: 27, symbol: "Co", name: "Cobalt", mass: "58.933", group: 9, period: 4 },
    { number: 28, symbol: "Ni", name: "Nickel", mass: "58.693", group: 10, period: 4 },
    { number: 29, symbol: "Cu", name: "Copper", mass: "63.546", group: 11, period: 4 },
    { number: 30, symbol: "Zn", name: "Zinc", mass: "65.38", group: 12, period: 4 },
    { number: 31, symbol: "Ga", name: "Gallium", mass: "69.723", group: 13, period: 4 },
    { number: 32, symbol: "Ge", name: "Germanium", mass: "72.63", group: 14, period: 4 },
    { number: 33, symbol: "As", name: "Arsenic", mass: "74.922", group: 15, period: 4 },
    { number: 34, symbol: "Se", name: "Selenium", mass: "78.971", group: 16, period: 4 },
    { number: 35, symbol: "Br", name: "Bromine", mass: "79.904", group: 17, period: 4 },
    { number: 36, symbol: "Kr", name: "Krypton", mass: "83.798", group: 18, period: 4 },
    { number: 37, symbol: "Rb", name: "Rubidium", mass: "85.468", group: 1, period: 5 },
    { number: 38, symbol: "Sr", name: "Strontium", mass: "87.62", group: 2, period: 5 },
    { number: 39, symbol: "Y", name: "Yttrium", mass: "88.906", group: 3, period: 5 },
    { number: 40, symbol: "Zr", name: "Zirconium", mass: "91.224", group: 4, period: 5 },
    { number: 41, symbol: "Nb", name: "Niobium", mass: "92.906", group: 5, period: 5 },
    { number: 42, symbol: "Mo", name: "Molybdenum", mass: "95.95", group: 6, period: 5 },
    { number: 43, symbol: "Tc", name: "Technetium", mass: "98", group: 7, period: 5 },
    { number: 44, symbol: "Ru", name: "Ruthenium", mass: "101.07", group: 8, period: 5 },
    { number: 45, symbol: "Rh", name: "Rhodium", mass: "102.91", group: 9, period: 5 },
    { number: 46, symbol: "Pd", name: "Palladium", mass: "106.42", group: 10, period: 5 },
    { number: 47, symbol: "Ag", name: "Silver", mass: "107.87", group: 11, period: 5 },
    { number: 48, symbol: "Cd", name: "Cadmium", mass: "112.41", group: 12, period: 5 },
    { number: 49, symbol: "In", name: "Indium", mass: "114.82", group: 13, period: 5 },
    { number: 50, symbol: "Sn", name: "Tin", mass: "118.71", group: 14, period: 5 },
    { number: 51, symbol: "Sb", name: "Antimony", mass: "121.76", group: 15, period: 5 },
    { number: 52, symbol: "Te", name: "Tellurium", mass: "127.6", group: 16, period: 5 },
    { number: 53, symbol: "I", name: "Iodine", mass: "126.9", group: 17, period: 5 },
    { number: 54, symbol: "Xe", name: "Xenon", mass: "131.29", group: 18, period: 5 },
    { number: 55, symbol: "Cs", name: "Cesium", mass: "132.91", group: 1, period: 6 },
    { number: 56, symbol: "Ba", name: "Barium", mass: "137.33", group: 2, period: 6 },
    { number: 57, symbol: "La", name: "Lanthanum", mass: "138.91", group: 3, period: 6 },
    { number: 58, symbol: "Ce", name: "Cerium", mass: "140.12", group: 3, period: 6 },
    { number: 59, symbol: "Pr", name: "Praseodymium", mass: "140.91", group: 3, period: 6 },
    { number: 60, symbol: "Nd", name: "Neodymium", mass: "144.24", group: 3, period: 6 },
    { number: 61, symbol: "Pm", name: "Promethium", mass: "145", group: 3, period: 6 },
    { number: 62, symbol: "Sm", name: "Samarium", mass: "150.36", group: 3, period: 6 },
    { number: 63, symbol: "Eu", name: "Europium", mass: "151.96", group: 3, period: 6 },
    { number: 64, symbol: "Gd", name: "Gadolinium", mass: "157.25", group: 3, period: 6 },
    { number: 65, symbol: "Tb", name: "Terbium", mass: "158.93", group: 3, period: 6 },
    { number: 66, symbol: "Dy", name: "Dysprosium", mass: "162.5", group: 3, period: 6 },
    { number: 67, symbol: "Ho", name: "Holmium", mass: "164.93", group: 3, period: 6 },
    { number: 68, symbol: "Er", name: "Erbium", mass: "167.26", group: 3, period: 6 },
    { number: 69, symbol: "Tm", name: "Thulium", mass: "168.93", group: 3, period: 6 },
    { number: 70, symbol: "Yb", name: "Ytterbium", mass: "173.04", group: 3, period: 6 },
    { number: 71, symbol: "Lu", name: "Lutetium", mass: "174.97", group: 3, period: 6 },
    { number: 72, symbol: "Hf", name: "Hafnium", mass: "178.49", group: 4, period: 6 },
    { number: 73, symbol: "Ta", name: "Tantalum", mass: "180.95", group: 5, period: 6 },
    { number: 74, symbol: "W", name: "Tungsten", mass: "183.84", group: 6, period: 6 },
    { number: 75, symbol: "Re", name: "Rhenium", mass: "186.21", group: 7, period: 6 },
    { number: 76, symbol: "Os", name: "Osmium", mass: "190.23", group: 8, period: 6 },
    { number: 77, symbol: "Ir", name: "Iridium", mass: "192.22", group: 9, period: 6 },
    { number: 78, symbol: "Pt", name: "Platinum", mass: "195.08", group: 10, period: 6 },
    { number: 79, symbol: "Au", name: "Gold", mass: "196.97", group: 11, period: 6 },
    { number: 80, symbol: "Hg", name: "Mercury", mass: "200.59", group: 12, period: 6 },
    { number: 81, symbol: "Tl", name: "Thallium", mass: "204.38", group: 13, period: 6 },
    { number: 82, symbol: "Pb", name: "Lead", mass: "207.2", group: 14, period: 6 },
    { number: 83, symbol: "Bi", name: "Bismuth", mass: "208.98", group: 15, period: 6 },
    { number: 84, symbol: "Po", name: "Polonium", mass: "209", group: 16, period: 6 },
    { number: 85, symbol: "At", name: "Astatine", mass: "210", group: 17, period: 6 },
    { number: 86, symbol: "Rn", name: "Radon", mass: "222", group: 18, period: 6 },
    { number: 87, symbol: "Fr", name: "Francium", mass: "223", group: 1, period: 7 },
    { number: 88, symbol: "Ra", name: "Radium", mass: "226", group: 2, period: 7 },
    { number: 89, symbol: "Ac", name: "Actinium", mass: "227", group: 3, period: 7 },
    { number: 90, symbol: "Th", name: "Thorium", mass: "232.04", group: 3, period: 7 },
    { number: 91, symbol: "Pa", name: "Protactinium", mass: "231.04", group: 3, period: 7 },
    { number: 92, symbol: "U", name: "Uranium", mass: "238.03", group: 3, period: 7 },
    { number: 93, symbol: "Np", name: "Neptunium", mass: "237", group: 3, period: 7 },
    { number: 94, symbol: "Pu", name: "Plutonium", mass: "244", group: 3, period: 7 },
    { number: 95, symbol: "Am", name: "Americium", mass: "243", group: 3, period: 7 },
    { number: 96, symbol: "Cm", name: "Curium", mass: "247", group: 3, period: 7 },
    { number: 97, symbol: "Bk", name: "Berkelium", mass: "247", group: 3, period: 7 },
    { number: 98, symbol: "Cf", name: "Californium", mass: "251", group: 3, period: 7 },
    { number: 99, symbol: "Es", name: "Einsteinium", mass: "252", group: 3, period: 7 },
    { number: 100, symbol: "Fm", name: "Fermium", mass: "257", group: 3, period: 7 },
    { number: 101, symbol: "Md", name: "Mendelevium", mass: "258", group: 3, period: 7 },
    { number: 102, symbol: "No", name: "Nobelium", mass: "259", group: 3, period: 7 },
    { number: 103, symbol: "Lr", name: "Lawrencium", mass: "262", group: 3, period: 7 },
    { number: 104, symbol: "Rf", name: "Rutherfordium", mass: "267", group: 4, period: 7 },
    { number: 105, symbol: "Db", name: "Dubnium", mass: "270", group: 5, period: 7 },
    { number: 106, symbol: "Sg", name: "Seaborgium", mass: "271", group: 6, period: 7 },
    { number: 107, symbol: "Bh", name: "Bohrium", mass: "270", group: 7, period: 7 },
    { number: 108, symbol: "Hs", name: "Hassium", mass: "277", group: 8, period: 7 },
    { number: 109, symbol: "Mt", name: "Meitnerium", mass: "276", group: 9, period: 7 },
    { number: 110, symbol: "Ds", name: "Darmstadtium", mass: "281", group: 10, period: 7 },
    { number: 111, symbol: "Rg", name: "Roentgenium", mass: "280", group: 11, period: 7 },
    { number: 112, symbol: "Cn", name: "Copernicium", mass: "285", group: 12, period: 7 },
    { number: 113, symbol: "Nh", name: "Nihonium", mass: "284", group: 13, period: 7 },
    { number: 114, symbol: "Fl", name: "Flerovium", mass: "289", group: 14, period: 7 },
    { number: 115, symbol: "Mc", name: "Moscovium", mass: "288", group: 15, period: 7 },
    { number: 116, symbol: "Lv", name: "Livermorium", mass: "293", group: 16, period: 7 },
    { number: 117, symbol: "Ts", name: "Tennessine", mass: "294", group: 17, period: 7 },
    { number: 118, symbol: "Og", name: "Oganesson", mass: "295", group: 18, period: 7 }
];

const categories = {
    H: "Nonmetal",
    He: "Noble Gas",
    Li: "Alkali Metal",
    Be: "Alkaline Earth Metal",
    B: "Metalloid",
    C: "Nonmetal",
    N: "Nonmetal",
    O: "Nonmetal",
    F: "Halogen",
    Ne: "Noble Gas",
    Na: "Alkali Metal",
    Mg: "Alkaline Earth Metal",
    Al: "Post-Transition Metal",
    Si: "Metalloid",
    P: "Nonmetal",
    S: "Nonmetal",
    Cl: "Halogen",
    Ar: "Noble Gas",
    K: "Alkali Metal",
    Ca: "Alkaline Earth Metal",
    Sc: "Transition Metal",
    Ti: "Transition Metal",
    V: "Transition Metal",
    Cr: "Transition Metal",
    Mn: "Transition Metal",
    Fe: "Transition Metal",
    Co: "Transition Metal",
    Ni: "Transition Metal",
    Cu: "Transition Metal",
    Zn: "Transition Metal",
    Br: "Halogen",
    Kr: "Noble Gas",
    Ag: "Transition Metal",
    Au: "Transition Metal",
    Hg: "Transition Metal",
    I: "Halogen",
    Xe: "Noble Gas",
    Rn: "Noble Gas"
};

elements.forEach(element => {
    element.category = categories[element.symbol] || "Unknown";
});

const elementFacts = {
  H: "🚀 Hydrogen is the lightest and most abundant element in the universe.",
  He: "🎈 Helium is lighter than air and used in balloons.",
  Li: "🔋 Lithium is widely used in rechargeable batteries.",
  Be: "🛰️ Beryllium is used in aerospace materials because it is lightweight.",
  B: "🔥 Boron is used in heat-resistant glass and detergents.",
  C: "💎 Carbon exists as diamond and graphite.",
  N: "🌱 Nitrogen makes up about 78% of Earth’s atmosphere.",
  O: "🫁 Oxygen is essential for human respiration.",
  F: "🦷 Fluorine is commonly found in toothpaste.",
  Ne: "💡 Neon is used in colorful advertising signs.",
  Na: "🧂 Sodium is a major component of table salt.",
  Mg: "📸 Magnesium burns with a bright white flame.",
  Al: "✈️ Aluminium is lightweight and used in aircraft.",
  Si: "💻 Silicon is the foundation of computer chips.",
  P: "⚡ Phosphorus glows faintly in the dark.",
  S: "🌋 Sulfur is commonly found near volcanoes.",
  Cl: "🏊 Chlorine is used to disinfect swimming pools.",
  Ar: "💡 Argon is used inside electric light bulbs.",
  K: "🍌 Potassium is important for muscle function.",
  Ca: "🦴 Calcium strengthens bones and teeth.",
  Sc: "🏌️ Scandium is used in sports equipment and aerospace alloys.",
  Ti: "🛩️ Titanium is strong, lightweight, and corrosion-resistant.",
  V: "🔩 Vanadium strengthens steel alloys.",
  Cr: "✨ Chromium gives stainless steel its shine.",
  Mn: "🔋 Manganese is important in battery production.",
  Fe: "🧲 Iron is the main component of steel.",
  Co: "🎨 Cobalt gives blue color to glass and ceramics.",
  Ni: "🪙 Nickel is commonly used in coins.",
  Cu: "⚡ Copper is an excellent conductor of electricity.",
  Zn: "🛡️ Zinc protects iron from rusting.",
  Ga: "🌡️ Gallium can melt in your hand.",
  Ge: "📡 Germanium is used in semiconductors.",
  As: "☠️ Arsenic is toxic but used in electronics.",
  Se: "📷 Selenium is used in photocells and electronics.",
  Br: "🌊 Bromine is one of the few liquid elements.",
  Kr: "💡 Krypton is used in high-performance lighting.",
  Rb: "⚛️ Rubidium is highly reactive with water.",
  Sr: "🎆 Strontium produces red fireworks.",
  Y: "📺 Yttrium is used in LED and display technology.",
  Zr: "⚙️ Zirconium resists corrosion and is used in reactors.",
  Nb: "🧲 Niobium is used in superconducting magnets.",
  Mo: "🔥 Molybdenum helps steel withstand high temperatures.",
  Tc: "☢️ Technetium was the first artificially produced element.",
  Ru: "💍 Ruthenium is used in durable jewelry coatings.",
  Rh: "🚗 Rhodium is used in catalytic converters.",
  Pd: "🚘 Palladium is important in car exhaust systems.",
  Ag: "🥈 Silver has the highest electrical conductivity.",
  Cd: "🔋 Cadmium is used in rechargeable batteries.",
  In: "📱 Indium is used in touchscreens.",
  Sn: "🥫 Tin is used to coat food cans.",
  Sb: "🔥 Antimony improves flame resistance.",
  Te: "☀️ Tellurium is used in solar panels.",
  I: "🩺 Iodine is essential for thyroid health.",
  Xe: "🚘 Xenon is used in bright car headlights.",
  Cs: "⏰ Cesium is used in atomic clocks.",
  Ba: "🏥 Barium compounds are used in medical imaging.",
  La: "📷 Lanthanum is used in camera lenses.",
  Ce: "🔥 Cerium is used in lighter flints.",
  Pr: "🟢 Praseodymium gives glass a green color.",
  Nd: "🧲 Neodymium magnets are extremely powerful.",
  Pm: "☢️ Promethium is radioactive.",
  Sm: "🎧 Samarium is used in strong magnets.",
  Eu: "💡 Europium creates red colors in TV screens.",
  Gd: "🏥 Gadolinium is used in MRI scans.",
  Tb: "💚 Terbium produces green phosphors.",
  Dy: "🧲 Dysprosium improves magnet performance.",
  Ho: "⚡ Holmium has one of the strongest magnetic properties.",
  Er: "🌐 Erbium is used in fiber optic cables.",
  Tm: "📡 Thulium is used in portable X-ray devices.",
  Yb: "🔬 Ytterbium is used in atomic clocks and lasers.",
  Lu: "🧪 Lutetium is one of the rarest rare-earth elements.",
  Hf: "🚀 Hafnium is used in nuclear control rods.",
  Ta: "📱 Tantalum is used in mobile phone capacitors.",
  W: "💡 Tungsten has the highest melting point of all metals.",
  Re: "🛩️ Rhenium is used in jet engines.",
  Os: "⚖️ Osmium is one of the densest elements.",
  Ir: "🌋 Iridium is highly resistant to corrosion.",
  Pt: "💍 Platinum is used in fine jewelry.",
  Au: "👑 Gold does not rust or tarnish.",
  Hg: "🌡️ Mercury is liquid at room temperature.",
  Tl: "☠️ Thallium is highly toxic.",
  Pb: "🔋 Lead is widely used in car batteries.",
  Bi: "💄 Bismuth is used in cosmetics and medicines.",
  Po: "☢️ Polonium is extremely radioactive.",
  At: "🔬 Astatine is one of the rarest elements on Earth.",
  Rn: "☢️ Radon is a radioactive gas.",
  Fr: "⚡ Francium is extremely reactive.",
  Ra: "☢️ Radium glows because of radioactivity.",
  Ac: "🔬 Actinium is used in scientific research.",
  Th: "⚛️ Thorium can be used as nuclear fuel.",
  Pa: "☢️ Protactinium is rare and radioactive.",
  U: "⚛️ Uranium is used in nuclear power plants.",
  Np: "☢️ Neptunium is radioactive and synthetic.",
  Pu: "⚛️ Plutonium is used in nuclear weapons and reactors.",
  Am: "🚨 Americium is used in smoke detectors.",
  Cm: "🔬 Curium is used in space research.",
  Bk: "🧪 Berkelium is mainly used for research.",
  Cf: "🔍 Californium is used in neutron detectors.",
  Es: "⚛️ Einsteinium was discovered in nuclear explosion debris.",
  Fm: "🔬 Fermium is a synthetic radioactive element.",
  Md: "🧪 Mendelevium is named after Dmitri Mendeleev.",
  No: "⚛️ Nobelium is named after Alfred Nobel.",
  Lr: "🔬 Lawrencium is named after Ernest Lawrence.",
  Rf: "⚛️ Rutherfordium honors Ernest Rutherford.",
  Db: "🔬 Dubnium is named after Dubna, Russia.",
  Sg: "🧪 Seaborgium is named after Glenn Seaborg.",
  Bh: "⚛️ Bohrium is named after Niels Bohr.",
  Hs: "🔬 Hassium is named after the German state of Hesse.",
  Mt: "🧪 Meitnerium honors physicist Lise Meitner.",
  Ds: "⚛️ Darmstadtium is named after Darmstadt, Germany.",
  Rg: "🪙 Roentgenium honors Wilhelm Röntgen.",
  Cn: "🔬 Copernicium is named after Nicolaus Copernicus.",
  Nh: "🇯🇵 Nihonium is named after Japan.",
  Fl: "⚛️ Flerovium honors the Flerov Laboratory.",
  Mc: "🧪 Moscovium is named after Moscow region.",
  Lv: "🔬 Livermorium honors Lawrence Livermore Laboratory.",
  Ts: "⚛️ Tennessine is named after Tennessee.",
  Og: "🌌 Oganesson is named after physicist Yuri Oganessian."
};


const container = document.querySelector(".table-container");

const totalGroups = 18; // Total groups (columns) in the periodic table
const totalPeriods = 7; // Total periods (rows) in the periodic table

// Create a grid structure for the periodic table
for (let period = 1; period <= totalPeriods; period++) {
    for (let group = 1; group <= totalGroups; group++) {
        const cell = document.createElement("div");
        cell.className = "empty"; // Default empty cell

        // Find an element matching the group and period
        const element = elements.find((el) => el.group === group && el.period === period);

        if (element) {
            cell.className = "element";
           cell.innerHTML = `
    <div class="element-number">${element.number}</div>
    <div class="element-symbol">${element.symbol}</div>
    <div class="element-name">${element.name}</div>
    <div class="tooltip">Atomic Mass: ${element.mass}</div>
`;

cell.dataset.name = element.name;
cell.dataset.symbol = element.symbol;
cell.dataset.number = element.number;
cell.dataset.mass = element.mass;
cell.dataset.group = element.group;
cell.dataset.period = element.period;
cell.dataset.category = element.category;
            
        }

        container.appendChild(cell);
    }
}
const toggleBtn = document.getElementById("theme-toggle");

toggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
        toggleBtn.textContent = "☀️ Light Mode";
    } else {
        toggleBtn.textContent = "🌙 Dark Mode";
    }
});

/* Modal Elements */
const modal = document.getElementById("element-modal");
const closeBtn = document.querySelector(".close-btn");

/* Modal Data Fields */
const modalName = document.getElementById("modal-name");
const modalSymbol = document.getElementById("modal-symbol");
const modalNumber = document.getElementById("modal-number");
const modalMass = document.getElementById("modal-mass");
const modalGroup = document.getElementById("modal-group");
const modalPeriod = document.getElementById("modal-period");
const modalCategory = document.getElementById("modal-category");
const modalFact = document.getElementById("modal-fact");

/* Open Modal on Element Click */
document.querySelectorAll(".element").forEach((elementCard) => {

    elementCard.addEventListener("click", () => {

        modalName.textContent = elementCard.dataset.name;
        modalSymbol.textContent = elementCard.dataset.symbol;
        modalNumber.textContent = elementCard.dataset.number;
        modalMass.textContent = elementCard.dataset.mass;
        modalGroup.textContent = elementCard.dataset.group;
        modalPeriod.textContent = elementCard.dataset.period;
        modalCategory.textContent = elementCard.dataset.category;
        modalFact.textContent = elementFacts[elementCard.dataset.symbol];

        const category = elementCard.dataset.category;

if (category === "Nonmetal") {
    modalCategory.style.background = "#43a047";
}
else if (category === "Noble Gas") {
    modalCategory.style.background = "#1e88e5";
}
else if (category === "Alkali Metal") {
    modalCategory.style.background = "#e53935";
}
else if (category === "Transition Metal") {
    modalCategory.style.background = "#f9a825";
}
else if (category === "Metalloid") {
    modalCategory.style.background = "#8e24aa";
}
else {
    modalCategory.style.background = "#546e7a";
}


        modal.style.display = "flex";
    });
});


/* Close Modal */
closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
});

/* Close when clicking outside */
window.addEventListener("click", (e) => {
    if (e.target === modal) {
        modal.style.display = "none";
    }
});

/* ESC key support */
window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        modal.style.display = "none";
    }
});

