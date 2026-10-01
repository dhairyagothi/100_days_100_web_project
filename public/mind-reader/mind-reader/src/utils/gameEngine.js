function findchar(ans, prop, remainingCharacters) {
    // Keep only the characters that match the chosen answer for the given property.
    return remainingCharacters.filter(character => {
        if (character[prop] === ans) {
            // Preserve matching characters in the filtered list.
            console.log(character)
            return character;
        }
    })
}

function bestQues(questions, remainingCharacters) {
    // Select the question that most evenly splits the remaining characters.
    let keyDiff = []
    for (const question of questions) {
        let trueCount = 0;
        let falseCount = 0;

        // Count how many remaining characters evaluate to true or false.
        remainingCharacters.forEach(character => {
            if (character[question.key] === true) {
                trueCount++;
            } else {
                falseCount++;
            }

        })
        // A smaller difference means the question is more useful for narrowing down options.
        let diff = Math.abs(trueCount - falseCount)
        keyDiff = keyDiff.concat({ key: question.key, diff: diff })
    }



    let minimum = Infinity;
    let bestQuesKey;
    // Keep the question with the lowest imbalance between true and false counts.
    keyDiff.forEach(k => {

        if (k.diff < minimum && remainingCharacters.length != k.diff) {
            minimum = k.diff;
            bestQuesKey = k.key;
        }

    })
    return bestQuesKey

}

export { bestQues }
export { findchar }