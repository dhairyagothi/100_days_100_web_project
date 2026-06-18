// src/utils/studyData.js
// Maps the physical resources folder structure
// Subject → Topics → PDFs

export const STUDY_SUBJECTS = [
  {
    id: 'dsa_java',
    name: 'DSA (Java)',
    description: 'Data Structures & Algorithms with Java — curated notes for CP and Placements',
    icon: '☕',
    color: 'from-orange-500 to-amber-500',
    topics: [
      {
        id: 'binary-search',
        name: 'Binary Search',
        folderPath: 'NOTES/DSA_java/Binary Search',
        pdfs: [{ name: 'Binary Search - Complete', file: 'Binary Search -complete .pdf' }],
      },
      {
        id: 'bit-manipulation',
        name: 'Bit Manipulation',
        folderPath: 'NOTES/DSA_java/Bit-Manipulation',
        pdfs: [{ name: 'Bit Manipulation - 3', file: 'Bit Manipulation- 3.pdf' }],
      },
      {
        id: 'hashing',
        name: 'Hashing',
        folderPath: 'NOTES/DSA_java/Hashing',
        pdfs: [{ name: 'Hashing - Complete', file: 'Hashing -complete.pdf' }],
      },
      {
        id: 'linked-list',
        name: 'Linked List',
        folderPath: 'NOTES/DSA_java/Linked List',
        pdfs: [
          { name: 'Linked List - Part 1', file: 'Linked List - 1.pdf' },
          { name: 'Linked List - Part 2', file: 'Linked List -2.pdf' },
          { name: 'Linked List - Part 3', file: 'Linked List - 3.pdf' },
          { name: 'Linked List - Part 4', file: 'Linked List - 4.pdf' },
        ],
      },
      {
        id: 'methods-tc',
        name: 'Methods to Reduce TC',
        folderPath: 'NOTES/DSA_java/Methods to Reduce TC',
        pdfs: [
          { name: 'Carry Forward', file: 'Carry Forward.pdf' },
          { name: 'Prefix Sum', file: 'Prefix sum.pdf' },
          { name: 'Two Pointers 1', file: 'Two Pointer 1.pdf' },
        ],
      },
      {
        id: 'miscellaneous',
        name: 'Miscellaneous',
        folderPath: 'NOTES/DSA_java/Micellaneous',
        pdfs: [{ name: 'Interview 1', file: 'Interview 1.pdf' }],
      },
      {
        id: 'number-theory',
        name: 'Number Theory',
        folderPath: 'NOTES/DSA_java/Number Theory',
        pdfs: [
          { name: 'GCD', file: 'GCD.pdf' },
          { name: 'Prime Numbers', file: 'Prime numbers.pdf' },
        ],
      },
      {
        id: 'oop',
        name: 'Object Oriented Programming',
        folderPath: 'NOTES/DSA_java/Object Oriented Programming',
        pdfs: [{ name: 'OOPS Complete', file: 'OOPS COMPLETE.pdf' }],
      },
      {
        id: 'recursion',
        name: 'Recursion',
        folderPath: 'NOTES/DSA_java/Recursion',
        pdfs: [
          { name: 'Recursion - Part 1', file: 'Recursion-1.pdf' },
          { name: 'Recursion - Part 2', file: 'Recursion-2.pdf' },
        ],
      },
      {
        id: 'sorting',
        name: 'Sorting',
        folderPath: 'NOTES/DSA_java/Sorting',
        pdfs: [
          { name: 'Sorting - Part 1', file: 'Sorting 1.pdf' },
          { name: 'Sorting - Part 2', file: 'Sorting 2.pdf' },
          { name: 'Sorting - Part 3', file: 'Sorting 3.pdf' },
          { name: 'Sorting - Part 4', file: 'Sorting 4.pdf' },
        ],
      },
      {
        id: 'stacks',
        name: 'Stacks',
        folderPath: 'NOTES/DSA_java/Stacks',
        pdfs: [{ name: 'Stacks - Complete', file: 'Stacks - Complete.pdf' }],
      },
    ],
  },
  {
    id: 'iitm_bs',
    name: 'IITM BS',
    description: 'IIT Madras BS Degree course materials — Maths, Python & Statistics',
    icon: '🎓',
    color: 'from-blue-500 to-indigo-500',
    topics: [
      {
        id: 'iitm-maths',
        name: 'Mathematics',
        folderPath: 'NOTES/IITM_BS/Maths/Foundation_maths',
        pdfs: [],
        agenda: [
          {
            week: 2,
            title: 'Determinants & Matrix Inverse',
            pdf: 'week2.pdf',
            items: [
              'Determinants and Adjoint',
              'Elementary Row Operations',
              'Matrix Inverse',
              'Systems of Linear Equations'
            ]
          },
          {
            week: 3,
            title: 'Vector Spaces & Linear Independence',
            pdf: 'week345.pdf',
            items: [
              'Vector Spaces',
              'Subspaces',
              'Linear Dependence & Independence',
              'Applications'
            ]
          },
          {
            week: 4,
            title: 'Span, Basis & Dimension',
            pdf: 'week345.pdf',
            items: [
              'Span',
              'Basis',
              'Dimension',
              'Basis and Dimension Problems'
            ]
          },
          {
            week: 5,
            title: 'Rank, Nullity & Null Spaces',
            pdf: 'week345.pdf',
            items: [
              'Rank and Nullity',
              'Null Space',
              'Invertibility',
              'Special Matrices'
            ]
          },
          {
            week: 6,
            title: 'Linear Transformations, Kernel & Image',
            pdf: 'week6.pdf',
            items: [
              'Linear Transformations',
              'Kernel and Image',
              'Rank–Nullity Theorem',
              'Transformation Properties',
              'Change of Basis',
              'Kernel & Image Computations'
            ]
          },
          {
            week: 9,
            title: 'Multivariable Functions & Directional Derivatives',
            pdf: 'week9.pdf',
            items: [
              'Multivariable Functions',
              'Directional Derivatives',
              'Gradient Vector',
              'Applications',
              'Advanced Examples'
            ]
          },
          {
            week: 10,
            title: 'Tangent Planes & Linear Approximation',
            pdf: 'week10.pdf',
            items: [
              'Directional Derivatives Review',
              'Tangent Lines',
              'Gradient Applications',
              'Tangent Planes',
              'Linear Approximation',
              'Applications'
            ]
          },
          {
            week: 11,
            title: 'Hessian Matrix',
            pdf: 'week11.pdf',
            items: [
              'Used to check nature of critical point'
            ]
          }
        ]
      },
      {
        id: 'iitm-python',
        name: 'Python',
        folderPath: 'NOTES/IITM_BS/Python/Python_ICP',
        pdfs: [],
        agenda: [
          {
            week: 1,
            title: 'Python Basics & Strings',
            pdf: 'Python-compiled.pdf',
            items: [
              'Python Fundamentals',
              'Data Types',
              'Operators',
              'Strings',
              'String Methods'
            ]
          },
          {
            week: 2,
            title: 'Operators, Conditionals & Modules',
            pdf: 'Python-compiled.pdf',
            items: [
              'Assignment Operators',
              'Additional Operators',
              'Conditional Statements',
              'Python Modules'
            ]
          },
          {
            week: 3,
            title: 'Loops, Formatting & Control Statements',
            pdf: 'Python-compiled.pdf',
            items: [
              'Iteration',
              'String Formatting',
              'Print Function Options',
              'Loop Control Statements',
              'Numeric Concepts'
            ]
          },
          {
            week: 4,
            title: 'Lists & Matrix Operations',
            pdf: 'Python-compiled.pdf',
            items: [
              'Lists',
              'List Manipulation',
              'List Operations',
              'Matrix Operations'
            ]
          },
          {
            week: 5,
            title: 'Functions & Scope',
            pdf: 'Python-compiled.pdf',
            items: [
              'Functions',
              'Variable Scope',
              'Function Arguments',
              'Recursion Introduction'
            ]
          },
          {
            week: 6,
            title: 'Python Collections (Tuples, Sets, Dictionaries)',
            pdf: 'Python-compiled.pdf',
            items: [
              'Copying Objects',
              'Tuples',
              'Sets',
              'Dictionaries',
              'Application Problem'
            ]
          },
          {
            week: 8,
            title: 'Recursive Programming & Searching',
            pdf: 'Python-compiled.pdf',
            items: [
              'Recursion',
              'Recursive Algorithms',
              'Binary Search'
            ]
          },
          {
            week: 9,
            title: 'File Handling',
            pdf: 'Python-compiled.pdf',
            items: [
              'File Operations',
              'File Modes',
              'Safe File Handling',
              'Reading Techniques',
              'File Navigation',
              'Applications'
            ]
          },
          {
            week: 10,
            title: 'Object-Oriented Programming (OOP)',
            pdf: 'Python-compiled.pdf',
            items: [
              'Classes and Objects',
              'Self Keyword',
              'Constructors',
              'Variables in OOP',
              'Inheritance',
              'Method Overriding',
              'Encapsulation'
            ]
          },
          {
            week: 11,
            title: 'NumPy & Matplotlib',
            pdf: 'Python-compiled.pdf',
            items: [
              'NumPy',
              'NumPy vs Lists',
              'Matplotlib',
              'Plot Types',
              'Visualization Concepts'
            ]
          }
        ]
      },
      {
        id: 'iitm-stats',
        name: 'Statistics - Foundation 2',
        folderPath: 'NOTES/IITM_BS/Stats/stats foundation - 2',
        pdfs: [],
        agenda: [
          {
            week: 1,
            title: 'Foundations of Probability',
            pdf: 'week1.pdf',
            items: [
              'Joint Probability Mass Function (PMF)',
              'Marginal Distribution',
              'Conditional Distribution',
              'Independence of Random Variables',
              'Covariance & Correlation',
              'Basic probability problems (dice, tables, etc.)'
            ]
          },
          {
            week: 2,
            title: 'Independence & Functions of Random Variables',
            pdf: 'week2.pdf',
            items: [
              'Independence (discrete & continuous cases)',
              'i.i.d (Independent Identically Distributed variables)',
              'Functions of Random Variables',
              'Convolution (sum of independent variables)',
              'Poisson distribution & conditional cases',
              'Min/Max of random variables'
            ]
          },
          {
            week: 3,
            title: 'Expectation & Moments',
            pdf: 'week3.pdf',
            items: [
              'Expected Value (mean) of discrete random variables',
              'Properties of Expectation',
              'Variance & Standard Deviation',
              'Covariance & Correlation',
              'Standardization (Z-score)',
              'Inequalities: Markov & Chebyshev',
              'Real-world expectation problems (biased dice, etc.)'
            ]
          },
          {
            week: 4,
            title: 'Distribution Functions',
            pdf: 'week4.pdf',
            items: [
              'Cumulative Distribution Function (CDF)',
              'Properties of CDF',
              'Discrete & Continuous Random Variables',
              'Probability Density Function (PDF)',
              'Uniform Distribution',
              'Exponential Distribution',
              'Normal Distribution basics'
            ]
          },
          {
            week: 5,
            title: 'Continuous Random Variables & Transformations',
            pdf: 'week5.pdf',
            items: [
              'Monotonic functions & transformations',
              'PDF transformation techniques',
              'Expectation of continuous random variables',
              'Variance for continuous cases',
              'Standard distributions (Uniform, Exponential, Normal)',
              'Chebyshev inequality applications',
              'Conditional distributions (continuous case)'
            ]
          },
          {
            week: 6,
            title: 'Joint Continuous Distributions',
            pdf: 'week6.pdf',
            items: [
              'Joint PDF of continuous variables',
              'Marginal densities',
              'Joint uniform distribution',
              'Geometric probability',
              'Independence (continuous case)',
              'Conditional density functions',
              'Region-based probability problems'
            ]
          },
          {
            week: 7,
            title: 'Sampling & Statistical Methods',
            pdf: 'week7.pdf',
            items: [
              'Bernoulli Trials',
              'Monte Carlo Simulation',
              'Histograms & Data Representation',
              'i.i.d Samples',
              'Sample Mean & Variance',
              'Expectation & Variance of Sample Mean',
              'Sample Proportion',
              'Weak Law of Large Numbers (WLLN)',
              'Chebyshev inequality (sampling context)'
            ]
          },
          {
            week: 8,
            title: 'Moment Generating Functions, CLT & Special Distributions',
            pdf: 'week8.pdf',
            items: [
              'Moment Generating Function (MGF)',
              'MGF for discrete and continuous random variables',
              'MGF of transformed random variables',
              'MGF of sums of independent random variables',
              'Distribution of sums using MGF',
              'Higher moments using MGF',
              'MGF of sample mean',
              'Central Limit Theorem (CLT)',
              'Z-score and normal approximation',
              'CLT applications for sample means and sums',
              'Linear combinations of independent normal variables',
              'Gamma distribution',
              'Properties of Gamma distribution',
              'Relationship between Gamma, Exponential and Chi-square distributions'
            ]
          },
          {
            week: 9,
            title: 'Estimation Theory & Method of Moments',
            pdf: 'week9.pdf',
            items: [
              'Population, sample, parameter and estimator',
              'Estimation error',
              'Chebyshev inequality for estimation bounds',
              'Sample mean as an estimator',
              'Consistency of estimators',
              'Bias of an estimator',
              'Unbiased and biased estimators',
              'Variance of an estimator',
              'Mean Squared Error (MSE)',
              'Bias–Variance decomposition',
              'Bias–Variance tradeoff',
              'Population moments',
              'Sample moments',
              'Method of Moments estimation',
              'Moments of common distributions (Bernoulli, Poisson, Exponential, Normal, Gamma)'
            ]
          },
          {
            week: 10,
            title: 'Parameter Estimation & Bayesian Inference',
            pdf: 'week10.pdf',
            items: [
              'Parameter estimation overview',
              'Frequentist approach',
              'Method of Moments',
              'Maximum Likelihood Estimation (MLE)',
              'Bayesian approach',
              'Prior, Likelihood and Posterior distributions',
              'Bayes\' theorem for parameter estimation',
              'Posterior mode (MAP estimation)',
              'Posterior mean estimation',
              'Flat (uniform) priors',
              'Conjugate priors',
              'Standard conjugate prior pairs',
              'Bernoulli–Beta model',
              'Posterior distribution updates',
              'Bayesian estimation for Bernoulli parameters',
              'Normal prior–Normal likelihood model',
              'Bayesian estimation of Normal mean'
            ]
          },
          {
            week: 11,
            title: 'Hypothesis Testing',
            pdf: 'week11.pdf',
            items: [
              'Null hypothesis (H₀) and alternative hypothesis (H₁)',
              'Type I and Type II errors',
              'Significance level (α)',
              'Power of a test (1 − β)',
              'Critical regions and rejection rules',
              'One-tailed and two-tailed tests',
              'Z-test',
              'Hypothesis testing for population proportions',
              'Large-sample proportion tests',
              'Independent two-sample tests',
              'Comparison of two population means',
              'Test statistics and critical values',
              'F-test',
              'Comparing variances of two populations',
              'Degrees of freedom in F-tests',
              'Decision making using critical values'
            ]
          }
        ]
      },
    ],
  },
  {
    id: 'development',
    name: 'Development',
    description: 'Web Development notes and references',
    icon: '💻',
    color: 'from-purple-500 to-pink-500',
    topics: [],
  },
];

export function getPdfPath(subject, topic, pdf) {
  return encodeURI(`${import.meta.env.BASE_URL}resources/${topic.folderPath}/${pdf.file}`);
}

export function getSubjectById(id) {
  return STUDY_SUBJECTS.find(s => s.id === id);
}

export function getTopicById(subjectId, topicId) {
  const subject = getSubjectById(subjectId);
  return subject?.topics.find(t => t.id === topicId);
}

export function getTotalPdfCount() {
  return STUDY_SUBJECTS.reduce(
    (acc, s) => acc + s.topics.reduce((a, t) => a + t.pdfs.length, 0),
    0
  );
}
