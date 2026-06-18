// src/utils/questionData.js
// Curated Codeforces problems from cf_links.csv
// Format: { id, title, difficulty, topic, tags, link, contestId, index, hint }

export const TOPICS = [
  'Bit-Manipulation',
  'Hashing',
  'Binary Search',
  'Number Theory',
  'Trees',
  'Matrix/Grids',
  'Games',
  'Strings',
  'Stacks',
  'Sortings',
  'Greedy',
  'Prefix Sum',
];

export const LEVELS = [800, 900, 1000, 1100, 1200, 1300, 1400, 1500];

function q(contestId, index, title, difficulty, topic, tags, hint = '') {
  return {
    id: `${contestId}-${index}`,
    title,
    difficulty,
    topic,
    tags,
    hint,
    link: contestId === 0 || contestId === 'problem' ? `https://codeforces.com/problemset/problem/${index}` : `https://codeforces.com/problemset/problem/${contestId}/${index}`,
    contestId,
    index,
  };
}

export const ALL_QUESTIONS = [

  // ══════════════════════════════════════════
  // BIT-MANIPULATION
  // ══════════════════════════════════════════

  q(1454 , 'A',   'Special Permutation',                                  800 , 'Bit-Manipulation',       ['implementation'],  'Reverse permutation and swap center if n is odd'),
  q(1421 , 'A',   'XORwice',                                              800 , 'Bit-Manipulation',       ['implementation'],  'The optimal x is simply (a AND b)'),
  q(1527 , 'A',   'And Then There Were K',                                800 , 'Bit-Manipulation',       ['implementation'],  'Find the largest power of 2 less than or equal to n'),
  q(467  , 'B',   'Fedor and New Game',                                   900 , 'Bit-Manipulation',       ['implementation'],  'Count set bits in (a XOR b) to find differences'),
  q(1559 , 'A',   'Mocha and Math',                                       900 , 'Bit-Manipulation',       ['implementation'],  'Bitwise AND all elements in the array'),
  q(276  , 'D',   'Little Girl and Maximum XOR',                          1000, 'Bit-Manipulation',       ['implementation'],  'Find the first bit where L and R differ'),
  q(579  , 'A',   'Raising Bacteria',                                     1000, 'Bit-Manipulation',       ['implementation'],  'Answer is the number of set bits in n'),
  q(1918 , 'C',   'XOR-distance',                                         1300, 'Bit-Manipulation',       ['implementation'],  'Greedy bit flipping to minimize absolute difference'),
  q(1604 , 'B',   'XOR Specia-LIS-t',                                     1300, 'Bit-Manipulation',       ['implementation'],  'Check if n is even or if any adjacent pair is non-increasing'),
  q(1097 , 'B',   'Petr and Combination Lock',                            1300, 'Bit-Manipulation',       ['implementation'],  'Iterate through all 2^n combinations of +/-'),
  q(1095 , 'C',   'Powers of Two',                                        1400, 'Bit-Manipulation',       ['implementation'],  'Represent n as sum of k powers of 2 using a priority queue'),
  q(550  , 'B',   'Preparing Olympiad',                                   1400, 'Bit-Manipulation',       ['implementation'],  'Bitmask to try all subsets and check constraints'),
  q(519  , 'B',   'A and B and Compilation Errors',                       1100, 'Bit-Manipulation',       ['implementation'],  'Use XOR sum to find the missing number'),
  q(1922 , 'C',   'Minimal XOR',                                          1400, 'Bit-Manipulation',       ['implementation'],  'Prefix sums of distances to nearest neighbor'),
  q(1514 , 'C',   'Product 1 Modulo n',                                   1500, 'Bit-Manipulation',       ['implementation'],  'Pick all coprime numbers; check if their product mod n is 1'),
  q(1615 , 'B',   'And It\'s Non-Zero',                                   1500, 'Bit-Manipulation',       ['implementation'],  'Find the bit position with the most set bits in range [L R]'),
  q(1032 , 'C',   'The Wu',                                               1500, 'Bit-Manipulation',       ['implementation'],  'Subset sum DP with bitmask optimization'),
  q(864  , 'A',   'Fair Game',                                            800 , 'Bit-Manipulation',       ['implementation'],  'Count frequencies of distinct numbers'),
  q(1420 , 'B',   'Rock and Lever',                                       1200, 'Bit-Manipulation',       ['implementation'],  'Count numbers with the same highest set bit'),
  q(1569 , 'C',   'Strings and XOR',                                      1500, 'Bit-Manipulation',       ['implementation'],  'Combinatorics with exclusion of forbidden patterns'),

  // ══════════════════════════════════════════
  // HASHING
  // ══════════════════════════════════════════

  q(443  , 'A',   'Anton and Letters',                                    800 , 'Hashing',                ['implementation'],  'Use a set for unique character counts'),
  q(918  , 'B',   'Radio Station',                                        1000, 'Hashing',                ['implementation'],  'Map IP address to server name'),
  q(4    , 'C',   'Registration System',                                  1000, 'Hashing',                ['implementation'],  'Map string to frequency; append count if exists'),
  q(499  , 'B',   'Lecture',                                              1000, 'Hashing',                ['implementation'],  'Dictionary map to store word pairs'),
  q(520  , 'A',   'Pangram',                                              800 , 'Hashing',                ['implementation'],  'Set size should be 26 after lowercasing'),
  q(855  , 'A',   'Tom Riddle\'s Diary',                                  900 , 'Hashing',                ['implementation'],  'Set to track seen names'),
  q(1061 , 'A',   'Good Phrases',                                         1100, 'Hashing',                ['implementation'],  'Frequency map to check valid distribution'),
  q(2    , 'A',   'Winner',                                               1500, 'Hashing',                ['implementation'],  'Map for final scores then map for first to reach target'),
  q(447  , 'A',   'DZY Loves Hash',                                       900 , 'Hashing',                ['implementation'],  'Direct addressing to detect first collision'),
  q(1003 , 'A',   'Polycarp\'s Pockets',                                  800 , 'Hashing',                ['implementation'],  'Find the maximum frequency of any element'),
  q(1454 , 'B',   'Unique Bid Auction',                                   800 , 'Hashing',                ['implementation'],  'Map frequency and find smallest with count 1'),
  q(1426 , 'C',   'Maximum of Maximums',                                  1200, 'Hashing',                ['implementation'],  'Binary search or frequency counting'),
  q(1535 , 'C',   'Keep it Quiet',                                        1300, 'Hashing',                ['implementation'],  'Hash states of alternating strings'),
  q(1703 , 'D',   'Double Strings',                                       1100, 'Hashing',                ['implementation'],  'Set for O(1) lookup of prefixes and suffixes'),
  q(1520 , 'D',   'Same Differences',                                     1200, 'Hashing',                ['implementation'],  'Map frequency of (a[i] - i)'),
  q(550  , 'A',   'Two Substrings',                                       1500, 'Hashing',                ['implementation'],  'Check for non-overlapping \'AB\' and \'BA\''),
  q(1622 , 'B',   'Berland Music',                                        1000, 'Hashing',                ['implementation'],  'Sort by frequency and original rating'),
  q(1398 , 'C',   'Good Subarrays',                                       1500, 'Hashing',                ['implementation'],  'Map prefix sum minus index: (P[i] - i)'),
  q(126  , 'B',   'Password',                                             1500, 'Hashing',                ['implementation'],  'String hashing or Z-algorithm for prefix-suffix match'),
  q(1005 , 'B',   'Delete from Left',                                     900 , 'Hashing',                ['implementation'],  'Find longest common suffix'),

  // ══════════════════════════════════════════
  // BINARY SEARCH
  // ══════════════════════════════════════════

  q(1613 , 'C',   'Poisoned Dagger',                                      1200, 'Binary Search',          ['implementation'],  'Binary search on damage value k'),
  q(670  , 'D1',  'Magic Powder - 1',                                     1200, 'Binary Search',          ['implementation'],  'Binary search on number of cookies possible'),
  q(474  , 'B',   'Worms',                                                1400, 'Binary Search',          ['implementation'],  'Binary search on prefix sums'),
  q(706  , 'B',   'Interesting drink',                                    1100, 'Binary Search',          ['implementation'],  'upper_bound to find affordable shops'),
  q(371  , 'C',   'Hamburgers',                                           1500, 'Binary Search',          ['implementation'],  'Binary search on total hamburgers'),
  q(1201 , 'C',   'Maximum Median',                                       1400, 'Binary Search',          ['implementation'],  'Binary search on the median value'),
  q(812  , 'C',   'Sagheer and Nubian Market',                            1500, 'Binary Search',          ['implementation'],  'Binary search on k items'),
  q(1030 , 'C',   'Get together',                                         1500, 'Binary Search',          ['implementation'],  'Binary search on time T with interval intersection'),
  q(1352 , 'C',   'K-th Not Divisible by n',                              1200, 'Binary Search',          ['implementation'],  'Math formula or binary search on value'),
  q(492  , 'B',   'Vanya and Lanterns',                                   1200, 'Binary Search',          ['implementation'],  'Binary search on radius d'),
  q(448  , 'D',   'Multiplication Table',                                 1400, 'Binary Search',          ['implementation'],  'Binary search for k-th value in N*M table'),
  q(279  , 'B',   'Books',                                                1200, 'Binary Search',          ['implementation'],  'Two pointers or binary search on prefix sums'),
  q(978  , 'C',   'Letters',                                              1000, 'Binary Search',          ['implementation'],  'Lower bound on prefix sums of dorm sizes'),
  q(287  , 'B',   'Pipeline',                                             1500, 'Binary Search',          ['implementation'],  'Binary search on the number of splitters'),
  q(702  , 'C',   'Cellular Network',                                     1500, 'Binary Search',          ['implementation'],  'Binary search radius or find nearest tower'),
  q(808  , 'D',   'Array Division',                                       1500, 'Binary Search',          ['implementation'],  'Binary search with prefix/suffix sets'),
  q(1133 , 'C',   'Balanced Team',                                        1200, 'Binary Search',          ['implementation'],  'Sort and binary search for max range'),
  q(1174 , 'C',   'Ehab and a Special Coloring Problem',                  1400, 'Binary Search',          ['implementation'],  'Sieve-like approach with binary properties'),
  q(1900 , 'C',   'Ternary Search',                                       1500, 'Binary Search',          ['implementation'],  'Binary search on tree depths'),
  q(778  , 'A',   'String Game',                                          1500, 'Binary Search',          ['implementation'],  'Binary search on how many characters to delete'),

  // ══════════════════════════════════════════
  // NUMBER THEORY
  // ══════════════════════════════════════════

  q(1328 , 'A',   'Divisibility Problem',                                 800 , 'Number Theory',          ['implementation'],  'Simple modulo calculation'),
  q(1370 , 'A',   'Maximum GCD',                                          800 , 'Number Theory',          ['implementation'],  'Answer is n/2'),
  q(1389 , 'A',   'LCM Problem',                                          800 , 'Number Theory',          ['implementation'],  'Output [L 2*L] if 2*L <= R'),
  q(472  , 'A',   'Design Tutorial: Learn from Math',                     800 , 'Number Theory',          ['implementation'],  'Split n into 9+(n-9) or 8+(n-8)'),
  q(230  , 'B',   'T-primes',                                             1300, 'Number Theory',          ['implementation'],  'Check if sqrt(n) is prime'),
  q(17   , 'A',   'Noldbach Conjecture',                                  1000, 'Number Theory',          ['implementation'],  'Sieve of Eratosthenes to check p1+p2+1'),
  q(776  , 'B',   'Sherlock and his girlfriend',                          1200, 'Number Theory',          ['implementation'],  'Prime = 1 Composite = 2'),
  q(1285 , 'C',   'Fadi and LCM',                                         1300, 'Number Theory',          ['implementation'],  'Check divisors of X near sqrt(X) where gcd is 1'),
  q(271  , 'B',   'Prime Matrix',                                         1200, 'Number Theory',          ['implementation'],  'Sieve to find nearest prime for each cell'),
  q(1514 , 'C',   'Product 1 Modulo n',                                   1500, 'Number Theory',          ['implementation'],  'Pick all i such that gcd(i n) == 1'),
  q(630  , 'D',   'Hexagons!',                                            800 , 'Number Theory',          ['implementation'],  'Sum of arithmetic progression 3n(n+1)+1'),
  q(630  , 'A',   'Again Twenty Five!',                                   800 , 'Number Theory',          ['implementation'],  'Output 25 (constant for n >= 2)'),
  q(1360 , 'D',   'Buying Shovels',                                       1300, 'Number Theory',          ['implementation'],  'Find the largest divisor of n that is <= k'),
  q(588  , 'B',   'Duff in Love',                                         1200, 'Number Theory',          ['implementation'],  'Divide n by all square factors'),
  q(1350 , 'B',   'Orac and Models',                                      1400, 'Number Theory',          ['implementation'],  'DP where dp[j] = max(dp[i])+1 for i|j'),
  q(1203 , 'C',   'Common Divisors',                                      1200, 'Number Theory',          ['implementation'],  'Count divisors of the GCD of the array'),
  q(1373 , 'D',   'Jabeer and GCD',                                       1400, 'Number Theory',          ['implementation'],  'Maximize subarray sum using GCD properties'),
  q(1478 , 'B',   'Nezzar and Lucky Number',                              1100, 'Number Theory',          ['implementation'],  'Check if n >= d*10 else brute force'),
  q(407  , 'A',   'Divisible by Seven',                                   1500, 'Number Theory',          ['implementation'],  'Coordinate geometry with Pythagoras'),
  q(1370 , 'B',   'GCD Compression',                                      1200, 'Number Theory',          ['implementation'],  'Separate odd and even numbers'),

  // ══════════════════════════════════════════
  // TREES
  // ══════════════════════════════════════════

  q(115  , 'A',   'Party',                                                900 , 'Trees',                  ['implementation'],  'Find the maximum depth of the forest'),
  q(580  , 'C',   'Kefa and Park',                                        1500, 'Trees',                  ['implementation'],  'DFS while counting consecutive cat nodes'),
  q(913  , 'B',   'Christmas Spruce',                                     1100, 'Trees',                  ['implementation'],  'Check if every non-leaf has >= 3 leaf children'),
  q(1143 , 'C',   'Queen',                                                1300, 'Trees',                  ['implementation'],  'Delete node if it and all children respect none'),
  q(1300 , 'B',   'Circumference of a Tree',                              1500, 'Trees',                  ['implementation'],  'Find the tree diameter (max distance)'),
  q(1741 , 'D',   'Masha and a Beautiful Tree',                           1100, 'Trees',                  ['implementation'],  'Divide and conquer to sort the tree'),
  q(839  , 'C',   'Journey',                                              1500, 'Trees',                  ['implementation'],  'DFS to calculate expected path length'),
  q(1092 , 'F',   'Tree with Maximum Cost',                               1400, 'Trees',                  ['implementation'],  'Rerooting DP to calculate sum of dist*a[i]'),
  q(574  , 'B',   'Bear and Three Musketeers',                            1500, 'Trees',                  ['implementation'],  'Find a cycle of length 3 with minimum degrees'),
  q(1336 , 'A',   'Linova and Kingdom',                                   1500, 'Trees',                  ['implementation'],  'Greedy pick nodes based on depth - subtree_size'),
  q(862  , 'B',   'Mahmoud and Ehab and the bipartiteness',               1100, 'Trees',                  ['implementation'],  'Count nodes in two sets of bipartite graph'),
  q(763  , 'A',   'Timofey and a tree',                                   1500, 'Trees',                  ['implementation'],  'Check nodes incident to edges with different colors'),
  q(1300 , 'C',   'Fill the Tree',                                        1400, 'Trees',                  ['implementation'],  'Greedy bitwise OR on tree paths'),
  q(981  , 'C',   'Useful Decomposition',                                 1300, 'Trees',                  ['implementation'],  'Check if at most one node has degree > 2'),
  q(620  , 'C',   'New Year Tree',                                        1500, 'Trees',                  ['implementation'],  'DFS with bitmask for color tracking'),
  q(1037 , 'D',   'Valid BFS?',                                           1500, 'Trees',                  ['implementation'],  'Sort adjacency lists based on BFS input order'),
  q(1249 , 'B2',  'Book Exchange',                                        1200, 'Trees',                  ['implementation'],  'Find cycle sizes in the permutation'),
  q(1055 , 'A',   'Metro',                                                800 , 'Trees',                  ['implementation'],  'Check connectivity in a simple directed graph'),
  q(1167 , 'C',   'News Distribution',                                    1400, 'Trees',                  ['implementation'],  'DSU to find size of connected components'),
  q(1324 , 'F',   'Maximum White Subtree',                                1500, 'Trees',                  ['implementation'],  'Rerooting DP with +/- 1 for colors'),

  // ══════════════════════════════════════════
  // MATRIX/GRIDS
  // ══════════════════════════════════════════

  q(263  , 'A',   'Beautiful Matrix',                                     800 , 'Matrix/Grids',           ['implementation'],  'Manhattan distance to (3 3)'),
  q(510  , 'A',   'Fox and Snake',                                        800 , 'Matrix/Grids',           ['implementation'],  'Implementation of snake movement'),
  q(69   , 'A',   'Young Physicist',                                      1000, 'Matrix/Grids',           ['implementation'],  'Sum of coordinates in 3D grid'),
  q(405  , 'A',   'Gravity Flip',                                         900 , 'Matrix/Grids',           ['implementation'],  'Sort the column heights'),
  q(1063 , 'B',   'Labyrinth',                                            1500, 'Matrix/Grids',           ['implementation'],  '0-1 BFS to minimize left/right moves'),
  q(1955 , 'C',   'Inhabitant of the Deep Sea',                           1300, 'Matrix/Grids',           ['implementation'],  'Greedy from both ends of the row'),
  q(1680 , 'A',   'Robots',                                               1100, 'Matrix/Grids',           ['implementation'],  'Find intersection of two robot intervals'),
  q(1519 , 'B',   'The Cake is a Lie',                                    800 , 'Matrix/Grids',           ['implementation'],  'Cost is always n*m - 1 regardless of path'),
  q(1499 , 'C',   'Minimum Grid Path',                                    1400, 'Matrix/Grids',           ['implementation'],  'Greedy prefix sums for horizontal/vertical steps'),
  q(1513 , 'A',   'Array and Peaks',                                      800 , 'Matrix/Grids',           ['implementation'],  'Place peaks at odd indices'),
  q(520  , 'B',   'Two Buttons',                                          1000, 'Matrix/Grids',           ['implementation'],  'BFS or greedy from target to start'),
  q(377  , 'A',   'Maze',                                                 1500, 'Matrix/Grids',           ['implementation'],  'DFS and keep the first (S - k) nodes'),
  q(616  , 'C',   'The Labyrinth',                                        1500, 'Matrix/Grids',           ['implementation'],  'Group empty cells into components with DSU'),
  q(1117 , 'C',   'Magic Ship',                                           1500, 'Matrix/Grids',           ['implementation'],  'Binary search on time to reach destination'),
  q(1243 , 'A',   'Maximum Square',                                       800 , 'Matrix/Grids',           ['implementation'],  'Sort heights and find k where k-th height >= k'),
  q(177  , 'C1',  'Rectangular Game',                                     1200, 'Matrix/Grids',           ['implementation'],  'Find the largest clique in a social grid'),
  q(372  , 'A',   'Counting Kangaroos',                                   1500, 'Matrix/Grids',           ['implementation'],  'Sort and two pointers from middle'),
  q(545  , 'C',   'Woodcutters',                                          1500, 'Matrix/Grids',           ['implementation'],  'Greedy: fall left if possible else fall right'),
  q(492  , 'C',   'Vanya and Exams',                                      1500, 'Matrix/Grids',           ['implementation'],  'Greedy: pick exams with lowest cost to increase'),
  q(20   , 'C',   'Dijkstra?',                                            1500, 'Matrix/Grids',           ['implementation'],  'Standard Dijkstra with path reconstruction'),

  // ══════════════════════════════════════════
  // GAMES
  // ══════════════════════════════════════════

  q(451  , 'A',   'Game with Sticks',                                     900 , 'Games',                  ['implementation'],  'Winner depends on parity of min(n m)'),
  q(703  , 'A',   'Mishka and Game',                                      800 , 'Games',                  ['implementation'],  'Count rounds won by each player'),
  q(1382 , 'B',   'Sequential Nim',                                       1100, 'Games',                  ['implementation'],  'Winner depends on leading 1s parity'),
  q(1396 , 'B',   'Stoned Game',                                          1400, 'Games',                  ['implementation'],  'HL wins if max_pile > sum/2 else parity'),
  q(1527 , 'B1',  'Palindrome Game (easy)',                               1200, 'Games',                  ['implementation'],  'BOB wins unless zero count is odd and > 1'),
  q(611  , 'C',   'New Year and Constellation',                           1400, 'Games',                  ['implementation'],  '2D prefix sums for grid queries'),
  q(1472 , 'D',   'Even-Odd Game',                                        1200, 'Games',                  ['implementation'],  'Greedy: always pick the largest available number'),
  q(1370 , 'C',   'Number Game',                                          1300, 'Games',                  ['implementation'],  'Case analysis on prime factors and powers of 2'),
  q(1907 , 'C',   'Array Game',                                           1200, 'Games',                  ['implementation'],  'Max frequency vs remaining sum'),
  q(1968 , 'D',   'Permutation Game',                                     1500, 'Games',                  ['implementation'],  'Compare scores of staying vs moving'),
  q(1772 , 'A',   'Card Game',                                            800 , 'Games',                  ['implementation'],  'Simple comparison of max cards'),
  q(1929 , 'C',   'Sasha and the Casino',                                 1500, 'Games',                  ['implementation'],  'Check if sasha can always bet to cover losses'),
  q(1236 , 'B',   'Alice and the List of Presents',                       1200, 'Games',                  ['implementation'],  'Modular exponentiation (2^m - 1)^n'),
  q(755  , 'C',   'Tax',                                                  1500, 'Games',                  ['implementation'],  'Find number of connected components in a forest'),
  q(1411 , 'A',   'In-game Chat',                                         800 , 'Games',                  ['implementation'],  'Count trailing brackets vs remaining length'),
  q(2    , 'A',   'Winner',                                               1500, 'Games',                  ['implementation'],  'Hashing scores over time'),
  q(1359 , 'A',   'Berland Poker',                                        800 , 'Games',                  ['implementation'],  'Max jokers minus max jokers for others'),
  q(1841 , 'A',   'A Game with Board',                                    800 , 'Games',                  ['implementation'],  'Alice wins if n >= 5'),
  q(1842 , 'A',   'Tenzing and Tsondu',                                   800 , 'Games',                  ['implementation'],  'Compare the sum of abilities'),
  q(977  , 'B',   'Two-Gram',                                             900 , 'Games',                  ['implementation'],  'Find the most frequent pair of characters'),

  // ══════════════════════════════════════════
  // STRINGS
  // ══════════════════════════════════════════

  q(112  , 'A',   'Petya and Strings',                                    800 , 'Strings',                ['implementation'],  'Case-insensitive lexicographical comparison'),
  q(281  , 'A',   'Word Capitalization',                                  800 , 'Strings',                ['implementation'],  'Check and modify only the first character'),
  q(41   , 'A',   'Translation',                                          800 , 'Strings',                ['implementation'],  'Check if one string is the reverse of the other'),
  q(208  , 'A',   'Dubstep',                                              900 , 'Strings',                ['implementation'],  'Remove WUB and handle extra spaces carefully'),
  q(339  , 'A',   'Helpful Maths',                                        800 , 'Strings',                ['implementation'],  'Sort numerical characters and join with plus signs'),
  q(118  , 'A',   'String Task',                                          1000, 'Strings',                ['implementation'],  'Filter vowels and insert dots before consonants'),
  q(131  , 'A',   'cAPS lOCK',                                            1000, 'Strings',                ['implementation'],  'Flip cases only if the word is all caps or only first is lower'),
  q(96   , 'A',   'Football',                                             900 , 'Strings',                ['implementation'],  'Look for a substring of 7 identical characters'),
  q(520  , 'A',   'Pangram',                                              800 , 'Strings',                ['implementation'],  'Check if the set of characters has size 26'),
  q(271  , 'D',   'Good Substrings',                                      1500, 'Strings',                ['implementation'],  'Use a Trie or Rolling Hash to count unique valid substrings'),
  q(1553 , 'B',   'Reverse String',                                       1500, 'Strings',                ['implementation'],  'Simulate moving right then left to match target'),
  q(1428 , 'B',   'ABBB',                                                 1100, 'Strings',                ['implementation'],  'Stack-like logic: AB and BB can both be deleted'),
  q(1594 , 'D',   'The Number of Imposters',                              1400, 'Strings',                ['implementation'],  'String-based logic mixed with bipartite coloring'),
  q(1385 , 'C',   'Common Prefixes',                                      1200, 'Strings',                ['implementation'],  'Construct strings by changing one char at index a[i]'),
  q(110  , 'C',   'Lucky String',                                         1100, 'Strings',                ['implementation'],  'Pattern \'abcd\' repeated n times'),
  q(285  , 'C',   'String Typo',                                          1300, 'Strings',                ['implementation'],  'Greedy removal of three-in-a-row or double-double pairs'),
  q(1512 , 'C',   'A-B Palindrome',                                       1200, 'Strings',                ['implementation'],  'Fill fixed chars then use remaining 0s and 1s greedily'),
  q(1433 , 'A',   'Boring Apartments',                                    800 , 'Strings',                ['implementation'],  'Calculate digits based on length and digit value'),
  q(1367 , 'A',   'Short Substrings',                                     800 , 'Strings',                ['implementation'],  'Take every second character after the first'),
  q(1304 , 'B',   'Longest Palindrome',                                   1200, 'Strings',                ['implementation'],  'Find pairs of reverse strings and one self-palindrome'),

  // ══════════════════════════════════════════
  // STACKS
  // ══════════════════════════════════════════

  q(266  , 'B',   'Queue at the School',                                  800 , 'Stacks',                 ['implementation'],  'Simulate swaps (can be thought of as a simple stack/queue)'),
  q(870  , 'C',   'Maximum of Maximums of Minimums',                      1400, 'Stacks',                 ['implementation'],  'Case analysis on k; k=2 uses prefix/suffix min'),
  q(1092 , 'B',   'Min Stack (Custom)',                                   1200, 'Stacks',                 ['implementation'],  'Sort and process in pairs'),
  q(1437 , 'D',   'Minimal Height Tree',                                  1500, 'Stacks',                 ['implementation'],  'BFS queue to build tree levels'),
  q(1343 , 'C',   'Alternating Subsequence',                              1200, 'Stacks',                 ['implementation'],  'Keep max of current sign segment (stack logic)'),
  q(1579 , 'E1',  'Productive Meeting',                                   1400, 'Stacks',                 ['implementation'],  'Priority queue (max-stack behavior) to pair talkative people'),
  q(1239 , 'A',   'Balanced Tunnel',                                      1400, 'Stacks',                 ['implementation'],  'Queue/pointer logic to see who was overtaken'),
  q(5    , 'C',   'Longest Regular Bracket Sequence',                     1500, 'Stacks',                 ['implementation'],  'Use a stack to find matching pairs and their lengths'),
  q(623  , 'A',   'Graph and String',                                     1500, 'Stacks',                 ['implementation'],  'Check consistency of \'b\' characters in the middle'),
  q(1405 , 'B',   'Array Cancellation',                                   1000, 'Stacks',                 ['implementation'],  'Maintain a \'balance\' of positive numbers to negate negatives'),
  q(1613 , 'C',   'Poisoned Dagger',                                      1200, 'Stacks',                 ['implementation'],  'Simulate damage with a time-stack'),
  q(479  , 'A',   'Expression',                                           1000, 'Stacks',                 ['implementation'],  'Try all parenthesized combinations (stack-like evaluation)'),
  q(746  , 'A',   'Compote',                                              800 , 'Stacks',                 ['implementation'],  'Take min ratio of 1:2:4'),
  q(1345 , 'B',   'Card Constructions',                                   1100, 'Stacks',                 ['implementation'],  'Greedily subtract largest possible pyramid'),
  q(1251 , 'A',   'Broken Keyboard',                                      1000, 'Stacks',                 ['implementation'],  'Characters occurring in odd-length blocks are valid'),
  q(1462 , 'D',   'Add to Neighbour',                                     1400, 'Stacks',                 ['implementation'],  'Simulate merging until all elements are equal'),
  q(1140 , 'C',   'Playlist',                                             1500, 'Stacks',                 ['implementation'],  'Priority queue to keep the \'k\' best lengths'),
  q(808  , 'C',   'Tea Party',                                            1300, 'Stacks',                 ['implementation'],  'Fill half then greedily distribute the rest'),
  q(81   , 'A',   'Plug-in',                                              1300, 'Stacks',                 ['implementation'],  'Standard stack to remove adjacent duplicate characters'),
  q(1475 , 'D',   'Cleaning the Phone',                                   1500, 'Stacks',                 ['implementation'],  'Two pointers or greedy stack on points-per-cost'),

  // ══════════════════════════════════════════
  // SORTINGS
  // ══════════════════════════════════════════

  q(405  , 'A',   'Gravity Flip',                                         900 , 'Sortings',               ['implementation'],  'Standard ascending sort'),
  q(230  , 'A',   'Dragons',                                              1000, 'Sortings',               ['implementation'],  'Sort by dragon strength and process greedily'),
  q(160  , 'A',   'Twins',                                                900 , 'Sortings',               ['implementation'],  'Sort descending and take until sum > half'),
  q(337  , 'A',   'Puzzles',                                              1000, 'Sortings',               ['implementation'],  'Sort and use sliding window of size n'),
  q(456  , 'A',   'Laptops',                                              1100, 'Sortings',               ['implementation'],  'Sort by price and check if quality is ever decreasing'),
  q(492  , 'B',   'Vanya and Lanterns',                                   1200, 'Sortings',               ['implementation'],  'Sort positions to find maximum gap'),
  q(489  , 'B',   'BerSU Ball',                                           1200, 'Sortings',               ['implementation'],  'Sort both arrays and use two pointers'),
  q(1352 , 'C',   'K-th Not Divisible by n',                              1200, 'Sortings',               ['implementation'],  'Sorting/Math to find the k-th gap'),
  q(1360 , 'B',   'Honest Coach',                                         800 , 'Sortings',               ['implementation'],  'Sort and find the minimum difference between neighbors'),
  q(1118 , 'B',   'Tanya and Candies',                                    1200, 'Sortings',               ['implementation'],  'Precalculate even/odd sums'),
  q(1291 , 'A',   'Array Sharpening',                                     1200, 'Sortings',               ['implementation'],  'Check if prefix and suffix can meet at an index'),
  q(1454 , 'B',   'Unique Bid Auction',                                   800 , 'Sortings',               ['implementation'],  'Sort by value but keep track of original indices'),
  q(279  , 'B',   'Books',                                                1200, 'Sortings',               ['implementation'],  'Sort (already sorted) and use two pointers'),
  q(1374 , 'C',   'Move Brackets',                                        1000, 'Sortings',               ['implementation'],  'Sort logic: count nested pairs and move the rest'),
  q(903  , 'C',   'Boxes Packing',                                        1200, 'Sortings',               ['implementation'],  'Frequency of the most frequent item (after sorting)'),
  q(1582 , 'B',   'Two Arrays',                                           1000, 'Sortings',               ['implementation'],  'Sort and compare element-wise with +1 allowance'),
  q(1539 , 'C',   'Stable Groups',                                        1200, 'Sortings',               ['implementation'],  'Sort differences and greedily fill the largest gaps'),
  q(1113 , 'B',   'Sasha and Magnetic Machines',                          1400, 'Sortings',               ['implementation'],  'Try dividing a large number and multiplying a small one'),
  q(1526 , 'C2',  'Potions (Hard Version)',                               1500, 'Sortings',               ['implementation'],  'Priority queue to \"undo\" the worst previous choices'),
  q(230  , 'B',   'T-primes',                                             1300, 'Sortings',               ['implementation'],  'Sort/Precompute squares of primes'),

  // ══════════════════════════════════════════
  // GREEDY
  // ══════════════════════════════════════════

  q(231  , 'A',   'Team',                                                 800 , 'Greedy',                 ['implementation'],  'Take the problem if >= 2 people know it'),
  q(50   , 'A',   'Domino piling',                                        800 , 'Greedy',                 ['implementation'],  'Fill as much of the area as possible'),
  q(492  , 'B',   'Vanya and Lanterns',                                   1200, 'Greedy',                 ['implementation'],  'Check edges and then the largest internal gap'),
  q(149  , 'A',   'Business Trip',                                        1100, 'Greedy',                 ['implementation'],  'Always pick the month with the most growth'),
  q(1154 , 'A',   'Restoring Three Numbers',                              800 , 'Greedy',                 ['implementation'],  'Largest number is the sum; others are (Sum - x)'),
  q(1399 , 'B',   'Gifts Fixer',                                          800 , 'Greedy',                 ['implementation'],  'Reduce both to their respective minimums simultaneously'),
  q(1335 , 'B',   'Construct the String',                                 1000, 'Greedy',                 ['implementation'],  'Repeat the first \'b\' letters in a cycle'),
  q(381  , 'A',   'Sereja and Dima',                                      800 , 'Greedy',                 ['implementation'],  'Always take the larger of the two available ends'),
  q(1335 , 'C',   'Two Teams Composing',                                  1100, 'Greedy',                 ['implementation'],  'Maximize min(distinct-1, frequency) or vice versa'),
  q(1359 , 'A',   'Berland Poker',                                        800 , 'Greedy',                 ['implementation'],  'Give one person max jokers, distribute rest evenly'),
  q(1352 , 'C',   'K-th Not Divisible by n',                              1200, 'Greedy',                 ['implementation'],  'Jump gaps of size n'),
  q(158  , 'B',   'Taxi',                                                 1100, 'Greedy',                 ['implementation'],  'Pair 3s with 1s, and 2s with 2s first'),
  q(318  , 'A',   'Even Odds',                                            900 , 'Greedy',                 ['implementation'],  'Place all odds then all evens'),
  q(1360 , 'D',   'Buying Shovels',                                       1300, 'Greedy',                 ['implementation'],  'Find the largest divisor ≤ k'),
  q(1368 , 'A',   'C+=',                                                  1000, 'Greedy',                 ['implementation'],  'Always add the smaller to the larger'),
  q(1440 , 'B',   'Sum of Medians',                                       1000, 'Greedy',                 ['implementation'],  'Pick medians from the end with minimal spacing'),
  q(1422 , 'B',   'Ayb and B',                                            1300, 'Greedy',                 ['implementation'],  'Make 4 symmetric cells equal to their median'),
  q(1607 , 'C',   'Minimum Extraction',                                   1100, 'Greedy',                 ['implementation'],  'Sort and find the maximum adjacent difference'),
  q(1294 , 'C',   'Product of Three Numbers',                             1200, 'Greedy',                 ['implementation'],  'Take the two smallest possible distinct divisors'),
  q(1613 , 'C',   'Poisoned Dagger',                                      1200, 'Greedy',                 ['implementation'],  'Greedily set k to hit the target total'),

  // ══════════════════════════════════════════
  // PREFIX SUM
  // ══════════════════════════════════════════

  q(474  , 'B',   'Worms',                                                1100, 'Prefix Sum',             ['implementation'],  'Cumulative sums of pile sizes for quick lookup'),
  q(313  , 'B',   'Ilya and Queries',                                     1100, 'Prefix Sum',             ['implementation'],  'Count matching adjacent characters up to index i'),
  q(433  , 'B',   'Kuriyama Mirai\'s Stones',                             1200, 'Prefix Sum',             ['implementation'],  'Two prefix sum arrays: one original, one sorted'),
  q(363  , 'B',   'Fence',                                                1100, 'Prefix Sum',             ['implementation'],  'Sliding window of size k using prefix sums'),
  q(961  , 'B',   'Lecture Sleep',                                        1200, 'Prefix Sum',             ['implementation'],  'Prefix sums of points missed while sleeping'),
  q(1398 , 'C',   'Good Subarrays',                                       1500, 'Prefix Sum',             ['implementation'],  'Count pairs where P[j] - P[i] = j - i'),
  q(1118 , 'B',   'Tanya and Candies',                                    1200, 'Prefix Sum',             ['implementation'],  'Even and odd indices prefix sums'),
  q(276  , 'C',   'Little Girl and Maximum Sum',                          1500, 'Prefix Sum',             ['implementation'],  'Difference array to find query frequency per index'),
  q(295  , 'A',   'Greg and Array',                                       1400, 'Prefix Sum',             ['implementation'],  'Difference array for operations, then for the array'),
  q(1373 , 'D',   'Maximum Subarray Sum',                                 1100, 'Prefix Sum',             ['implementation'],  'Kadane\'s or prefix sums on even/odd differences'),
  q(816  , 'B',   'Karen and Coffee',                                     1500, 'Prefix Sum',             ['implementation'],  'Difference array to count overlapping intervals'),
  q(1550 , 'C',   'Abruptly',                                             1400, 'Prefix Sum',             ['implementation'],  'Check all small subarrays using prefix properties'),
  q(0    , 'USACO', 'Breed Counting',                                       1300, 'Prefix Sum',             ['implementation'],  'Three prefix sum arrays for each type'),
  q(18   , 'C',   'Stripe',                                               1000, 'Prefix Sum',             ['implementation'],  'Number of ways to split array into two equal sums'),
  q(1339 , 'B',   'Sorted Adjacent Differences',                          1200, 'Prefix Sum',             ['implementation'],  'Prefix logic mixed with sorting from center out'),
  q(466  , 'C',   'Number of Ways',                                       1500, 'Prefix Sum',             ['implementation'],  'Prefix sum = Total/3, then count occurrences'),
  q(368  , 'B',   'Sereja and Suffixes',                                  1000, 'Prefix Sum',             ['implementation'],  'Suffix array of unique element counts'),
  q(962  , 'A',   'Equator',                                              900 , 'Prefix Sum',             ['implementation'],  'Find first i where P[i] >= Total/2'),
  q(1458 , 'A',   'Maximum GCD',                                          1400, 'Prefix Sum',             ['implementation'],  'gcd(a1+b, a2+b, ...) = gcd(a1+b, a2-a1, a3-a2, ...)'),
  q(1519 , 'B',   'The Cake Is a Lie',                                    800 , 'Prefix Sum',             ['implementation'],  'Check if k = n*m - 1'),

];

// Build lookup map
export const ALL_QUESTIONS_MAP = {};
for (const q of ALL_QUESTIONS) {
  ALL_QUESTIONS_MAP[q.id] = q;
}

// Get questions for a specific topic + level
export function getQForTopicLevel(topic, level) {
  return ALL_QUESTIONS.filter(q => q.topic === topic && q.difficulty === level);
}

// Get all questions for a topic
export function getQuestionsByTopic(topic) {
  return ALL_QUESTIONS.filter(q => q.topic === topic);
}

// Difficulty label
export function getDifficultyLabel(level) {
  if (level <= 900)  return 'Easy';
  if (level <= 1100) return 'Medium';
  if (level <= 1300) return 'Hard';
  return 'Expert';
}

export function getDifficultyClass(level) {
  if (level <= 900)  return 'badge-easy';
  if (level <= 1100) return 'badge-medium';
  return 'badge-hard';
}

export function getTotalSolvedCount(progress) {
  let count = 0;
  for (const topic of Object.keys(progress)) {
    for (const level of Object.keys(progress[topic])) {
      count += (progress[topic][level]?.solved?.length || 0);
    }
  }
  return count;
}

// Legacy aliases used in some components
export const QUESTIONS = ALL_QUESTIONS;
export const QUESTIONS_MAP = ALL_QUESTIONS_MAP;
export function getQuestionsByTopicAndLevel(topic, level) {
  return getQForTopicLevel(topic, level);
}
