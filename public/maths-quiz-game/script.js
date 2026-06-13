/* ============================================================
   Maths Quiz Game — Enhanced Difficulty Progression
   ============================================================ */

let score = 0;
let correctAnswer = 0;
let correctDisplay = '';
let currentDifficulty = null;
let timerInterval = null;
let timeLeft = 30;
let recentTypes = [];
let answerLocked = false;

/* ----------------------------------------------------------
   UTILITY HELPERS
   ---------------------------------------------------------- */

function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function gcd(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b) { [a, b] = [b, a % b]; }
    return a;
}

function fracHTML(num, den) {
    if (den === 1) return '' + num;
    return '<span class="frac"><sup>' + num + '</sup><sub>' + den + '</sub></span>';
}

function simplifyFrac(num, den) {
    const g = gcd(num, den);
    return [num / g, den / g];
}

/* Generate unique wrong options near the correct answer */
function offsetWrongs(correct, count, range) {
    const wrongs = [];
    let attempts = 0;
    while (wrongs.length < count && attempts < 200) {
        attempts++;
        const offset = randInt(1, range) * pick([-1, 1]);
        const w = correct + offset;
        if (w > 0 && w !== correct && !wrongs.includes(w)) {
            wrongs.push(w);
        }
    }
    // Fallback if not enough
    while (wrongs.length < count) {
        const w = randInt(1, correct + range + 10);
        if (w !== correct && !wrongs.includes(w)) wrongs.push(w);
    }
    return wrongs;
}

/* ----------------------------------------------------------
   EASY MODE GENERATORS (Addition & Subtraction, 1–20)
   ---------------------------------------------------------- */

function genEasyAddition() {
    const a = randInt(1, 20), b = randInt(1, 20);
    const answer = a + b;
    return {
        type: 'addition',
        label: 'Addition',
        questionHTML: 'What is ' + a + ' + ' + b + ' ?',
        answer: answer,
        display: '' + answer,
        wrongs: offsetWrongs(answer, 3, 5)
    };
}

function genEasySubtraction() {
    let a = randInt(1, 20), b = randInt(1, 20);
    if (a < b) [a, b] = [b, a];
    const answer = a - b;
    return {
        type: 'subtraction',
        label: 'Subtraction',
        questionHTML: 'What is ' + a + ' − ' + b + ' ?',
        answer: answer,
        display: '' + answer,
        wrongs: offsetWrongs(answer, 3, 5)
    };
}

/* ----------------------------------------------------------
   MEDIUM MODE GENERATORS (×, ÷, Mixed Ops, range ≤ 100)
   ---------------------------------------------------------- */

function genMedMultiplication() {
    const a = randInt(2, 12), b = randInt(2, 12);
    const answer = a * b;
    return {
        type: 'multiplication',
        label: 'Multiplication',
        questionHTML: 'What is ' + a + ' × ' + b + ' ?',
        answer: answer,
        display: '' + answer,
        wrongs: offsetWrongs(answer, 3, 12)
    };
}

function genMedDivision() {
    const b = randInt(2, 12);
    const answer = randInt(2, 12);
    const a = answer * b;
    return {
        type: 'division',
        label: 'Division',
        questionHTML: 'What is ' + a + ' ÷ ' + b + ' ?',
        answer: answer,
        display: '' + answer,
        wrongs: offsetWrongs(answer, 3, 5)
    };
}

function genMedMixedOps() {
    // Templates: a ○ b ○ c  where one op is +/- and the other is ×/÷
    const templates = [
        function () {
            const a = randInt(1, 20), b = randInt(2, 9), c = randInt(2, 9);
            const answer = a + b * c;
            const wrongLTR = (a + b) * c; // common mistake
            return {
                questionHTML: 'What is ' + a + ' + ' + b + ' × ' + c + ' ?',
                answer: answer,
                mistakeAnswer: wrongLTR
            };
        },
        function () {
            const a = randInt(20, 50), b = randInt(2, 8), c = randInt(2, 8);
            const answer = a - b * c;
            const wrongLTR = (a - b) * c;
            return {
                questionHTML: 'What is ' + a + ' − ' + b + ' × ' + c + ' ?',
                answer: answer,
                mistakeAnswer: wrongLTR
            };
        },
        function () {
            const b = randInt(2, 9);
            const quot = randInt(2, 9);
            const bTimesQuot = b * quot;
            const a = randInt(1, 30);
            const answer = a + quot;
            return {
                questionHTML: 'What is ' + a + ' + ' + bTimesQuot + ' ÷ ' + b + ' ?',
                answer: answer,
                mistakeAnswer: Math.floor((a + bTimesQuot) / b)
            };
        },
        function () {
            const b = randInt(2, 8);
            const quot = randInt(2, 8);
            const bTimesQuot = b * quot;
            const a = randInt(quot + 5, 50);
            const answer = a - quot;
            return {
                questionHTML: 'What is ' + a + ' − ' + bTimesQuot + ' ÷ ' + b + ' ?',
                answer: answer,
                mistakeAnswer: Math.floor((a - bTimesQuot) / b)
            };
        }
    ];
    const t = pick(templates)();
    const wrongs = [t.mistakeAnswer];
    const extras = offsetWrongs(t.answer, 3, 8);
    for (const e of extras) {
        if (e !== t.answer && e !== t.mistakeAnswer && !wrongs.includes(e)) wrongs.push(e);
        if (wrongs.length >= 3) break;
    }
    while (wrongs.length < 3) {
        const w = randInt(1, t.answer + 20);
        if (w !== t.answer && !wrongs.includes(w)) wrongs.push(w);
    }
    return {
        type: 'mixed_ops',
        label: 'Mixed Operations',
        questionHTML: t.questionHTML,
        answer: t.answer,
        display: '' + t.answer,
        wrongs: wrongs.slice(0, 3)
    };
}

/* ----------------------------------------------------------
   HARD MODE GENERATORS (7 categories)
   ---------------------------------------------------------- */

/* 1. BODMAS / Order of Operations */
function genHardBODMAS() {
    const templates = [
        function () {
            const a = randInt(2, 20), b = randInt(2, 15), c = randInt(2, 8);
            const answer = (a + b) * c;
            return {
                q: '(' + a + ' + ' + b + ') × ' + c,
                a: answer,
                mistake: a + b * c
            };
        },
        function () {
            const a = randInt(30, 60), b = randInt(2, 8), c = randInt(2, 8);
            const answer = a - (b * c);
            return {
                q: a + ' − (' + b + ' × ' + c + ')',
                a: answer,
                mistake: (a - b) * c
            };
        },
        function () {
            const div = randInt(2, 6);
            const a = div * randInt(2, 8);
            const c = randInt(2, 6), d = randInt(2, 6);
            const answer = (a / div) + (c * d);
            return {
                q: '(' + a + ' ÷ ' + div + ') + (' + c + ' × ' + d + ')',
                a: answer,
                mistake: Math.floor(a / (div + c)) * d
            };
        },
        function () {
            const a = randInt(2, 10), b = randInt(2, 10), c = randInt(1, 10);
            const answer = a * b + c;
            return {
                q: a + ' × (' + b + ' + ' + c + ') − ' + (a * c),
                a: a * b,
                mistake: a * b + c
            };
        }
    ];
    const t = pick(templates)();
    const wrongs = [];
    if (t.mistake !== t.a && t.mistake > 0) wrongs.push(t.mistake);
    const extras = offsetWrongs(t.a, 4, 10);
    for (const e of extras) {
        if (e !== t.a && !wrongs.includes(e)) wrongs.push(e);
        if (wrongs.length >= 3) break;
    }
    while (wrongs.length < 3) {
        const w = randInt(1, t.a + 20);
        if (w !== t.a && !wrongs.includes(w)) wrongs.push(w);
    }
    return {
        type: 'bodmas',
        label: 'Order of Operations',
        questionHTML: t.q + ' = ?',
        answer: t.a,
        display: '' + t.a,
        wrongs: wrongs.slice(0, 3)
    };
}

/* 2. Exponents */
function genHardExponents() {
    const templates = [
        function () {
            const base = randInt(2, 9);
            const answer = base * base;
            return {
                q: base + '<sup>2</sup>',
                a: answer,
                mistake: base * 2
            };
        },
        function () {
            const a = randInt(2, 7), b = randInt(2, 7);
            const answer = a * a + b * b;
            return {
                q: a + '<sup>2</sup> + ' + b + '<sup>2</sup>',
                a: answer,
                mistake: (a + b) * (a + b)
            };
        },
        function () {
            const base = randInt(2, 4);
            const exp = randInt(3, 4);
            const answer = Math.pow(base, exp);
            return {
                q: base + '<sup>' + exp + '</sup>',
                a: answer,
                mistake: base * exp
            };
        },
        function () {
            const base = randInt(2, 9);
            const sub = randInt(1, base * base - 1);
            const answer = base * base - sub;
            return {
                q: base + '<sup>2</sup> − ' + sub,
                a: answer,
                mistake: base * 2 - sub
            };
        },
        function () {
            const a = randInt(2, 5);
            const answer = Math.pow(a, 3);
            return {
                q: a + '<sup>3</sup>',
                a: answer,
                mistake: a * 3
            };
        }
    ];
    const t = pick(templates)();
    const wrongs = [];
    if (t.mistake !== t.a && t.mistake > 0) wrongs.push(t.mistake);
    const extras = offsetWrongs(t.a, 4, 8);
    for (const e of extras) {
        if (e !== t.a && !wrongs.includes(e)) wrongs.push(e);
        if (wrongs.length >= 3) break;
    }
    while (wrongs.length < 3) {
        const w = randInt(1, t.a + 15);
        if (w !== t.a && !wrongs.includes(w)) wrongs.push(w);
    }
    return {
        type: 'exponents',
        label: 'Exponents',
        questionHTML: t.q + ' = ?',
        answer: t.a,
        display: '' + t.a,
        wrongs: wrongs.slice(0, 3)
    };
}

/* 3. Square Roots */
function genHardSquareRoots() {
    const perfectSquares = [4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144, 169, 196, 225];
    const templates = [
        function () {
            const sq = pick(perfectSquares);
            const answer = Math.sqrt(sq);
            return {
                q: '√' + sq,
                a: answer,
                mistake: sq / 2
            };
        },
        function () {
            const sq = pick(perfectSquares);
            const root = Math.sqrt(sq);
            const add = randInt(1, 15);
            const answer = root + add;
            return {
                q: '√' + sq + ' + ' + add,
                a: answer,
                mistake: Math.sqrt(sq + add)
            };
        },
        function () {
            const sq = pick(perfectSquares.slice(0, 8)); // keep roots small
            const root = Math.sqrt(sq);
            const mult = randInt(2, 5);
            const answer = root * mult;
            return {
                q: '√' + sq + ' × ' + mult,
                a: answer,
                mistake: Math.floor(Math.sqrt(sq * mult))
            };
        },
        function () {
            const sq1 = pick(perfectSquares);
            const sq2 = pick(perfectSquares);
            const answer = Math.sqrt(sq1) + Math.sqrt(sq2);
            return {
                q: '√' + sq1 + ' + √' + sq2,
                a: answer,
                mistake: Math.floor(Math.sqrt(sq1 + sq2))
            };
        }
    ];
    const t = pick(templates)();
    const wrongs = [];
    if (t.mistake !== t.a && t.mistake > 0 && Number.isFinite(t.mistake)) {
        wrongs.push(Math.floor(t.mistake));
    }
    const extras = offsetWrongs(t.a, 4, 4);
    for (const e of extras) {
        if (e !== t.a && !wrongs.includes(e)) wrongs.push(e);
        if (wrongs.length >= 3) break;
    }
    while (wrongs.length < 3) {
        const w = randInt(1, t.a + 10);
        if (w !== t.a && !wrongs.includes(w)) wrongs.push(w);
    }
    return {
        type: 'square_roots',
        label: 'Square Roots',
        questionHTML: t.q + ' = ?',
        answer: t.a,
        display: '' + t.a,
        wrongs: wrongs.slice(0, 3)
    };
}

/* 4. Fractions */
function genHardFractions() {
    const denoms = [2, 3, 4, 5, 6, 8, 10];
    const templates = [
        // Add two fractions
        function () {
            const d = pick([2, 3, 4, 5, 6]);
            const d2 = d * pick([2, 3]);
            const n1 = randInt(1, d - 1);
            const n2 = randInt(1, d2 - 1);
            // n1/d + n2/d2  → common denom = d2
            const commonNum = n1 * (d2 / d) + n2;
            const [sn, sd] = simplifyFrac(commonNum, d2);
            const answerNum = commonNum / d2;
            return {
                q: fracHTML(n1, d) + ' + ' + fracHTML(n2, d2),
                a: answerNum,
                dispNum: sn,
                dispDen: sd,
                isFrac: true
            };
        },
        // Fraction × integer
        function () {
            const d = pick(denoms);
            const n = randInt(1, d - 1);
            const mult = randInt(2, 10);
            const rawNum = n * mult;
            const [sn, sd] = simplifyFrac(rawNum, d);
            const answerNum = rawNum / d;
            return {
                q: fracHTML(n, d) + ' × ' + mult,
                a: answerNum,
                dispNum: sn,
                dispDen: sd,
                isFrac: true
            };
        },
        // Add two simple fractions
        function () {
            const d1 = pick([2, 3, 4, 5]);
            const d2 = pick([2, 3, 4, 5]);
            const n1 = randInt(1, d1 - 1);
            const n2 = randInt(1, d2 - 1);
            const lcd = (d1 * d2) / gcd(d1, d2);
            const commonNum = n1 * (lcd / d1) + n2 * (lcd / d2);
            const [sn, sd] = simplifyFrac(commonNum, lcd);
            const answerNum = commonNum / lcd;
            return {
                q: fracHTML(n1, d1) + ' + ' + fracHTML(n2, d2),
                a: answerNum,
                dispNum: sn,
                dispDen: sd,
                isFrac: true
            };
        }
    ];
    const t = pick(templates)();

    // Generate wrong fraction options
    const wrongs = [];
    const wrongFracs = [];
    let attempts = 0;
    while (wrongs.length < 3 && attempts < 100) {
        attempts++;
        let wn, wd;
        if (t.dispDen === 1) {
            // Integer answer — generate nearby integers
            const w = t.dispNum + pick([-2, -1, 1, 2, 3]);
            if (w > 0 && w !== t.dispNum && !wrongs.includes(w)) {
                wrongs.push(w);
                wrongFracs.push({ n: w, d: 1 });
            }
        } else {
            wn = t.dispNum + pick([-2, -1, 1, 2, 3]);
            wd = t.dispDen;
            if (wn > 0 && wn !== t.dispNum) {
                const [swn, swd] = simplifyFrac(wn, wd);
                const val = wn / wd;
                if (!wrongs.includes(val) && val !== t.a) {
                    wrongs.push(val);
                    wrongFracs.push({ n: swn, d: swd });
                }
            }
        }
    }
    // Fallback
    while (wrongs.length < 3) {
        const w = randInt(1, 10);
        const wd = pick([2, 3, 4, 5]);
        const val = w / wd;
        if (val !== t.a && !wrongs.includes(val)) {
            const [swn, swd] = simplifyFrac(w, wd);
            wrongs.push(val);
            wrongFracs.push({ n: swn, d: swd });
        }
    }

    // Build display options
    const correctDisp = t.dispDen === 1 ? '' + t.dispNum : fracHTML(t.dispNum, t.dispDen);
    const allOptions = [{ val: t.a, html: correctDisp }];
    for (let i = 0; i < 3; i++) {
        const wf = wrongFracs[i];
        allOptions.push({
            val: wrongs[i],
            html: wf.d === 1 ? '' + wf.n : fracHTML(wf.n, wf.d)
        });
    }
    const shuffled = shuffle(allOptions);

    return {
        type: 'fractions',
        label: 'Fractions',
        questionHTML: t.q + ' = ?',
        answer: t.a,
        display: correctDisp,
        isFraction: true,
        fracOptions: shuffled
    };
}

/* 5. Percentages */
function genHardPercentages() {
    const percents = [10, 15, 20, 25, 30, 40, 50, 75];
    const templates = [
        function () {
            const p = pick(percents);
            // choose value so result is integer
            const base = pick([20, 40, 60, 80, 100, 120, 150, 200, 240, 300, 400, 450, 500]);
            const answer = (p / 100) * base;
            if (answer !== Math.floor(answer)) return null;
            return {
                q: p + '% of ' + base,
                a: answer,
                mistake: Math.floor(base / p)
            };
        },
        function () {
            const p = pick([10, 15, 20, 25, 50]);
            const base = pick([40, 60, 80, 100, 120, 200]);
            const answer = base + (p / 100) * base;
            if (answer !== Math.floor(answer)) return null;
            return {
                q: 'Increase ' + base + ' by ' + p + '%',
                a: answer,
                mistake: base + p
            };
        },
        function () {
            const p = pick([10, 20, 25, 50]);
            const base = pick([100, 200, 300, 400, 450, 500]);
            const add = randInt(5, 30);
            const answer = (p / 100) * base + add;
            if (answer !== Math.floor(answer)) return null;
            return {
                q: p + '% of ' + base + ' + ' + add,
                a: answer,
                mistake: Math.floor((p / 100) * (base + add))
            };
        }
    ];
    let t = null;
    let tries = 0;
    while (!t && tries < 50) {
        tries++;
        t = pick(templates)();
    }
    if (!t) {
        // safe fallback
        t = { q: '25% of 200', a: 50, mistake: 8 };
    }

    const wrongs = [];
    if (t.mistake !== t.a && t.mistake > 0) wrongs.push(t.mistake);
    const extras = offsetWrongs(t.a, 4, 15);
    for (const e of extras) {
        if (e !== t.a && !wrongs.includes(e)) wrongs.push(e);
        if (wrongs.length >= 3) break;
    }
    while (wrongs.length < 3) {
        const w = randInt(1, t.a + 30);
        if (w !== t.a && !wrongs.includes(w)) wrongs.push(w);
    }
    return {
        type: 'percentages',
        label: 'Percentages',
        questionHTML: t.q + ' = ?',
        answer: t.a,
        display: '' + t.a,
        wrongs: wrongs.slice(0, 3)
    };
}

/* 6. Basic Algebra */
function genHardAlgebra() {
    const templates = [
        function () {
            const x = randInt(1, 20);
            const a = randInt(1, 20);
            const b = x + a;
            return {
                q: 'If <em>x</em> + ' + a + ' = ' + b + ', find <em>x</em>',
                a: x,
                mistake: b + a
            };
        },
        function () {
            const x = randInt(1, 15);
            const coeff = randInt(2, 9);
            const product = coeff * x;
            return {
                q: 'If ' + coeff + '<em>x</em> = ' + product + ', find <em>x</em>',
                a: x,
                mistake: product - coeff
            };
        },
        function () {
            const x = randInt(1, 12);
            const coeff = randInt(2, 6);
            const add = randInt(1, 15);
            const result = coeff * x + add;
            return {
                q: 'If ' + coeff + '<em>x</em> + ' + add + ' = ' + result + ', find <em>x</em>',
                a: x,
                mistake: Math.floor((result + add) / coeff)
            };
        },
        function () {
            const x = randInt(2, 15);
            const sub = randInt(1, 10);
            const result = x - sub;
            return {
                q: 'If <em>x</em> − ' + sub + ' = ' + result + ', find <em>x</em>',
                a: x,
                mistake: result - sub
            };
        },
        function () {
            const x = randInt(1, 10);
            const coeff = randInt(2, 5);
            const sub = randInt(1, 10);
            const result = coeff * x - sub;
            return {
                q: 'If ' + coeff + '<em>x</em> − ' + sub + ' = ' + result + ', find <em>x</em>',
                a: x,
                mistake: Math.floor((result - sub) / coeff)
            };
        }
    ];
    const t = pick(templates)();
    const wrongs = [];
    if (t.mistake !== t.a && t.mistake > 0) wrongs.push(t.mistake);
    const extras = offsetWrongs(t.a, 4, 4);
    for (const e of extras) {
        if (e !== t.a && !wrongs.includes(e)) wrongs.push(e);
        if (wrongs.length >= 3) break;
    }
    while (wrongs.length < 3) {
        const w = randInt(1, t.a + 10);
        if (w !== t.a && !wrongs.includes(w)) wrongs.push(w);
    }
    return {
        type: 'algebra',
        label: 'Algebra',
        questionHTML: t.q,
        answer: t.a,
        display: '' + t.a,
        wrongs: wrongs.slice(0, 3)
    };
}

/* 7. Mixed Challenge */
function genHardMixedChallenge() {
    const perfectSquares = [4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144];
    const templates = [
        function () {
            const a = randInt(2, 10), b = randInt(2, 8);
            const sq = pick(perfectSquares);
            const root = Math.sqrt(sq);
            const answer = (a * b) + root;
            return {
                q: '(' + a + ' × ' + b + ') + √' + sq,
                a: answer
            };
        },
        function () {
            const p = pick([10, 20, 25, 50]);
            const base = pick([100, 200, 300, 400]);
            const add = randInt(5, 25);
            const answer = (p / 100) * base + add;
            return {
                q: p + '% of ' + base + ' + ' + add,
                a: answer
            };
        },
        function () {
            const base = randInt(2, 7);
            const sq = pick(perfectSquares.slice(0, 6));
            const root = Math.sqrt(sq);
            const mult = randInt(2, 4);
            const answer = (base * base + root) * mult;
            return {
                q: '(' + base + '<sup>2</sup> + √' + sq + ') × ' + mult,
                a: answer
            };
        },
        function () {
            const sq = pick(perfectSquares);
            const root = Math.sqrt(sq);
            const base = randInt(3, 9);
            const answer = base * base - root;
            return {
                q: base + '<sup>2</sup> − √' + sq,
                a: answer > 0 ? answer : base * base + root
            };
        },
        function () {
            const a = randInt(2, 8), b = randInt(2, 8);
            const base = randInt(2, 6);
            const answer = a * b + base * base;
            return {
                q: '(' + a + ' × ' + b + ') + ' + base + '<sup>2</sup>',
                a: answer
            };
        },
        function () {
            const p = pick([10, 25, 50]);
            const base = pick([100, 200, 400]);
            const sq = pick(perfectSquares.slice(0, 5));
            const root = Math.sqrt(sq);
            const answer = (p / 100) * base + root;
            return {
                q: p + '% of ' + base + ' + √' + sq,
                a: answer
            };
        }
    ];
    const t = pick(templates)();
    const answer = Math.round(t.a);
    const wrongs = offsetWrongs(answer, 3, 10);
    return {
        type: 'mixed_challenge',
        label: 'Mixed Challenge',
        questionHTML: t.q + ' = ?',
        answer: answer,
        display: '' + answer,
        wrongs: wrongs
    };
}

/* ----------------------------------------------------------
   GENERATOR REGISTRY & WEIGHTED SELECTION
   ---------------------------------------------------------- */

const generators = {
    easy: [genEasyAddition, genEasySubtraction],
    medium: [genMedMultiplication, genMedDivision, genMedMixedOps],
    hard: [
        genHardBODMAS,
        genHardExponents,
        genHardSquareRoots,
        genHardFractions,
        genHardPercentages,
        genHardAlgebra,
        genHardMixedChallenge
    ]
};

function pickGenerator(difficulty) {
    const pool = generators[difficulty];
    // Filter out recently used types
    const available = pool.filter(function (fn) {
        return !recentTypes.includes(fn);
    });
    const choices = available.length > 0 ? available : pool;
    const chosen = pick(choices);
    // Track last 2 types
    recentTypes.push(chosen);
    if (recentTypes.length > 2) recentTypes.shift();
    return chosen;
}

/* ----------------------------------------------------------
   GAME FLOW (preserving original structure)
   ---------------------------------------------------------- */

function startGame(difficulty) {
    currentDifficulty = difficulty;
    score = 0;
    recentTypes = [];
    answerLocked = false;
    if (difficulty === 'easy') timeLeft = 30;
    else if (difficulty === 'medium') timeLeft = 25;
    else timeLeft = 20;
    document.getElementById('score').innerText = '0';
    document.getElementById('timer').innerText = 'Time: ' + timeLeft + 's';
    document.getElementById('difficulty-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'block';
    document.getElementById('gameover-screen').style.display = 'none';

    // Show question type label
    var typeLabel = document.getElementById('question-type');
    if (typeLabel) typeLabel.textContent = '';

    generateQuestion();
    clearInterval(timerInterval);
    timerInterval = setInterval(tick, 1000);
}

function tick() {
    timeLeft--;
    document.getElementById('timer').innerText = 'Time: ' + timeLeft + 's';
    if (timeLeft <= 0) {
        clearInterval(timerInterval);
        gameOver();
    }
}

function gameOver() {
    const key = 'mathsQuizHighScore_' + currentDifficulty;
    const highScore = parseInt(localStorage.getItem(key) || 0);
    const newHighScore = Math.max(score, highScore);
    localStorage.setItem(key, newHighScore);
    document.getElementById('game-screen').style.display = 'none';
    document.getElementById('gameover-screen').style.display = 'block';
    document.getElementById('final-score').innerText = score;
    document.getElementById('final-high-score').innerText = newHighScore;
}

function backToMenu() {
    clearInterval(timerInterval);
    document.getElementById('gameover-screen').style.display = 'none';
    document.getElementById('difficulty-screen').style.display = 'block';
}

function restartQuiz() {
    let confirmRestart =
        confirm(
        "Are you sure?\nYour current score and progress will be lost."
        );
    if (!confirmRestart) {
        return;
    }
    clearInterval(timerInterval);
    score = 0;
    timeLeft = 0;
    correctAnswer = 0;
    correctDisplay = '';
    currentDifficulty = null;
    recentTypes = [];
    answerLocked = false;

    document.getElementById('score').innerText = '0';
    document.getElementById('timer').innerText = 'Time: 0s';
    document.getElementById('options-box').innerHTML = '';
    document.getElementById('question-box').innerHTML = 'Loading question...';

    var typeLabel = document.getElementById('question-type');
    if (typeLabel) typeLabel.textContent = '';

    document.getElementById('game-screen').style.display = 'none';
    document.getElementById('gameover-screen').style.display = 'none';
    document.getElementById('difficulty-screen').style.display = 'block';
}

/* ----------------------------------------------------------
   QUESTION RENDERING
   ---------------------------------------------------------- */

function generateQuestion() {
    answerLocked = false;
    const gen = pickGenerator(currentDifficulty);
    const q = gen();

    correctAnswer = q.answer;
    correctDisplay = q.display || '' + q.answer;

    // Set question type label
    var typeLabel = document.getElementById('question-type');
    if (typeLabel) typeLabel.textContent = q.label;

    // Set question text (HTML for superscripts, √, fractions)
    document.getElementById('question-box').innerHTML = q.questionHTML;

    // Build options
    const optionsBox = document.getElementById('options-box');
    optionsBox.innerHTML = '';

    if (q.isFraction && q.fracOptions) {
        // Fraction: options are pre-built HTML
        q.fracOptions.forEach(function (opt) {
            const btn = document.createElement('button');
            btn.innerHTML = opt.html;
            btn.dataset.value = opt.val;
            btn.onclick = function () { checkAnswer(btn, opt.val); };
            optionsBox.appendChild(btn);
        });
    } else {
        // Standard: build from answer + wrongs
        const allOpts = [{ val: q.answer, display: q.display || '' + q.answer }];
        q.wrongs.forEach(function (w) {
            allOpts.push({ val: w, display: '' + w });
        });
        const shuffled = shuffle(allOpts);
        shuffled.forEach(function (opt) {
            const btn = document.createElement('button');
            btn.innerHTML = opt.display;
            btn.dataset.value = opt.val;
            btn.onclick = function () { checkAnswer(btn, opt.val); };
            optionsBox.appendChild(btn);
        });
    }
}

/* ----------------------------------------------------------
   ANSWER CHECKING WITH VISUAL FEEDBACK
   ---------------------------------------------------------- */

function checkAnswer(btnEl, selected) {
    if (answerLocked) return;
    answerLocked = true;

    const isCorrect = Math.abs(selected - correctAnswer) < 0.001;

    // Visual feedback
    if (isCorrect) {
        btnEl.classList.add('option-correct');
        score += 10;
        timeLeft += 10;
        document.getElementById('score').innerText = score;
    } else {
        btnEl.classList.add('option-wrong');
        timeLeft -= 2;
        // Highlight the correct answer
        const allBtns = document.getElementById('options-box').querySelectorAll('button');
        allBtns.forEach(function (b) {
            if (Math.abs(parseFloat(b.dataset.value) - correctAnswer) < 0.001) {
                b.classList.add('option-correct');
            }
        });
    }

    document.getElementById('timer').innerText = 'Time: ' + timeLeft + 's';

    // Brief delay so player can see feedback, then next question
    setTimeout(function () {
        generateQuestion();
    }, 600);
}