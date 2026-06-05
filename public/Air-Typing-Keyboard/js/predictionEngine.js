/**
 * ═══════════════════════════════════════════════════════════
 * AirType AI — Prediction Engine
 * Smart word prediction with frequency-based ranking,
 * Levenshtein autocorrect, and basic bigram context.
 * ═══════════════════════════════════════════════════════════
 */

export class PredictionEngine {
  constructor() {
    // Top ~2000 English words with frequency ranks (higher = more common)
    // This is a curated subset optimized for typing prediction
    this._dictionary = this._buildDictionary();

    // Basic bigram table: word → likely next words
    this._bigrams = this._buildBigrams();

    // Current state
    this._currentWord = '';
    this._previousWord = '';
    this._suggestions = [];

    // Settings
    this.maxSuggestions = 5;
    this.maxEditDistance = 2;
    this.enabled = true;
  }

  /**
   * Build the word dictionary with frequency scores.
   * @returns {Map<string, number>}
   */
  _buildDictionary() {
    // Words ordered roughly by frequency (rank = index position, lower = more frequent)
    const words = [
      'the','be','to','of','and','a','in','that','have','i','it','for','not','on','with',
      'he','as','you','do','at','this','but','his','by','from','they','we','say','her','she',
      'or','an','will','my','one','all','would','there','their','what','so','up','out','if',
      'about','who','get','which','go','me','when','make','can','like','time','no','just',
      'him','know','take','people','into','year','your','good','some','could','them','see',
      'other','than','then','now','look','only','come','its','over','think','also','back',
      'after','use','two','how','our','work','first','well','way','even','new','want','because',
      'any','these','give','day','most','us','great','between','need','large','often','each',
      'right','find','here','thing','many','still','long','too','should','tell','world','old',
      'last','never','very','may','while','show','every','same','another','begin','seem',
      'help','much','call','before','move','live','where','after','must','being','start',
      'high','such','turn','hand','keep','place','point','home','read','small','end','put',
      'found','play','away','run','house','under','part','take','next','try','head','down',
      'few','own','number','always','change','school','might','ask','close','life','open',
      'left','learn','real','off','line','without','write','around','those','story','city',
      'far','food','hard','both','few','feel','idea','side','water','young','kind','name',
      'eye','follow','face','problem','bring','stop','state','power','music','country',
      'against','talk','night','late','car','study','door','important','body','book','love',
      'family','child','children','word','group','hold','since','air','money','example',
      'already','friend','done','thought','enough','different','sure','boy','girl','going',
      'once','room','system','possible','point','program','question','business','earth',
      'hear','morning','mother','father','second','light','best','together','during','soon',
      'almost','develop','stand','form','able','set','human','plan','paper','public',
      'early','grow','health','result','eat','war','support','reason','strong','create',
      'fact','believe','death','today','area','information','government','company','social',
      'service','market','report','level','member','control','order','policy','include',
      'action','education','interest','return','building','figure','product','center',
      'period','record','table','experience','office','class','field','local','general',
      'special','research','effect','chance','natural','million','data','process','issue',
      'value','position','force','ground','industry','continue','game','short','machine',
      'price','national','near','fire','future','community','president','street','court',
      'rate','development','past','month','week','model','technology','computer','type',
      'practice','letter','picture','clear','decision','usually','full','language',
      'similar','personal','law','phone','increase','view','common','test','effort',
      'better','design','simple','total','project','remain','minute','event','press',
      'single','history','meet','whether','land','require','current','happen','popular',
      'serve','season','science','offer','wall','attention','least','team','voice',
      'accept','build','choose','across','bank','piece','activity','deal','material',
      'page','agree','account','manage','apply','section','either','present','environment',
      'performance','quality','standard','trade','professional','bit','concern','condition',
      'financial','customer','message','tax','appear','moment','media','actually','notice',
      'major','security','sign','strategy','resource','consider','space','authority','reach',
      'involve','property','available','director','window','response','production','north',
      'south','drive','establish','however','join','movement','success','stuff','challenge',
      'receive','various','generation','network','enter','relate','statement','sometimes',
      'contain','defense','senior','suggest','patient','option','employee','organization',
      'care','image','news','risk','teacher','break','role','article','final','blue',
      'ahead','color','capital','compare','energy','focus','forget','green','wide','range',
      'remember','reality','approach','measure','prepare','treatment','along','pretty',
      'physical','knowledge','collection','middle','region','road','size','skill','certain',
      'expect','ready','safe','among','animal','benefit','campaign','opportunity','share',
      'spring','student','summer','trouble','central','continue','debate','detail','draw',
      'feature','fund','growth','loss','official','possible','private','release','assume',
      'attack','base','catch','claim','civil','content','doctor','drop','fill','husband',
      'international','marriage','partner','pressure','reduce','scene','seek','sport',
      'surface','travel','truth','unit','wide','wonder','average','baby','beautiful',
      'blood','brother','camera','card','carry','cause','century','cold','cost','cover',
      'cut','deep','degree','east','edge','entire','federal','fight','hair','hit','hope',
      'hot','huge','indicate','indeed','inside','instead','kitchen','leader','listen',
      'majority','mission','nor','note','perform','plant','poor','relate','sister',
      'source','star','structure','throw','wrong','yeah','western','whatever','whose',
      'thank','hello','please','sorry','welcome','yes','no','okay','alright','good',
      'morning','evening','afternoon','night','today','tomorrow','yesterday','always',
      'never','sometimes','often','usually','really','actually','probably','maybe',
      'definitely','absolutely','certainly','basically','simply','clearly','obviously',
      'finally','recently','generally','currently','originally','apparently','literally',
      'eventually','suddenly','immediately','quickly','slowly','exactly','completely',
      'especially','particularly','already','still','further','therefore','however',
      'although','though','because','since','while','until','unless','whether','despite',
      'another','before','between','during','through','without','within','about','above',
      'across','after','against','along','among','around','behind','below','beside',
      'beyond','inside','outside','toward','upon','awesome','amazing','incredible',
      'fantastic','excellent','wonderful','perfect','terrible','horrible','beautiful',
      'gorgeous','stunning','brilliant','magnificent','outstanding','remarkable',
      'extraordinary','impressive','exceptional','superb','tremendous','spectacular',
      'phenomenal','glorious','marvelous','delightful','charming','elegant','graceful'
    ];

    const dict = new Map();
    words.forEach((word, i) => {
      // Frequency score: higher for more common words
      dict.set(word, Math.max(1, 1000 - i));
    });
    return dict;
  }

  /**
   * Build a basic bigram table for contextual predictions.
   * @returns {Map<string, string[]>}
   */
  _buildBigrams() {
    const bg = new Map();
    const pairs = [
      ['i', ['am','have','will','would','can','think','know','want','need','love','like','was','do']],
      ['you', ['are','have','will','would','can','should','need','want','know','think','like']],
      ['we', ['are','have','will','would','can','should','need','want','know']],
      ['they', ['are','have','will','would','can','should','need','were']],
      ['he', ['is','was','has','will','would','can','should']],
      ['she', ['is','was','has','will','would','can','should']],
      ['it', ['is','was','has','will','would','can','should']],
      ['the', ['best','most','first','last','same','other','new','old','great','good']],
      ['a', ['new','good','great','big','small','little','lot','few','long','very']],
      ['is', ['a','the','not','very','really','just','also','it','this','that']],
      ['are', ['you','we','they','the','not','very','really','just','also']],
      ['was', ['a','the','not','very','really','just','also','it','this','that']],
      ['have', ['a','to','been','not','you','we','they','the','it','this']],
      ['do', ['you','not','it','this','that','the','we','they']],
      ['can', ['you','we','i','they','he','she','it','not','be']],
      ['will', ['be','have','not','you','we','they','he','she','it']],
      ['would', ['be','have','like','you','not','love']],
      ['thank', ['you','god','goodness']],
      ['how', ['are','do','is','was','can','much','many','about','long']],
      ['what', ['is','are','do','was','about','if','does','would','can','time']],
      ['very', ['good','much','well','nice','happy','important','interesting']],
      ['not', ['only','just','yet','sure','really','even','enough','that','be']],
      ['this', ['is','was','will','would','can','should','has']],
      ['that', ['is','was','will','would','can','the','it']],
      ['good', ['morning','afternoon','evening','night','job','luck','idea','time','day']],
    ];

    pairs.forEach(([word, nexts]) => bg.set(word, nexts));
    return bg;
  }

  /**
   * Get word predictions based on the current input.
   * @param {string} currentWord - Word being typed (partial)
   * @param {string} previousWord - The previous completed word (for context)
   * @returns {string[]} Array of suggested words
   */
  predict(currentWord, previousWord = '') {
    if (!this.enabled || !currentWord) {
      // If no current word, try bigram prediction from previous word
      if (previousWord) {
        return this._bigramPredict(previousWord.toLowerCase());
      }
      return [];
    }

    const prefix = currentWord.toLowerCase();
    const results = [];

    // 1. Exact prefix matches
    for (const [word, freq] of this._dictionary) {
      if (word.startsWith(prefix) && word !== prefix) {
        results.push({ word, score: freq + 500 }); // Boost exact prefix matches
      }
    }

    // 2. Fuzzy matches (autocorrect) for longer inputs
    if (prefix.length >= 3) {
      for (const [word, freq] of this._dictionary) {
        if (!word.startsWith(prefix)) {
          const dist = this._levenshtein(prefix, word.substring(0, prefix.length + 1));
          if (dist <= this.maxEditDistance && dist > 0) {
            results.push({ word, score: freq - dist * 100 });
          }
        }
      }
    }

    // 3. Boost words from bigram context
    if (previousWord) {
      const contextWords = this._bigrams.get(previousWord.toLowerCase());
      if (contextWords) {
        results.forEach(r => {
          if (contextWords.includes(r.word)) {
            r.score += 300; // Context boost
          }
        });
      }
    }

    // Sort by score and deduplicate
    results.sort((a, b) => b.score - a.score);
    const seen = new Set();
    const unique = [];
    for (const r of results) {
      if (!seen.has(r.word)) {
        seen.add(r.word);
        unique.push(r.word);
      }
      if (unique.length >= this.maxSuggestions) break;
    }

    this._suggestions = unique;
    return unique;
  }

  /**
   * Get bigram-only predictions (when no current word is being typed).
   * @param {string} prevWord
   * @returns {string[]}
   */
  _bigramPredict(prevWord) {
    const nexts = this._bigrams.get(prevWord);
    if (!nexts) return [];
    return nexts.slice(0, this.maxSuggestions);
  }

  /**
   * Autocorrect a completed word.
   * @param {string} word - The word to check
   * @returns {string|null} Corrected word, or null if already correct
   */
  autocorrect(word) {
    const lower = word.toLowerCase();

    // Already in dictionary
    if (this._dictionary.has(lower)) return null;

    // Find closest match
    let bestMatch = null;
    let bestDist = Infinity;
    let bestFreq = 0;

    for (const [dictWord, freq] of this._dictionary) {
      const dist = this._levenshtein(lower, dictWord);
      if (dist <= this.maxEditDistance) {
        if (dist < bestDist || (dist === bestDist && freq > bestFreq)) {
          bestDist = dist;
          bestMatch = dictWord;
          bestFreq = freq;
        }
      }
    }

    return bestMatch;
  }

  /**
   * Compute Levenshtein edit distance between two strings.
   * @param {string} a
   * @param {string} b
   * @returns {number}
   */
  _levenshtein(a, b) {
    const la = a.length;
    const lb = b.length;

    // Quick bail for very different lengths
    if (Math.abs(la - lb) > this.maxEditDistance) return this.maxEditDistance + 1;

    const dp = Array.from({ length: la + 1 }, () => Array(lb + 1).fill(0));

    for (let i = 0; i <= la; i++) dp[i][0] = i;
    for (let j = 0; j <= lb; j++) dp[0][j] = j;

    for (let i = 1; i <= la; i++) {
      for (let j = 1; j <= lb; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1,      // deletion
          dp[i][j - 1] + 1,      // insertion
          dp[i - 1][j - 1] + cost // substitution
        );
      }
    }

    return dp[la][lb];
  }

  /**
   * Enable or disable predictions.
   * @param {boolean} enabled
   */
  setEnabled(enabled) {
    this.enabled = enabled;
  }

  /**
   * Get the current suggestions.
   * @returns {string[]}
   */
  getSuggestions() {
    return this._suggestions;
  }
}
