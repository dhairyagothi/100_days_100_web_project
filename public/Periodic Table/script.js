const elements = [
    {
        "number": 1,
        "symbol": "H",
        "name": "Hydrogen",
        "mass": 1.008,
        "group": 1,
        "period": 1,
        "category": "Diatomic Nonmetal",
        "electronegativity": 2.2,
        "meltingPoint": 13.99,
        "boilingPoint": 20.271
    },
    {
        "number": 2,
        "symbol": "He",
        "name": "Helium",
        "mass": 4.003,
        "group": 18,
        "period": 1,
        "category": "Noble Gas",
        "electronegativity": null,
        "meltingPoint": 0.95,
        "boilingPoint": 4.222
    },
    {
        "number": 3,
        "symbol": "Li",
        "name": "Lithium",
        "mass": 6.94,
        "group": 1,
        "period": 2,
        "category": "Alkali Metal",
        "electronegativity": 0.98,
        "meltingPoint": 453.65,
        "boilingPoint": 1603
    },
    {
        "number": 4,
        "symbol": "Be",
        "name": "Beryllium",
        "mass": 9.012,
        "group": 2,
        "period": 2,
        "category": "Alkaline Earth Metal",
        "electronegativity": 1.57,
        "meltingPoint": 1560,
        "boilingPoint": 2742
    },
    {
        "number": 5,
        "symbol": "B",
        "name": "Boron",
        "mass": 10.81,
        "group": 13,
        "period": 2,
        "category": "Metalloid",
        "electronegativity": 2.04,
        "meltingPoint": 2349,
        "boilingPoint": 4200
    },
    {
        "number": 6,
        "symbol": "C",
        "name": "Carbon",
        "mass": 12.011,
        "group": 14,
        "period": 2,
        "category": "Polyatomic Nonmetal",
        "electronegativity": 2.55,
        "meltingPoint": null,
        "boilingPoint": null
    },
    {
        "number": 7,
        "symbol": "N",
        "name": "Nitrogen",
        "mass": 14.007,
        "group": 15,
        "period": 2,
        "category": "Diatomic Nonmetal",
        "electronegativity": 3.04,
        "meltingPoint": 63.15,
        "boilingPoint": 77.355
    },
    {
        "number": 8,
        "symbol": "O",
        "name": "Oxygen",
        "mass": 15.999,
        "group": 16,
        "period": 2,
        "category": "Diatomic Nonmetal",
        "electronegativity": 3.44,
        "meltingPoint": 54.36,
        "boilingPoint": 90.188
    },
    {
        "number": 9,
        "symbol": "F",
        "name": "Fluorine",
        "mass": 18.998,
        "group": 17,
        "period": 2,
        "category": "Diatomic Nonmetal",
        "electronegativity": 3.98,
        "meltingPoint": 53.48,
        "boilingPoint": 85.03
    },
    {
        "number": 10,
        "symbol": "Ne",
        "name": "Neon",
        "mass": 20.18,
        "group": 18,
        "period": 2,
        "category": "Noble Gas",
        "electronegativity": null,
        "meltingPoint": 24.56,
        "boilingPoint": 27.104
    },
    {
        "number": 11,
        "symbol": "Na",
        "name": "Sodium",
        "mass": 22.99,
        "group": 1,
        "period": 3,
        "category": "Alkali Metal",
        "electronegativity": 0.93,
        "meltingPoint": 370.944,
        "boilingPoint": 1156.09
    },
    {
        "number": 12,
        "symbol": "Mg",
        "name": "Magnesium",
        "mass": 24.305,
        "group": 2,
        "period": 3,
        "category": "Alkaline Earth Metal",
        "electronegativity": 1.31,
        "meltingPoint": 923,
        "boilingPoint": 1363
    },
    {
        "number": 13,
        "symbol": "Al",
        "name": "Aluminium",
        "mass": 26.982,
        "group": 13,
        "period": 3,
        "category": "Post-transition Metal",
        "electronegativity": 1.61,
        "meltingPoint": 933.47,
        "boilingPoint": 2743
    },
    {
        "number": 14,
        "symbol": "Si",
        "name": "Silicon",
        "mass": 28.085,
        "group": 14,
        "period": 3,
        "category": "Metalloid",
        "electronegativity": 1.9,
        "meltingPoint": 1687,
        "boilingPoint": 3538
    },
    {
        "number": 15,
        "symbol": "P",
        "name": "Phosphorus",
        "mass": 30.974,
        "group": 15,
        "period": 3,
        "category": "Polyatomic Nonmetal",
        "electronegativity": 2.19,
        "meltingPoint": null,
        "boilingPoint": null
    },
    {
        "number": 16,
        "symbol": "S",
        "name": "Sulfur",
        "mass": 32.06,
        "group": 16,
        "period": 3,
        "category": "Polyatomic Nonmetal",
        "electronegativity": 2.58,
        "meltingPoint": 388.36,
        "boilingPoint": 717.8
    },
    {
        "number": 17,
        "symbol": "Cl",
        "name": "Chlorine",
        "mass": 35.45,
        "group": 17,
        "period": 3,
        "category": "Diatomic Nonmetal",
        "electronegativity": 3.16,
        "meltingPoint": 171.6,
        "boilingPoint": 239.11
    },
    {
        "number": 18,
        "symbol": "Ar",
        "name": "Argon",
        "mass": 39.948,
        "group": 18,
        "period": 3,
        "category": "Noble Gas",
        "electronegativity": null,
        "meltingPoint": 83.81,
        "boilingPoint": 87.302
    },
    {
        "number": 19,
        "symbol": "K",
        "name": "Potassium",
        "mass": 39.098,
        "group": 1,
        "period": 4,
        "category": "Alkali Metal",
        "electronegativity": 0.82,
        "meltingPoint": 336.7,
        "boilingPoint": 1032
    },
    {
        "number": 20,
        "symbol": "Ca",
        "name": "Calcium",
        "mass": 40.078,
        "group": 2,
        "period": 4,
        "category": "Alkaline Earth Metal",
        "electronegativity": 1,
        "meltingPoint": 1115,
        "boilingPoint": 1757
    },
    {
        "number": 21,
        "symbol": "Sc",
        "name": "Scandium",
        "mass": 44.956,
        "group": 3,
        "period": 4,
        "category": "Transition Metal",
        "electronegativity": 1.36,
        "meltingPoint": 1814,
        "boilingPoint": 3109
    },
    {
        "number": 22,
        "symbol": "Ti",
        "name": "Titanium",
        "mass": 47.867,
        "group": 4,
        "period": 4,
        "category": "Transition Metal",
        "electronegativity": 1.54,
        "meltingPoint": 1941,
        "boilingPoint": 3560
    },
    {
        "number": 23,
        "symbol": "V",
        "name": "Vanadium",
        "mass": 50.942,
        "group": 5,
        "period": 4,
        "category": "Transition Metal",
        "electronegativity": 1.63,
        "meltingPoint": 2183,
        "boilingPoint": 3680
    },
    {
        "number": 24,
        "symbol": "Cr",
        "name": "Chromium",
        "mass": 51.996,
        "group": 6,
        "period": 4,
        "category": "Transition Metal",
        "electronegativity": 1.66,
        "meltingPoint": 2180,
        "boilingPoint": 2944
    },
    {
        "number": 25,
        "symbol": "Mn",
        "name": "Manganese",
        "mass": 54.938,
        "group": 7,
        "period": 4,
        "category": "Transition Metal",
        "electronegativity": 1.55,
        "meltingPoint": 1519,
        "boilingPoint": 2334
    },
    {
        "number": 26,
        "symbol": "Fe",
        "name": "Iron",
        "mass": 55.845,
        "group": 8,
        "period": 4,
        "category": "Transition Metal",
        "electronegativity": 1.83,
        "meltingPoint": 1811,
        "boilingPoint": 3134
    },
    {
        "number": 27,
        "symbol": "Co",
        "name": "Cobalt",
        "mass": 58.933,
        "group": 9,
        "period": 4,
        "category": "Transition Metal",
        "electronegativity": 1.88,
        "meltingPoint": 1768,
        "boilingPoint": 3200
    },
    {
        "number": 28,
        "symbol": "Ni",
        "name": "Nickel",
        "mass": 58.693,
        "group": 10,
        "period": 4,
        "category": "Transition Metal",
        "electronegativity": 1.91,
        "meltingPoint": 1728,
        "boilingPoint": 3003
    },
    {
        "number": 29,
        "symbol": "Cu",
        "name": "Copper",
        "mass": 63.546,
        "group": 11,
        "period": 4,
        "category": "Transition Metal",
        "electronegativity": 1.9,
        "meltingPoint": 1357.77,
        "boilingPoint": 2835
    },
    {
        "number": 30,
        "symbol": "Zn",
        "name": "Zinc",
        "mass": 65.382,
        "group": 12,
        "period": 4,
        "category": "Transition Metal",
        "electronegativity": 1.65,
        "meltingPoint": 692.68,
        "boilingPoint": 1180
    },
    {
        "number": 31,
        "symbol": "Ga",
        "name": "Gallium",
        "mass": 69.723,
        "group": 13,
        "period": 4,
        "category": "Post-transition Metal",
        "electronegativity": 1.81,
        "meltingPoint": 302.9146,
        "boilingPoint": 2673
    },
    {
        "number": 32,
        "symbol": "Ge",
        "name": "Germanium",
        "mass": 72.631,
        "group": 14,
        "period": 4,
        "category": "Metalloid",
        "electronegativity": 2.01,
        "meltingPoint": 1211.4,
        "boilingPoint": 3106
    },
    {
        "number": 33,
        "symbol": "As",
        "name": "Arsenic",
        "mass": 74.922,
        "group": 15,
        "period": 4,
        "category": "Metalloid",
        "electronegativity": 2.18,
        "meltingPoint": null,
        "boilingPoint": null
    },
    {
        "number": 34,
        "symbol": "Se",
        "name": "Selenium",
        "mass": 78.972,
        "group": 16,
        "period": 4,
        "category": "Polyatomic Nonmetal",
        "electronegativity": 2.55,
        "meltingPoint": 494,
        "boilingPoint": 958
    },
    {
        "number": 35,
        "symbol": "Br",
        "name": "Bromine",
        "mass": 79.904,
        "group": 17,
        "period": 4,
        "category": "Diatomic Nonmetal",
        "electronegativity": 2.96,
        "meltingPoint": 265.8,
        "boilingPoint": 332
    },
    {
        "number": 36,
        "symbol": "Kr",
        "name": "Krypton",
        "mass": 83.798,
        "group": 18,
        "period": 4,
        "category": "Noble Gas",
        "electronegativity": 3,
        "meltingPoint": 115.78,
        "boilingPoint": 119.93
    },
    {
        "number": 37,
        "symbol": "Rb",
        "name": "Rubidium",
        "mass": 85.468,
        "group": 1,
        "period": 5,
        "category": "Alkali Metal",
        "electronegativity": 0.82,
        "meltingPoint": 312.45,
        "boilingPoint": 961
    },
    {
        "number": 38,
        "symbol": "Sr",
        "name": "Strontium",
        "mass": 87.621,
        "group": 2,
        "period": 5,
        "category": "Alkaline Earth Metal",
        "electronegativity": 0.95,
        "meltingPoint": 1050,
        "boilingPoint": 1650
    },
    {
        "number": 39,
        "symbol": "Y",
        "name": "Yttrium",
        "mass": 88.906,
        "group": 3,
        "period": 5,
        "category": "Transition Metal",
        "electronegativity": 1.22,
        "meltingPoint": 1799,
        "boilingPoint": 3203
    },
    {
        "number": 40,
        "symbol": "Zr",
        "name": "Zirconium",
        "mass": 91.224,
        "group": 4,
        "period": 5,
        "category": "Transition Metal",
        "electronegativity": 1.33,
        "meltingPoint": 2128,
        "boilingPoint": 4650
    },
    {
        "number": 41,
        "symbol": "Nb",
        "name": "Niobium",
        "mass": 92.906,
        "group": 5,
        "period": 5,
        "category": "Transition Metal",
        "electronegativity": 1.6,
        "meltingPoint": 2750,
        "boilingPoint": 5017
    },
    {
        "number": 42,
        "symbol": "Mo",
        "name": "Molybdenum",
        "mass": 95.951,
        "group": 6,
        "period": 5,
        "category": "Transition Metal",
        "electronegativity": 2.16,
        "meltingPoint": 2896,
        "boilingPoint": 4912
    },
    {
        "number": 43,
        "symbol": "Tc",
        "name": "Technetium",
        "mass": 98,
        "group": 7,
        "period": 5,
        "category": "Transition Metal",
        "electronegativity": 1.9,
        "meltingPoint": 2430,
        "boilingPoint": 4538
    },
    {
        "number": 44,
        "symbol": "Ru",
        "name": "Ruthenium",
        "mass": 101.072,
        "group": 8,
        "period": 5,
        "category": "Transition Metal",
        "electronegativity": 2.2,
        "meltingPoint": 2607,
        "boilingPoint": 4423
    },
    {
        "number": 45,
        "symbol": "Rh",
        "name": "Rhodium",
        "mass": 102.906,
        "group": 9,
        "period": 5,
        "category": "Transition Metal",
        "electronegativity": 2.28,
        "meltingPoint": 2237,
        "boilingPoint": 3968
    },
    {
        "number": 46,
        "symbol": "Pd",
        "name": "Palladium",
        "mass": 106.421,
        "group": 10,
        "period": 5,
        "category": "Transition Metal",
        "electronegativity": 2.2,
        "meltingPoint": 1828.05,
        "boilingPoint": 3236
    },
    {
        "number": 47,
        "symbol": "Ag",
        "name": "Silver",
        "mass": 107.868,
        "group": 11,
        "period": 5,
        "category": "Transition Metal",
        "electronegativity": 1.93,
        "meltingPoint": 1234.93,
        "boilingPoint": 2435
    },
    {
        "number": 48,
        "symbol": "Cd",
        "name": "Cadmium",
        "mass": 112.414,
        "group": 12,
        "period": 5,
        "category": "Transition Metal",
        "electronegativity": 1.69,
        "meltingPoint": 594.22,
        "boilingPoint": 1040
    },
    {
        "number": 49,
        "symbol": "In",
        "name": "Indium",
        "mass": 114.818,
        "group": 13,
        "period": 5,
        "category": "Post-transition Metal",
        "electronegativity": 1.78,
        "meltingPoint": 429.7485,
        "boilingPoint": 2345
    },
    {
        "number": 50,
        "symbol": "Sn",
        "name": "Tin",
        "mass": 118.711,
        "group": 14,
        "period": 5,
        "category": "Post-transition Metal",
        "electronegativity": 1.96,
        "meltingPoint": 505.08,
        "boilingPoint": 2875
    },
    {
        "number": 51,
        "symbol": "Sb",
        "name": "Antimony",
        "mass": 121.76,
        "group": 15,
        "period": 5,
        "category": "Metalloid",
        "electronegativity": 2.05,
        "meltingPoint": 903.78,
        "boilingPoint": 1908
    },
    {
        "number": 52,
        "symbol": "Te",
        "name": "Tellurium",
        "mass": 127.603,
        "group": 16,
        "period": 5,
        "category": "Metalloid",
        "electronegativity": 2.1,
        "meltingPoint": 722.66,
        "boilingPoint": 1261
    },
    {
        "number": 53,
        "symbol": "I",
        "name": "Iodine",
        "mass": 126.904,
        "group": 17,
        "period": 5,
        "category": "Diatomic Nonmetal",
        "electronegativity": 2.66,
        "meltingPoint": 386.85,
        "boilingPoint": 457.4
    },
    {
        "number": 54,
        "symbol": "Xe",
        "name": "Xenon",
        "mass": 131.294,
        "group": 18,
        "period": 5,
        "category": "Noble Gas",
        "electronegativity": 2.6,
        "meltingPoint": 161.4,
        "boilingPoint": 165.051
    },
    {
        "number": 55,
        "symbol": "Cs",
        "name": "Cesium",
        "mass": 132.905,
        "group": 1,
        "period": 6,
        "category": "Alkali Metal",
        "electronegativity": 0.79,
        "meltingPoint": 301.7,
        "boilingPoint": 944
    },
    {
        "number": 56,
        "symbol": "Ba",
        "name": "Barium",
        "mass": 137.328,
        "group": 2,
        "period": 6,
        "category": "Alkaline Earth Metal",
        "electronegativity": 0.89,
        "meltingPoint": 1000,
        "boilingPoint": 2118
    },
    {
        "number": 57,
        "symbol": "La",
        "name": "Lanthanum",
        "mass": 138.905,
        "group": 3,
        "period": 9,
        "category": "Lanthanide",
        "electronegativity": 1.1,
        "meltingPoint": 1193,
        "boilingPoint": 3737
    },
    {
        "number": 58,
        "symbol": "Ce",
        "name": "Cerium",
        "mass": 140.116,
        "group": 4,
        "period": 9,
        "category": "Lanthanide",
        "electronegativity": 1.12,
        "meltingPoint": 1068,
        "boilingPoint": 3716
    },
    {
        "number": 59,
        "symbol": "Pr",
        "name": "Praseodymium",
        "mass": 140.908,
        "group": 5,
        "period": 9,
        "category": "Lanthanide",
        "electronegativity": 1.13,
        "meltingPoint": 1208,
        "boilingPoint": 3403
    },
    {
        "number": 60,
        "symbol": "Nd",
        "name": "Neodymium",
        "mass": 144.242,
        "group": 6,
        "period": 9,
        "category": "Lanthanide",
        "electronegativity": 1.14,
        "meltingPoint": 1297,
        "boilingPoint": 3347
    },
    {
        "number": 61,
        "symbol": "Pm",
        "name": "Promethium",
        "mass": 145,
        "group": 7,
        "period": 9,
        "category": "Lanthanide",
        "electronegativity": 1.13,
        "meltingPoint": 1315,
        "boilingPoint": 3273
    },
    {
        "number": 62,
        "symbol": "Sm",
        "name": "Samarium",
        "mass": 150.362,
        "group": 8,
        "period": 9,
        "category": "Lanthanide",
        "electronegativity": 1.17,
        "meltingPoint": 1345,
        "boilingPoint": 2173
    },
    {
        "number": 63,
        "symbol": "Eu",
        "name": "Europium",
        "mass": 151.964,
        "group": 9,
        "period": 9,
        "category": "Lanthanide",
        "electronegativity": 1.2,
        "meltingPoint": 1099,
        "boilingPoint": 1802
    },
    {
        "number": 64,
        "symbol": "Gd",
        "name": "Gadolinium",
        "mass": 157.253,
        "group": 10,
        "period": 9,
        "category": "Lanthanide",
        "electronegativity": 1.2,
        "meltingPoint": 1585,
        "boilingPoint": 3273
    },
    {
        "number": 65,
        "symbol": "Tb",
        "name": "Terbium",
        "mass": 158.925,
        "group": 11,
        "period": 9,
        "category": "Lanthanide",
        "electronegativity": 1.1,
        "meltingPoint": 1629,
        "boilingPoint": 3396
    },
    {
        "number": 66,
        "symbol": "Dy",
        "name": "Dysprosium",
        "mass": 162.5,
        "group": 12,
        "period": 9,
        "category": "Lanthanide",
        "electronegativity": 1.22,
        "meltingPoint": 1680,
        "boilingPoint": 2840
    },
    {
        "number": 67,
        "symbol": "Ho",
        "name": "Holmium",
        "mass": 164.93,
        "group": 13,
        "period": 9,
        "category": "Lanthanide",
        "electronegativity": 1.23,
        "meltingPoint": 1734,
        "boilingPoint": 2873
    },
    {
        "number": 68,
        "symbol": "Er",
        "name": "Erbium",
        "mass": 167.259,
        "group": 14,
        "period": 9,
        "category": "Lanthanide",
        "electronegativity": 1.24,
        "meltingPoint": 1802,
        "boilingPoint": 3141
    },
    {
        "number": 69,
        "symbol": "Tm",
        "name": "Thulium",
        "mass": 168.934,
        "group": 15,
        "period": 9,
        "category": "Lanthanide",
        "electronegativity": 1.25,
        "meltingPoint": 1818,
        "boilingPoint": 2223
    },
    {
        "number": 70,
        "symbol": "Yb",
        "name": "Ytterbium",
        "mass": 173.045,
        "group": 16,
        "period": 9,
        "category": "Lanthanide",
        "electronegativity": 1.1,
        "meltingPoint": 1097,
        "boilingPoint": 1469
    },
    {
        "number": 71,
        "symbol": "Lu",
        "name": "Lutetium",
        "mass": 174.967,
        "group": 17,
        "period": 9,
        "category": "Lanthanide",
        "electronegativity": 1.27,
        "meltingPoint": 1925,
        "boilingPoint": 3675
    },
    {
        "number": 72,
        "symbol": "Hf",
        "name": "Hafnium",
        "mass": 178.492,
        "group": 4,
        "period": 6,
        "category": "Transition Metal",
        "electronegativity": 1.3,
        "meltingPoint": 2506,
        "boilingPoint": 4876
    },
    {
        "number": 73,
        "symbol": "Ta",
        "name": "Tantalum",
        "mass": 180.948,
        "group": 5,
        "period": 6,
        "category": "Transition Metal",
        "electronegativity": 1.5,
        "meltingPoint": 3290,
        "boilingPoint": 5731
    },
    {
        "number": 74,
        "symbol": "W",
        "name": "Tungsten",
        "mass": 183.841,
        "group": 6,
        "period": 6,
        "category": "Transition Metal",
        "electronegativity": 2.36,
        "meltingPoint": 3695,
        "boilingPoint": 6203
    },
    {
        "number": 75,
        "symbol": "Re",
        "name": "Rhenium",
        "mass": 186.207,
        "group": 7,
        "period": 6,
        "category": "Transition Metal",
        "electronegativity": 1.9,
        "meltingPoint": 3459,
        "boilingPoint": 5869
    },
    {
        "number": 76,
        "symbol": "Os",
        "name": "Osmium",
        "mass": 190.233,
        "group": 8,
        "period": 6,
        "category": "Transition Metal",
        "electronegativity": 2.2,
        "meltingPoint": 3306,
        "boilingPoint": 5285
    },
    {
        "number": 77,
        "symbol": "Ir",
        "name": "Iridium",
        "mass": 192.217,
        "group": 9,
        "period": 6,
        "category": "Transition Metal",
        "electronegativity": 2.2,
        "meltingPoint": 2719,
        "boilingPoint": 4403
    },
    {
        "number": 78,
        "symbol": "Pt",
        "name": "Platinum",
        "mass": 195.085,
        "group": 10,
        "period": 6,
        "category": "Transition Metal",
        "electronegativity": 2.28,
        "meltingPoint": 2041.4,
        "boilingPoint": 4098
    },
    {
        "number": 79,
        "symbol": "Au",
        "name": "Gold",
        "mass": 196.967,
        "group": 11,
        "period": 6,
        "category": "Transition Metal",
        "electronegativity": 2.54,
        "meltingPoint": 1337.33,
        "boilingPoint": 3243
    },
    {
        "number": 80,
        "symbol": "Hg",
        "name": "Mercury",
        "mass": 200.592,
        "group": 12,
        "period": 6,
        "category": "Transition Metal",
        "electronegativity": 2,
        "meltingPoint": 234.321,
        "boilingPoint": 629.88
    },
    {
        "number": 81,
        "symbol": "Tl",
        "name": "Thallium",
        "mass": 204.38,
        "group": 13,
        "period": 6,
        "category": "Post-transition Metal",
        "electronegativity": 1.62,
        "meltingPoint": 577,
        "boilingPoint": 1746
    },
    {
        "number": 82,
        "symbol": "Pb",
        "name": "Lead",
        "mass": 207.21,
        "group": 14,
        "period": 6,
        "category": "Post-transition Metal",
        "electronegativity": 1.87,
        "meltingPoint": 600.61,
        "boilingPoint": 2022
    },
    {
        "number": 83,
        "symbol": "Bi",
        "name": "Bismuth",
        "mass": 208.98,
        "group": 15,
        "period": 6,
        "category": "Post-transition Metal",
        "electronegativity": 2.02,
        "meltingPoint": 544.7,
        "boilingPoint": 1837
    },
    {
        "number": 84,
        "symbol": "Po",
        "name": "Polonium",
        "mass": 209,
        "group": 16,
        "period": 6,
        "category": "Post-transition Metal",
        "electronegativity": 2,
        "meltingPoint": 527,
        "boilingPoint": 1235
    },
    {
        "number": 85,
        "symbol": "At",
        "name": "Astatine",
        "mass": 210,
        "group": 17,
        "period": 6,
        "category": "Metalloid",
        "electronegativity": 2.2,
        "meltingPoint": 575,
        "boilingPoint": 610
    },
    {
        "number": 86,
        "symbol": "Rn",
        "name": "Radon",
        "mass": 222,
        "group": 18,
        "period": 6,
        "category": "Noble Gas",
        "electronegativity": 2.2,
        "meltingPoint": 202,
        "boilingPoint": 211.5
    },
    {
        "number": 87,
        "symbol": "Fr",
        "name": "Francium",
        "mass": 223,
        "group": 1,
        "period": 7,
        "category": "Alkali Metal",
        "electronegativity": 0.79,
        "meltingPoint": 300,
        "boilingPoint": 950
    },
    {
        "number": 88,
        "symbol": "Ra",
        "name": "Radium",
        "mass": 226,
        "group": 2,
        "period": 7,
        "category": "Alkaline Earth Metal",
        "electronegativity": 0.9,
        "meltingPoint": 1233,
        "boilingPoint": 2010
    },
    {
        "number": 89,
        "symbol": "Ac",
        "name": "Actinium",
        "mass": 227,
        "group": 3,
        "period": 10,
        "category": "Actinide",
        "electronegativity": 1.1,
        "meltingPoint": 1500,
        "boilingPoint": 3500
    },
    {
        "number": 90,
        "symbol": "Th",
        "name": "Thorium",
        "mass": 232.038,
        "group": 4,
        "period": 10,
        "category": "Actinide",
        "electronegativity": 1.3,
        "meltingPoint": 2023,
        "boilingPoint": 5061
    },
    {
        "number": 91,
        "symbol": "Pa",
        "name": "Protactinium",
        "mass": 231.036,
        "group": 5,
        "period": 10,
        "category": "Actinide",
        "electronegativity": 1.5,
        "meltingPoint": 1841,
        "boilingPoint": 4300
    },
    {
        "number": 92,
        "symbol": "U",
        "name": "Uranium",
        "mass": 238.029,
        "group": 6,
        "period": 10,
        "category": "Actinide",
        "electronegativity": 1.38,
        "meltingPoint": 1405.3,
        "boilingPoint": 4404
    },
    {
        "number": 93,
        "symbol": "Np",
        "name": "Neptunium",
        "mass": 237,
        "group": 7,
        "period": 10,
        "category": "Actinide",
        "electronegativity": 1.36,
        "meltingPoint": 912,
        "boilingPoint": 4447
    },
    {
        "number": 94,
        "symbol": "Pu",
        "name": "Plutonium",
        "mass": 244,
        "group": 8,
        "period": 10,
        "category": "Actinide",
        "electronegativity": 1.28,
        "meltingPoint": 912.5,
        "boilingPoint": 3505
    },
    {
        "number": 95,
        "symbol": "Am",
        "name": "Americium",
        "mass": 243,
        "group": 9,
        "period": 10,
        "category": "Actinide",
        "electronegativity": 1.13,
        "meltingPoint": 1449,
        "boilingPoint": 2880
    },
    {
        "number": 96,
        "symbol": "Cm",
        "name": "Curium",
        "mass": 247,
        "group": 10,
        "period": 10,
        "category": "Actinide",
        "electronegativity": 1.28,
        "meltingPoint": 1613,
        "boilingPoint": 3383
    },
    {
        "number": 97,
        "symbol": "Bk",
        "name": "Berkelium",
        "mass": 247,
        "group": 11,
        "period": 10,
        "category": "Actinide",
        "electronegativity": 1.3,
        "meltingPoint": 1259,
        "boilingPoint": 2900
    },
    {
        "number": 98,
        "symbol": "Cf",
        "name": "Californium",
        "mass": 251,
        "group": 12,
        "period": 10,
        "category": "Actinide",
        "electronegativity": 1.3,
        "meltingPoint": 1173,
        "boilingPoint": 1743
    },
    {
        "number": 99,
        "symbol": "Es",
        "name": "Einsteinium",
        "mass": 252,
        "group": 13,
        "period": 10,
        "category": "Actinide",
        "electronegativity": 1.3,
        "meltingPoint": 1133,
        "boilingPoint": 1269
    },
    {
        "number": 100,
        "symbol": "Fm",
        "name": "Fermium",
        "mass": 257,
        "group": 14,
        "period": 10,
        "category": "Actinide",
        "electronegativity": 1.3,
        "meltingPoint": 1800,
        "boilingPoint": null
    },
    {
        "number": 101,
        "symbol": "Md",
        "name": "Mendelevium",
        "mass": 258,
        "group": 15,
        "period": 10,
        "category": "Actinide",
        "electronegativity": 1.3,
        "meltingPoint": 1100,
        "boilingPoint": null
    },
    {
        "number": 102,
        "symbol": "No",
        "name": "Nobelium",
        "mass": 259,
        "group": 16,
        "period": 10,
        "category": "Actinide",
        "electronegativity": 1.3,
        "meltingPoint": 1100,
        "boilingPoint": null
    },
    {
        "number": 103,
        "symbol": "Lr",
        "name": "Lawrencium",
        "mass": 266,
        "group": 17,
        "period": 10,
        "category": "Actinide",
        "electronegativity": 1.3,
        "meltingPoint": 1900,
        "boilingPoint": null
    },
    {
        "number": 104,
        "symbol": "Rf",
        "name": "Rutherfordium",
        "mass": 267,
        "group": 4,
        "period": 7,
        "category": "Transition Metal",
        "electronegativity": null,
        "meltingPoint": 2400,
        "boilingPoint": 5800
    },
    {
        "number": 105,
        "symbol": "Db",
        "name": "Dubnium",
        "mass": 268,
        "group": 5,
        "period": 7,
        "category": "Transition Metal",
        "electronegativity": null,
        "meltingPoint": null,
        "boilingPoint": null
    },
    {
        "number": 106,
        "symbol": "Sg",
        "name": "Seaborgium",
        "mass": 269,
        "group": 6,
        "period": 7,
        "category": "Transition Metal",
        "electronegativity": null,
        "meltingPoint": null,
        "boilingPoint": null
    },
    {
        "number": 107,
        "symbol": "Bh",
        "name": "Bohrium",
        "mass": 270,
        "group": 7,
        "period": 7,
        "category": "Transition Metal",
        "electronegativity": null,
        "meltingPoint": null,
        "boilingPoint": null
    },
    {
        "number": 108,
        "symbol": "Hs",
        "name": "Hassium",
        "mass": 269,
        "group": 8,
        "period": 7,
        "category": "Transition Metal",
        "electronegativity": null,
        "meltingPoint": 126,
        "boilingPoint": null
    },
    {
        "number": 109,
        "symbol": "Mt",
        "name": "Meitnerium",
        "mass": 278,
        "group": 9,
        "period": 7,
        "category": "Unknown, Probably Transition Metal",
        "electronegativity": null,
        "meltingPoint": null,
        "boilingPoint": null
    },
    {
        "number": 110,
        "symbol": "Ds",
        "name": "Darmstadtium",
        "mass": 281,
        "group": 10,
        "period": 7,
        "category": "Unknown, Probably Transition Metal",
        "electronegativity": null,
        "meltingPoint": null,
        "boilingPoint": null
    },
    {
        "number": 111,
        "symbol": "Rg",
        "name": "Roentgenium",
        "mass": 282,
        "group": 11,
        "period": 7,
        "category": "Unknown, Probably Transition Metal",
        "electronegativity": null,
        "meltingPoint": null,
        "boilingPoint": null
    },
    {
        "number": 112,
        "symbol": "Cn",
        "name": "Copernicium",
        "mass": 285,
        "group": 12,
        "period": 7,
        "category": "Transition Metal",
        "electronegativity": null,
        "meltingPoint": null,
        "boilingPoint": 3570
    },
    {
        "number": 113,
        "symbol": "Nh",
        "name": "Nihonium",
        "mass": 286,
        "group": 13,
        "period": 7,
        "category": "Unknown, Probably Transition Metal",
        "electronegativity": null,
        "meltingPoint": 700,
        "boilingPoint": 1430
    },
    {
        "number": 114,
        "symbol": "Fl",
        "name": "Flerovium",
        "mass": 289,
        "group": 14,
        "period": 7,
        "category": "Post-transition Metal",
        "electronegativity": null,
        "meltingPoint": 340,
        "boilingPoint": 420
    },
    {
        "number": 115,
        "symbol": "Mc",
        "name": "Moscovium",
        "mass": 289,
        "group": 15,
        "period": 7,
        "category": "Unknown, Probably Post-transition Metal",
        "electronegativity": null,
        "meltingPoint": 670,
        "boilingPoint": 1400
    },
    {
        "number": 116,
        "symbol": "Lv",
        "name": "Livermorium",
        "mass": 293,
        "group": 16,
        "period": 7,
        "category": "Unknown, Probably Post-transition Metal",
        "electronegativity": null,
        "meltingPoint": 709,
        "boilingPoint": 1085
    },
    {
        "number": 117,
        "symbol": "Ts",
        "name": "Tennessine",
        "mass": 294,
        "group": 17,
        "period": 7,
        "category": "Unknown, Probably Metalloid",
        "electronegativity": null,
        "meltingPoint": 723,
        "boilingPoint": 883
    },
    {
        "number": 118,
        "symbol": "Og",
        "name": "Oganesson",
        "mass": 294,
        "group": 18,
        "period": 7,
        "category": "Unknown, Predicted To Be Noble Gas",
        "electronegativity": null,
        "meltingPoint": null,
        "boilingPoint": 350
    },
    {
        "number": 119,
        "symbol": "Uue",
        "name": "Ununennium",
        "mass": 315,
        "group": 1,
        "period": 8,
        "category": "Unknown, But Predicted To Be An Alkali Metal",
        "electronegativity": null,
        "meltingPoint": null,
        "boilingPoint": 630
    }
];

// ==========================================
// ELECTRON CONFIGURATIONS & MOLECULAR LOGIC
// ==========================================

// Exact electron shell configuration dictionary (K, L, M, N, O, P, Q) for all 118 elements
const shellConfigurations = {
    1: [1], 2: [2], 3: [2, 1], 4: [2, 2], 5: [2, 3], 6: [2, 4], 7: [2, 5], 8: [2, 6], 9: [2, 7], 10: [2, 8],
    11: [2, 8, 1], 12: [2, 8, 2], 13: [2, 8, 3], 14: [2, 8, 4], 15: [2, 8, 5], 16: [2, 8, 6], 17: [2, 8, 7], 18: [2, 8, 8],
    19: [2, 8, 8, 1], 20: [2, 8, 8, 2], 21: [2, 8, 9, 2], 22: [2, 8, 10, 2], 23: [2, 8, 11, 2], 24: [2, 8, 13, 1], 25: [2, 8, 13, 2],
    26: [2, 8, 14, 2], 27: [2, 8, 15, 2], 28: [2, 8, 16, 2], 29: [2, 8, 18, 1], 30: [2, 8, 18, 2], 31: [2, 8, 18, 3], 32: [2, 8, 18, 4],
    33: [2, 8, 18, 5], 34: [2, 8, 18, 6], 35: [2, 8, 18, 7], 36: [2, 8, 18, 8], 37: [2, 8, 18, 8, 1], 38: [2, 8, 18, 8, 2],
    39: [2, 8, 18, 9, 2], 40: [2, 8, 18, 10, 2], 41: [2, 8, 18, 12, 1], 42: [2, 8, 18, 13, 1], 43: [2, 8, 18, 13, 2], 44: [2, 8, 18, 15, 1],
    45: [2, 8, 18, 16, 1], 46: [2, 8, 18, 18], 47: [2, 8, 18, 18, 1], 48: [2, 8, 18, 18, 2], 49: [2, 8, 18, 18, 3], 50: [2, 8, 18, 18, 4],
    51: [2, 8, 18, 18, 5], 52: [2, 8, 18, 18, 6], 53: [2, 8, 18, 18, 7], 54: [2, 8, 18, 18, 8], 55: [2, 8, 18, 18, 8, 1], 56: [2, 8, 18, 18, 8, 2],
    57: [2, 8, 18, 18, 9, 2], 58: [2, 8, 18, 19, 9, 2], 59: [2, 8, 18, 21, 8, 2], 60: [2, 8, 18, 22, 8, 2], 61: [2, 8, 18, 23, 8, 2],
    62: [2, 8, 18, 24, 8, 2], 63: [2, 8, 18, 25, 8, 2], 64: [2, 8, 18, 25, 9, 2], 65: [2, 8, 18, 27, 8, 2], 66: [2, 8, 18, 28, 8, 2],
    67: [2, 8, 18, 29, 8, 2], 68: [2, 8, 18, 30, 8, 2], 69: [2, 8, 18, 31, 8, 2], 70: [2, 8, 18, 32, 8, 2], 71: [2, 8, 18, 32, 9, 2],
    72: [2, 8, 18, 32, 10, 2], 73: [2, 8, 18, 32, 11, 2], 74: [2, 8, 18, 32, 12, 2], 75: [2, 8, 18, 32, 13, 2], 76: [2, 8, 18, 32, 14, 2],
    77: [2, 8, 18, 32, 15, 2], 78: [2, 8, 18, 32, 17, 1], 79: [2, 8, 18, 32, 18, 1], 80: [2, 8, 18, 32, 18, 2], 81: [2, 8, 18, 32, 18, 3],
    82: [2, 8, 18, 32, 18, 4], 83: [2, 8, 18, 32, 18, 5], 84: [2, 8, 18, 32, 18, 6], 85: [2, 8, 18, 32, 18, 7], 86: [2, 8, 18, 32, 18, 8],
    87: [2, 8, 18, 32, 18, 8, 1], 88: [2, 8, 18, 32, 18, 8, 2], 89: [2, 8, 18, 32, 18, 9, 2], 90: [2, 8, 18, 32, 18, 10, 2],
    91: [2, 8, 18, 32, 20, 9, 2], 92: [2, 8, 18, 32, 21, 9, 2], 93: [2, 8, 18, 32, 22, 9, 2], 94: [2, 8, 18, 32, 24, 8, 2],
    95: [2, 8, 18, 32, 25, 8, 2], 96: [2, 8, 18, 32, 25, 9, 2], 97: [2, 8, 18, 32, 27, 8, 2], 98: [2, 8, 18, 32, 28, 8, 2],
    99: [2, 8, 18, 32, 29, 8, 2], 100: [2, 8, 18, 32, 30, 8, 2], 101: [2, 8, 18, 32, 31, 8, 2], 102: [2, 8, 18, 32, 32, 8, 2],
    103: [2, 8, 18, 32, 32, 9, 2], 104: [2, 8, 18, 32, 32, 10, 2], 105: [2, 8, 18, 32, 32, 11, 2], 106: [2, 8, 18, 32, 32, 12, 2],
    107: [2, 8, 18, 32, 32, 13, 2], 108: [2, 8, 18, 32, 32, 14, 2], 109: [2, 8, 18, 32, 32, 15, 2], 110: [2, 8, 18, 32, 32, 16, 2],
    111: [2, 8, 18, 32, 32, 17, 2], 112: [2, 8, 18, 32, 32, 18, 2], 113: [2, 8, 18, 32, 32, 18, 3], 114: [2, 8, 18, 32, 32, 18, 4],
    115: [2, 8, 18, 32, 32, 18, 5], 116: [2, 8, 18, 32, 32, 18, 6], 117: [2, 8, 18, 32, 32, 18, 7], 118: [2, 8, 18, 32, 32, 18, 8]
};

const electronegativity={
1:2.20,2:null,3:0.98,4:1.57,5:2.04,6:2.55,7:3.04,8:3.44,9:3.98,10:null,
11:0.93,12:1.31,13:1.61,14:1.90,15:2.19,16:2.58,17:3.16,18:null,
19:0.82,20:1.00,21:1.36,22:1.54,23:1.63,24:1.66,25:1.55,26:1.83,
27:1.88,28:1.91,29:1.90,30:1.65,31:1.81,32:2.01,33:2.18,34:2.55,
35:2.96,36:3.00,37:0.82,38:0.95,39:1.22,40:1.33,41:1.60,42:2.16,
43:1.90,44:2.20,45:2.28,46:2.20,47:1.93,48:1.69,49:1.78,50:1.96,
51:2.05,52:2.10,53:2.66,54:2.60,55:0.79,56:0.89,57:1.10,
58:1.12,59:1.13,60:1.14,61:1.13,62:1.17,63:1.20,64:1.20,65:1.10,
66:1.22,67:1.23,68:1.24,69:1.25,70:1.10,71:1.27,72:1.30,73:1.50,
74:2.36,75:1.90,76:2.20,77:2.20,78:2.28,79:2.54,80:2.00,81:1.62,
82:2.33,83:2.02,84:2.00,85:2.20,86:null,87:0.70,88:0.90,89:1.10,
90:1.30,91:1.50,92:1.38,93:1.36,94:1.28,95:1.30,96:1.30,97:1.30,
98:1.30,99:1.30,100:1.30,101:1.30,102:1.30,103:1.30,104:null,
105:null,106:null,107:null,108:null,109:null,110:null,111:null,
112:null,113:null,114:null,115:null,116:null,117:null,118:null
};


const atomicRadius={
1:53,2:31,3:167,4:112,5:87,6:67,7:56,8:48,9:42,10:38,
11:190,12:145,13:118,14:111,15:98,16:88,17:79,18:71,
19:243,20:194,21:184,22:176,23:171,24:166,25:161,26:156,
27:152,28:149,29:145,30:142,31:136,32:125,33:114,34:103,
35:94,36:88,37:265,38:219,39:212,40:206,41:198,42:190,
43:183,44:178,45:173,46:169,47:165,48:161,49:156,50:145,
51:133,52:123,53:115,54:108,55:298,56:253,57:195,58:185,
59:247,60:206,61:205,62:238,63:231,64:233,65:225,66:228,
67:226,68:226,69:222,70:222,71:217,72:208,73:200,74:193,
75:188,76:185,77:180,78:177,79:174,80:171,81:156,82:154,
83:143,84:135,85:127,86:120,87:348,88:283,89:260,90:237,
91:243,92:240,93:221,94:243,95:244,96:245,97:244,98:245,
99:245,100:245,101:246,102:246,103:246,104:157,105:149,
106:143,107:141,108:134,109:129,110:128,111:121,112:122,
113:136,114:143,115:162,116:175,117:165,118:152
};


const ionizationEnergy={
1:13.598,2:24.587,3:5.392,4:9.323,5:8.298,6:11.260,
7:14.534,8:13.618,9:17.423,10:21.565,11:5.139,12:7.646,
13:5.986,14:8.152,15:10.487,16:10.360,17:12.968,18:15.760,
19:4.341,20:6.113,21:6.561,22:6.828,23:6.746,24:6.767,
25:7.434,26:7.902,27:7.881,28:7.640,29:7.726,30:9.394,
31:5.999,32:7.900,33:9.789,34:9.752,35:11.814,36:14.000,
37:4.177,38:5.695,39:6.217,40:6.634,41:6.759,42:7.092,
43:7.280,44:7.361,45:7.459,46:8.337,47:7.576,48:8.994,
49:5.786,50:7.344,51:8.608,52:9.010,53:10.451,54:12.130,
55:3.894,56:5.212,57:5.577,58:5.539,59:5.473,
60:5.525,61:5.582,62:5.644,63:5.670,64:6.150,65:5.864,
66:5.939,67:6.022,68:6.108,69:6.184,70:6.254,71:5.426,
72:6.825,73:7.550,74:7.864,75:7.833,76:8.438,77:8.967,
78:8.959,79:9.226,80:10.438,81:6.108,82:7.417,83:7.289,
84:8.417,85:9.300,86:10.745,87:4.073,88:5.279,89:5.170,
90:6.307,91:5.890,92:6.194,93:6.266,94:6.026,95:5.974,
96:5.992,97:6.198,98:6.282,99:6.367,100:6.500,101:6.580,
102:6.650,103:4.960,104:6.020,105:6.800,106:7.800,
107:7.700,108:7.600,109:8.700,110:9.000,111:10.600,
112:11.000,113:7.300,114:8.500,115:5.600,116:6.600,
117:7.700,118:9.000
};


const trendData={};

elements.forEach(el=>{

trendData[el.number]={

electronegativity:
electronegativity[el.number] ?? null,

atomicRadius:
atomicRadius[el.number] ?? null,

ionizationEnergy:
ionizationEnergy[el.number] ?? null

};

});
// Maps element properties to chemically accurate categories dynamically
function getElementCategory(element) {
    const num = element.number;
    const g = element.group;
    const p = element.period;

    if (num === 1) return "nonmetal"; // Hydrogen
    // Lanthanides
    if (num >= 57 && num <= 71) return "lanthanide";
    // Actinides
    if (num >= 89 && num <= 103) return "actinide";
    
    if (g === 1) return "alkali";
    if (g === 2) return "alkaline-earth";
    if (g === 17) return "halogen";
    if (g === 18) return "noble-gas";
    
    // Metalloids
    if ([5, 14, 32, 33, 51, 52, 84].includes(num)) return "metalloid";
    
    // Reactive Nonmetals
    if ([6, 7, 8, 9, 15, 16, 17, 34, 35, 53].includes(num)) return "nonmetal";
    
    // Transition metals
    if (g >= 3 && g <= 12) return "transition";
    
    // Post-transition metals
    if ([13, 31, 49, 50, 81, 82, 83, 113, 114, 115, 116].includes(num)) return "metal";
    
    return "transition";
}

// Find Category for each element
elements.forEach(el=>{

el.category=
getElementCategory(el);

/* ADD MASS */

el.massValue =
parseFloat(el.mass);

const trend =
trendData[el.number];


const container = document.querySelector(".table-container");

const totalGroups = 18; // Total groups (columns) in the periodic table
const totalPeriods = 10; // Total periods (rows) in the periodic table

// ==========================================
// INITIALIZE PERIODIC TABLE GRID
// ==========================================
for (let period = 1; period <= totalPeriods; period++) {
    for (let group = 1; group <= totalGroups; group++) {
        const cell = document.createElement("div");
        cell.className = "empty"; 

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
cell.dataset.electronegativity = element.electronegativity !== null ? element.electronegativity : "N/A";
cell.dataset.meltingPoint = element.meltingPoint !== null ? element.meltingPoint : "N/A";
cell.dataset.boilingPoint = element.boilingPoint !== null ? element.boilingPoint : "N/A";
        } else if (group === 3 && period === 6) {
            cell.className = "element";
            cell.style.cursor = "default";
            cell.innerHTML = `<div class="element-symbol" style="font-size:16px; margin-top:20px;">La-Lu</div><div class="element-name" style="font-size:8px;">Lanthanides</div>`;
        } else if (group === 3 && period === 7) {
            cell.className = "element";
            cell.style.cursor = "default";
            cell.innerHTML = `<div class="element-symbol" style="font-size:16px; margin-top:20px;">Ac-Lr</div><div class="element-name" style="font-size:8px;">Actinides</div>`;
        } else if (group === 2 && period === 9) {
            cell.className = "empty placeholder";
            cell.style.gridColumn = "1 / span 2";
            cell.innerHTML = `<div class="placeholder-side">Lanthanide</div>`;
        } else if (group === 2 && period === 10) {
            cell.className = "empty placeholder";
            cell.style.gridColumn = "1 / span 2";
            cell.innerHTML = `<div class="placeholder-side">Actinide</div>`;
        }
        container.appendChild(cell);
    }
}

// ==========================================
// MODAL CONTROLS & DYNAMIC CANVAS ENGINE
// ==========================================
const modal = document.getElementById("element-modal");
const closeModalBtn = document.getElementById("close-modal-btn");
const modalNumber = document.getElementById("modal-number");
const modalSymbol = document.getElementById("modal-symbol");
const modalName = document.getElementById("modal-name");
const modalCategory = document.getElementById("modal-category");
const modalMass = document.getElementById("modal-mass");
const modalProtons = document.getElementById("modal-protons");
const modalNeutrons = document.getElementById("modal-neutrons");
const modalElectrons = document.getElementById("modal-electrons");
const shellSummaryText = document.getElementById("shell-summary-text");
const shellsList = document.getElementById("shells-list");

const canvas = document.getElementById("atomic-canvas");
const ctx = canvas.getContext("2d");

const playPauseBtn = document.getElementById("play-pause-btn");
const playIcon = document.getElementById("play-icon");
const pauseIcon = document.getElementById("pause-icon");
const speedSlider = document.getElementById("speed-slider");
const toggleOrbitsBtn = document.getElementById("toggle-orbits-btn");
const toggleTrailsBtn = document.getElementById("toggle-trails-btn");

// Global visual state variables
let currentElement = null;
let isPlaying = true;
let speedMultiplier = 1;
let showOrbits = true;
let showTrails = true;
let animationFrameId = null;

// Physics angle values for electron positioning
let electronAngles = [];
let nucleusJiggleTime = 0;

// Pre-generated nucleus coordinates for beautiful quantum vibratory effects
const nucleusParticles = [];
for (let i = 0; i < 22; i++) {
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 14; 
    nucleusParticles.push({
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        isProton: Math.random() > 0.5,
        phase: Math.random() * Math.PI * 2,
        speed: 0.04 + Math.random() * 0.06
    });
}

// Open modal and load visualization
function openModal(element) {
    currentElement = element;
    
    // Set text elements
    modalNumber.textContent = `#${element.number}`;
    modalSymbol.textContent = element.symbol;
    modalName.textContent = element.name;
    
    // Category Badge
    modalCategory.className = `modal-category-badge badge-${element.category}`;
    modalCategory.textContent = element.category.replace("-", " ");
    
    // Mass & Particle configuration
    modalMass.textContent = element.mass;
    modalProtons.textContent = element.number;
    modalElectrons.textContent = element.number;
    
    const neutrons = Math.round(parseFloat(element.mass)) - element.number;
    modalNeutrons.textContent = neutrons > 0 ? neutrons : "N/A";
    
    // Generate shells
    const shellNames = ["K", "L", "M", "N", "O", "P", "Q"];
    shellsList.innerHTML = "";
    const config = shellConfigurations[element.number] || [element.number];
    shellSummaryText.textContent = `Shell distribution: ${config.join(" - ")}`;
    
    config.forEach((count, index) => {
        const shellName = shellNames[index] || `Shell ${index + 1}`;
        const maxCount = 2 * Math.pow(index + 1, 2);
        // Cap visual representation ratio for high shells to prevent tiny visible fills
        const percentage = Math.max((count / maxCount) * 100, 10);
        
        const row = document.createElement("div");
        row.className = "shell-row";
        row.innerHTML = `
            <div class="shell-badge">${shellName}</div>
            <div class="shell-meter-container">
                <div class="shell-meter-fill" style="width: ${percentage}%"></div>
            </div>
            <div class="shell-count">${count} e⁻</div>
        `;
        shellsList.appendChild(row);
    });
    
    // Initialize angles for each electron shell
    electronAngles = config.map(() => 0);
    
    // Display Modal
    modal.classList.add("open");
    document.body.style.overflow = "hidden"; // Disable background scrolling
    
    // Start Animation
    resizeCanvas();
    isPlaying = true;
    updatePlayPauseUI();
    
    cancelAnimationFrame(animationFrameId);
    animate();
}

function closeModal() {
    modal.classList.remove("open");
    document.body.style.overflow = ""; // Enable background scrolling
    cancelAnimationFrame(animationFrameId);
    currentElement = null;
}

// Adjust DPI scaling dynamically
function resizeCanvas() {
    if (!canvas) return;
    const rect = canvas.parentElement.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.width * dpr; // Maintain perfect 1:1 aspect ratio
    ctx.scale(dpr, dpr);
}

// core animation loop
function animate() {
    if (!currentElement) return;
    
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.width / dpr;
    const h = canvas.height / dpr;
    const centerX = w / 2;
    const centerY = h / 2;
    
    // Clear canvas
    ctx.clearRect(0, 0, w, h);
    
    const config = shellConfigurations[currentElement.number] || [currentElement.number];
    const totalShells = config.length;
    
    // Calculate orbit rings spacing
    const minRadius = 45;
    const maxRadius = Math.min(centerX, centerY) - 25;
    const radiusDiff = maxRadius - minRadius;
    const orbitSpacing = totalShells > 1 ? radiusDiff / (totalShells - 1) : 0;
    
    // 1. Draw Orbit Ring paths
    if (showOrbits) {
        config.forEach((_, index) => {
            const radius = minRadius + index * orbitSpacing;
            
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
            ctx.lineWidth = 1;
            ctx.setLineDash([5, 5]); // Soft dotted circles
            ctx.stroke();
            ctx.setLineDash([]); // Reset dash state
            
            // Draw small shell label on the orbit (K, L, M...)
            const shellNames = ["K", "L", "M", "N", "O", "P", "Q"];
            ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
            ctx.font = "bold 9px Roboto, Arial, sans-serif";
            ctx.fillText(shellNames[index] || "", centerX + radius - 4, centerY - 6);
        });
    }
    
    // 2. Draw active quantum nucleus (Protons & Neutrons jiggling)
    nucleusJiggleTime += isPlaying ? 1 : 0;
    
    // Soft outer glow of the nucleus
    const glowGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 28);
    glowGradient.addColorStop(0, "rgba(248, 113, 113, 0.25)");
    glowGradient.addColorStop(0.5, "rgba(96, 165, 250, 0.15)");
    glowGradient.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = glowGradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 28, 0, Math.PI * 2);
    ctx.fill();
    
    // Nucleus nucleons (proton/neutron spheres cluster) jiggling organic effect
    nucleusParticles.forEach((p) => {
        const jiggleX = Math.sin(nucleusJiggleTime * p.speed + p.phase) * 1.5;
        const jiggleY = Math.cos(nucleusJiggleTime * p.speed + p.phase) * 1.5;
        ctx.beginPath();
        ctx.arc(centerX + p.x + jiggleX, centerY + p.y + jiggleY, 4.5, 0, Math.PI * 2);
        
        // Red color for protons, Blue color for neutrons
        ctx.shadowBlur = 4;
        ctx.fillStyle = p.isProton ? "#f87171" : "#60a5fa";
        ctx.shadowColor = p.isProton ? "#ef4444" : "#3b82f6";
        ctx.fill();
        ctx.shadowBlur = 0; // Reset shadow for efficiency
    });
    
    // Draw symbol directly in the nucleus center
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 13px Roboto, Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(currentElement.symbol, centerX, centerY);
    
    // 3. Draw Orbiting electrons
    const baseAngularSpeed = 0.015;
    
    config.forEach((count, shellIndex) => {
        const radius = minRadius + shellIndex * orbitSpacing;
        
        // Phys-based speed calculation: closer electrons speed is faster
        const orbitalVelocity = baseAngularSpeed * (1 / Math.sqrt(shellIndex + 1)) * speedMultiplier;
        
        // Update angle if game is currently playing
        if (isPlaying) {
            electronAngles[shellIndex] += orbitalVelocity;
        }
        
        const currentAngle = electronAngles[shellIndex];
        
        // Render each electron in this shell symmetrically
        for (let i = 0; i < count; i++) {
            const angleOffset = (i * 2 * Math.PI) / count;
            const finalAngle = currentAngle + angleOffset;
            
            const x = centerX + radius * Math.cos(finalAngle);
            const y = centerY + radius * Math.sin(finalAngle);
            
            // Draw fading trails if active
            if (showTrails) {
                const trailLength = 8;
                for (let t = 1; t <= trailLength; t++) {
                    const trailAngle = finalAngle - t * 0.04 * speedMultiplier;
                    const tx = centerX + radius * Math.cos(trailAngle);
                    const ty = centerY + radius * Math.sin(trailAngle);
                    const opacity = (1 - t / trailLength) * 0.35;
                    
                    ctx.beginPath();
                    ctx.arc(tx, ty, 3 * (1 - (t / trailLength) * 0.5), 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(52, 211, 153, ${opacity})`;
                    ctx.fill();
                }
            }
            
            // Draw outer glow for electrons
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fillStyle = "#34d399";
            ctx.shadowColor = "#10b981";
            ctx.shadowBlur = 8;
            ctx.fill();
            ctx.shadowBlur = 0; // Reset shadow for efficiency
            
            // Highlight inner circle core
            ctx.beginPath();
            ctx.arc(x, y, 1.8, 0, Math.PI * 2);
            ctx.fillStyle = "#ffffff";
            ctx.fill();
        }
    });
    
    animationFrameId = requestAnimationFrame(animate);
}

// Update Play/Pause UI Icons
function updatePlayPauseUI() {
    if (isPlaying) {
        if (playIcon) playIcon.style.display = "none";
        if (pauseIcon) pauseIcon.style.display = "block";
        if (!playIcon && !pauseIcon) playPauseBtn.textContent = "Pause";
    } else {
        if (playIcon) playIcon.style.display = "block";
        if (pauseIcon) pauseIcon.style.display = "none";
        if (!playIcon && !pauseIcon) playPauseBtn.textContent = "Play";
    }
}

// ==========================================
// WIRE UP MODAL COMPONENT EVENT LISTENERS
// ==========================================
closeModalBtn.addEventListener("click", closeModal);

// Close modal when clicking on dark backdrop
window.addEventListener("click", (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

// Close modal using Escape keyboard button
window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("open")) {
        closeModal();
    }
});

// Play/Pause Action
playPauseBtn.addEventListener("click", () => {
    isPlaying = !isPlaying;
    updatePlayPauseUI();
});

// Speed adjust slider
speedSlider.addEventListener("input", (e) => {
    speedMultiplier = parseFloat(e.target.value);
});

// Toggle Orbit lines
toggleOrbitsBtn.addEventListener("click", () => {
    showOrbits = !showOrbits;
    toggleOrbitsBtn.classList.toggle("active", showOrbits);
});

// Toggle Trails
toggleTrailsBtn.addEventListener("click", () => {
    showTrails = !showTrails;
    toggleTrailsBtn.classList.toggle("active", showTrails);
});

// Handle window resizing
window.addEventListener("resize", () => {
    if (currentElement) {
        resizeCanvas();
    }
});

//---------------Add Lanthanoids----------------
const lanContainer = document.createElement("div");
lanContainer.style.display = "flex";
lanContainer.style.alignItems = "center";
lanContainer.style.marginTop = "20px";

// Label + arrow
const lanLabel = document.createElement("div");
lanLabel.innerHTML = "<b>Lanthanoids →</b>";
lanLabel.style.width = "140px";
lanLabel.style.fontSize = "16px";

// Row
const lanRow = document.createElement("div");
lanRow.style.display = "grid";
lanRow.style.gridTemplateColumns = "repeat(15, 65px)";
lanRow.style.gap = "5px";

elements
    .filter(el => el.number >= 57 && el.number <= 71)
    .forEach(el => {
        const div = document.createElement("div");
        div.className = `element ${el.category}`;
        div.dataset.name =
el.name.toLowerCase();

div.dataset.symbol =
el.symbol.toLowerCase();
        div.innerHTML = `
        <div class="element-number">${el.number}</div>
        <div class="element-symbol">${el.symbol}</div>
        <div class="element-name">${el.name}</div>
        <div class="tooltip">
            ${el.name}<br/>
            Category: ${el.category.replace("-", " ")} <br/>
            Atomic Mass: ${el.mass}
        </div>
    `;
        div.addEventListener("click", () => openModal(el));
        lanRow.appendChild(div);
    });

lanContainer.appendChild(lanLabel);
lanContainer.appendChild(lanRow);
document.querySelector(".periodic-table-wrapper").appendChild(lanContainer);


//--------------Add Actinides------------------
const actContainer = document.createElement("div");
actContainer.style.display = "flex";
actContainer.style.alignItems = "center";
actContainer.style.marginTop = "10px";

        modalName.textContent = elementCard.dataset.name;
        modalSymbol.textContent = elementCard.dataset.symbol;
        modalNumber.textContent = elementCard.dataset.number;
        modalMass.textContent = elementCard.dataset.mass;
        modalGroup.textContent = elementCard.dataset.group;
        modalPeriod.textContent = elementCard.dataset.period;
        modalCategory.textContent = elementCard.dataset.category;
        modalElectronegativity.textContent = elementCard.dataset.electronegativity;
        modalMelting.textContent = elementCard.dataset.meltingPoint + (elementCard.dataset.meltingPoint !== "N/A" ? " K" : "");
        modalBoiling.textContent = elementCard.dataset.boilingPoint + (elementCard.dataset.boilingPoint !== "N/A" ? " K" : "");
        modalFact.textContent = elementFacts[elementCard.dataset.symbol] || "No fact available.";

// Row
const actRow = document.createElement("div");
actRow.style.display = "grid";
actRow.style.gridTemplateColumns = "repeat(15, 65px)";
actRow.style.gap = "5px";

elements
    .filter(el => el.number >= 89 && el.number <= 103)
    .forEach(el => {
        const div = document.createElement("div");
        div.className = `element ${el.category}`;
        div.dataset.name =
el.name.toLowerCase();

div.dataset.symbol =
el.symbol.toLowerCase();
        div.innerHTML = `
            <div class="element-number">${el.number}</div>
            <div class="element-symbol">${el.symbol}</div>
            <div class="element-name">${el.name}</div>
            <div class="tooltip">
                ${el.name}<br/>
                Category: ${el.category.replace("-", " ")} <br/>
                Atomic Mass: ${el.mass}
            </div>
        `;
        div.addEventListener("click", () => openModal(el));
        actRow.appendChild(div);
    });

actContainer.appendChild(actLabel);
actContainer.appendChild(actRow);
document.querySelector(".periodic-table-wrapper").appendChild(actContainer);


// Filter categories from Dropdown List
const filter = document.getElementById("categoryFilter");
filter.addEventListener("change", () => {
    const selected = filter.value;
    document.querySelectorAll(".element").forEach(el => {
        if (selected === "all" || el.classList.contains(selected)) {
            el.style.opacity = "1";
            el.style.pointerEvents = "auto";
        } else {
            el.style.opacity = "0.2";
            el.style.pointerEvents = "none";
        }
    });
});

// All Categories (including Post-transition Metals 'metal')
const categories = {
    alkali: "Alkali Metals",
    "alkaline-earth": "Alkaline Earth",
    transition: "Transition Metals",
    metal: "Post-transition Metals",
    metalloid: "Metalloids",
    nonmetal: "Non-metals",
    halogen: "Halogens",
    "noble-gas": "Noble Gases",
    lanthanide: "Lanthanoids",
    actinide: "Actinides"
};

const legendContainer = document.querySelector(".legend");

Object.keys(categories).forEach(cat => {
    const item = document.createElement("div");
    item.classList.add("legend-item");
    const colorBox = document.createElement("div");
    colorBox.classList.add("color-box", cat);
    const label = document.createElement("span");
    label.innerText = categories[cat];
    item.appendChild(colorBox);
    item.appendChild(label);
    legendContainer.appendChild(item);
});

/* Interactive Features Logic */

// Populate Category Dropdown
const categorySelect = document.getElementById("category-select");
const uniqueCategories = [...new Set(elements.map(el => el.category).filter(Boolean))].sort();

// If matched → show popup
if(match){

el.classList.add(
"search-active"
);

// Auto-scroll to matched element if not already visible
el.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });

}

});

// Category Toggle Logic
categorySelect.addEventListener("change", (e) => {
    const selectedCategory = e.target.value;
    let firstMatch = null;
    document.querySelectorAll(".element").forEach(card => {
        if (selectedCategory === "all" || card.dataset.category === selectedCategory) {
            card.classList.remove("dimmed");
            if (!firstMatch && selectedCategory !== "all") {
                firstMatch = card;
            }
        } else {
            card.classList.add("dimmed");
        }
    });
    if (firstMatch) {
        firstMatch.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
});
const trendDefinitions={

mass:{

title:
"Atomic Mass",

description:
"Average mass of protons and neutrons in an atom."

},

electronegativity:{

title:
"Electronegativity",

description:
"Ability of an atom to attract bonding electrons."

},

atomicRadius:{

title:
"Atomic Radius",

description:
"Distance between nucleus and outermost electron shell."

},

ionizationEnergy:{

title:
"Ionization Energy",

description:
"Energy required to remove an electron from an atom."

}

};

const trendLinks={

electronegativity:
"https://en.wikipedia.org/wiki/Electronegativity",

atomicRadius:
"https://en.wikipedia.org/wiki/Atomic_radius",

ionizationEnergy:
"https://en.wikipedia.org/wiki/Ionization_energy",

mass:
"https://en.wikipedia.org/wiki/Atomic_mass"

};

const trendAnalysis={

electronegativity:{

period:
"↑ Increases across periods",

group:
"↓ Decreases down groups",

reason:
"Effective nuclear charge increases causing stronger electron attraction.",

example:
"F > O > N"

},

atomicRadius:{

period:
"↓ Decreases across periods",

group:
"↑ Increases down groups",

reason:
"Extra shells enlarge atoms down groups.",

example:
"Cs > K > Na"

},

ionizationEnergy:{

period:
"↑ Increases across periods",

group:
"↓ Decreases down groups",

reason:
"Smaller atoms hold electrons more strongly.",

example:
"Ne > F > O"

},

mass:{

period:
"Generally increases",

group:
"Generally increases",

reason:
"More protons + neutrons",

example:
"H < Fe < Au"

}

};
const trendFilter =
document.getElementById(
"trendFilter"
);

const trendInfo =
document.getElementById(
"trendInfo"
);

const trendTitle =
document.getElementById(
"trendTitle"
);

const trendDescription =
document.getElementById(
"trendDescription"
);

const trendExtremes =
document.getElementById(
"trendExtremes"
);

const trendPopupContainer =
document.getElementById(
"trendPopupContainer"
);

const analysisContent =
document.getElementById(
"analysisContent"
);




trendFilter.addEventListener(

"change",

function(){

const property =
this.value;
const actualProperty =

property==="mass"

?

"massValue"

:

property;
const cards =
document.querySelectorAll(
".element"
);



/* RESET */
if(property==="none"){


trendPopupContainer.style.display =
"none";


cards.forEach(card=>{

card.style.background="";

card.style.border="none";

card.style.boxShadow="";

// Property Heatmap Logic
const heatmapSelect = document.getElementById("heatmap-select");
heatmapSelect.addEventListener("change", (e) => {
    const property = e.target.value;
    const cards = document.querySelectorAll(".element");
    
    if (property === "none") {
        cards.forEach(card => card.style.backgroundColor = "");
        return;
    }
    
    if (property === "electronegativity") {
        let maxEn = 0;
        let minEn = 10;
        cards.forEach(card => {
            const val = parseFloat(card.dataset.electronegativity);
            if (!isNaN(val)) {
                if (val > maxEn) maxEn = val;
                if (val < minEn) minEn = val;
            }
        });
        
        cards.forEach(card => {
            const val = parseFloat(card.dataset.electronegativity);
            if (isNaN(val)) {
                card.style.backgroundColor = "#e0e0e0"; // Gray out missing data
            } else {
                // Map from minEn-maxEn to yellow-red
                // yellow (hue 60) to red (hue 0)
                const ratio = (val - minEn) / (maxEn - minEn);
                const hue = 60 * (1 - ratio);
                card.style.backgroundColor = `hsl(${hue}, 100%, 70%)`;
            }
        });
    }
});

// State of Matter Slider Logic
const tempSlider = document.getElementById("temp-slider");
const tempDisplay = document.getElementById("temp-display");

return;

}





trendPopupContainer.style.display =
"flex";



trendTitle.innerText =
trendDefinitions[
property
].title;

trendDescription.innerText =
trendDefinitions[
property
].description;

document
.getElementById(
"wikiLink"
)

.href =

trendLinks[property];

analysisContent.innerHTML=

`
<div class="analysis-section">

<div class="analysis-heading">

Across Periods

</div>

<div class="analysis-up">

${trendAnalysis[property].period}

</div>

</div>



<div class="analysis-section">

<div class="analysis-heading">

Down Groups

</div>

<div class="analysis-down">

${trendAnalysis[property].group}

</div>

</div>



<div class="analysis-section">

<div class="analysis-heading">

Reason

</div>

${trendAnalysis[property].reason}

</div>



<div class="analysis-section">

<div class="analysis-heading">

Example

</div>

${trendAnalysis[property].example}

</div>
`;



const validElements =

elements.filter(

e=>
e[actualProperty]
 != null

);



const values =

validElements.map(

e=>e[actualProperty]
);



const min =
Math.min(...values);

const max =
Math.max(...values);



const lowest =
validElements.find(

e=>

e[actualProperty]

===

min
);



const highest =
validElements.find(

e=>

e[actualProperty]

===

max
);


trendExtremes.innerHTML =
`
<div class="extreme-row">

<div class="low-tag">
LOWEST:
<b>${lowest.name} (${min})</b>
</div>

<div class="high-tag">
HIGHEST:
<b>${highest.name} (${max})</b>
</div>

</div>
`;



cards.forEach(card=>{

const symbol =
card.dataset.symbol;

const element =

elements.find(

e=>

e.symbol
.toLowerCase()

===symbol

);



if(
!element

||

element[actualProperty]

==null

)

return;
card.style.border=
"none";


if(
element.number
===

highest.number
){

card.style.border=
"4px solid red";

}


if(
element.number
===

lowest.number
){

card.style.border=
"4px solid blue";

}







const norm =
(element[actualProperty]-min)/(max-min);


/* BLUE → GREEN → YELLOW → RED */

const hue =
220 - (norm*220);


const color =
`linear-gradient(
145deg,

hsl(${hue},90%,65%),

hsl(${hue},90%,48%)

)`;


card.style.background =
color;



/* reset borders */

card.style.border =
"none";

card.style.boxShadow =
"none";


/* highest highlight */

if(
element.number===highest.number
){

card.style.border=
"3px solid white";

card.style.boxShadow=
"0 0 15px rgba(255,255,255,.7)";

}


/* lowest highlight */

if(
element.number===lowest.number
){

card.style.border=
"3px solid #60a5fa";

card.style.boxShadow=
"0 0 15px rgba(96,165,250,.8)";

}

card.querySelector(
".tooltip"
).innerHTML =

`
${element.name}<br>

${property}:

<b>

${element[actualProperty]}

</b>
`;

});

tempSlider.addEventListener("input", (e) => {
    const currentTemp = parseFloat(e.target.value);
    tempDisplay.textContent = currentTemp + " K";
    
    document.querySelectorAll(".element").forEach(card => {
        const meltingPoint = parseFloat(card.dataset.meltingPoint);
        const boilingPoint = parseFloat(card.dataset.boilingPoint);
        
        card.classList.remove("state-solid", "state-liquid", "state-gas", "state-unknown");
        
        if (isNaN(meltingPoint) && isNaN(boilingPoint)) {
            card.classList.add("state-unknown");
        } else if (!isNaN(boilingPoint) && currentTemp >= boilingPoint) {
            card.classList.add("state-gas");
        } else if (!isNaN(meltingPoint) && currentTemp >= meltingPoint) {
            card.classList.add("state-liquid");
        } else {
            card.classList.add("state-solid");
        }
    });
});

document
.getElementById(
"closeTrendInfo"
)

.addEventListener(

"click",

()=>{

trendPopupContainer.style.display =
"none";

trendInfo.classList.add(
"hidden"
);

document
.getElementById(
"trendAnalysis"
)

.classList.add(
"hidden"
);

trendFilter.value="none";

});
