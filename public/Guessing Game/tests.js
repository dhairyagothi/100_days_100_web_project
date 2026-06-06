/*
 * Browser test suite for the Guessing Game runtime safety fixes.
 *
 * To run manually, load this file after script.js in index.html:
 * <script src="tests.js"></script>
 */
(function () {
    'use strict';

    const results = [];

    function assert(name, condition) {
        results.push({ name, passed: Boolean(condition) });
    }

    function createGameDom() {
        document.body.innerHTML = `
            <input id="guessInput" value="">
            <button id="guessBtn"></button>
            <button id="resetBtn"></button>
            <p id="message"></p>
            <span id="attempts"></span>
            <span id="bestScore"></span>
            <span id="hint"></span>
            <div id="historyList"></div>
            <button class="difficulty-btn active" data-diff="easy"></button>
            <button class="difficulty-btn" data-diff="medium"></button>
            <button class="difficulty-btn" data-diff="hard"></button>
        `;
    }

    function makeGame(options = {}) {
        const shouldClearStorage = options.clearStorage !== false;
        createGameDom();
        if (shouldClearStorage) {
            localStorage.clear();
        }
        return new GuessingGame();
    }

    function runTests() {
        const originalError = console.error;
        const originalRandom = Math.random;

        try {
            Math.random = () => 0.49;

            localStorage.clear();
            createGameDom();
            let game = new GuessingGame();
            assert('Initial bestScore is null', game.bestScore === null);

            localStorage.setItem('bestScore', '4');
            game = makeGame({ clearStorage: false });
            assert('Retrieved bestScore is a number', typeof game.bestScore === 'number');
            assert('Retrieved bestScore has correct value', game.bestScore === 4);

            localStorage.setItem('bestScore', 'abc');
            game = makeGame({ clearStorage: false });
            assert('Invalid bestScore returns null', game.bestScore === null);

            localStorage.setItem('bestScore', '-1');
            game = makeGame({ clearStorage: false });
            assert('Negative bestScore returns null', game.bestScore === null);

            localStorage.setItem('bestScore', '0');
            game = makeGame({ clearStorage: false });
            assert('Zero bestScore returns null', game.bestScore === null);

            game = makeGame();
            let prevented = false;
            game.guessInput.value = '49';
            game.guessInput.dispatchEvent(new KeyboardEvent('keydown', {
                key: 'Enter',
                bubbles: true,
                cancelable: true
            }));
            game.guessInput.addEventListener('keydown', (event) => {
                prevented = event.defaultPrevented;
            });
            game.guessInput.dispatchEvent(new KeyboardEvent('keydown', {
                key: 'Enter',
                bubbles: true,
                cancelable: true
            }));
            assert('Enter keydown is handled', game.attempts >= 1);
            assert('Enter keydown prevents default behavior', prevented === true);

            game = makeGame();
            game.guessInput = null;
            assert('makeGuess handles null guessInput without crashing', doesNotThrow(() => game.makeGuess()));

            game = makeGame();
            game.messageEl = null;
            assert('showMessage handles null message element', doesNotThrow(() => game.showMessage('Test', 'info')));

            game = makeGame();
            game.historyListEl = null;
            assert('history update handles null history element', doesNotThrow(() => game.updateHistoryDisplay()));

            game = makeGame();
            const invalidTargetEvent = new MouseEvent('click', { bubbles: true });
            Object.defineProperty(invalidTargetEvent, 'target', { value: document.createElement('span') });
            assert('Difficulty handler ignores invalid targets', doesNotThrow(() => {
                game.difficultyBtns[0].dispatchEvent(invalidTargetEvent);
            }));

            let secretWasLogged = false;
            console.error = function () {
                secretWasLogged = Array.from(arguments).some((value) => String(value).includes(String(game.secretNumber)));
            };
            game = makeGame();
            game.secretNumber = 42;
            game.bestScore = null;
            const originalSetItem = Storage.prototype.setItem;
            try {
                Storage.prototype.setItem = function () {
                    throw new Error('storage blocked');
                };
                game.handleWin();
            } finally {
                Storage.prototype.setItem = originalSetItem;
            }
            assert('Secret number is not logged to console', secretWasLogged === false);

            game = makeGame();
            game.guessInput.value = ' 49 ';
            game.makeGuess();
            assert('Trimmed numeric input is accepted', game.guessHistory.includes(49));

            game = makeGame();
            game.guessInput.value = 'abc';
            game.makeGuess();
            assert('Malformed input is rejected', game.attempts === 0);

            game = makeGame();
            game.guessInput.value = '08';
            game.makeGuess();
            assert('Leading-zero input is parsed with radix 10', game.guessHistory.includes(8));

            game = makeGame();
            game.guessInput.value = '999';
            game.makeGuess();
            assert('Out-of-range input does not consume attempt', game.attempts === 0);

            game = makeGame();
            game.secretNumber = 49;
            game.guessInput.value = '49';
            game.makeGuess();
            assert('Winning guess disables input', game.guessInput.disabled === true);
            assert('Winning guess stores bestScore as string', localStorage.getItem('bestScore') === '1');

            game = makeGame();
            game.guessInput.value = '30';
            game.makeGuess();
            game.guessInput.value = '30';
            game.makeGuess();
            assert('Duplicate guesses do not consume attempt', game.attempts === 1);

            game = makeGame();
            game.setDifficulty('hard');
            assert('Difficulty changes range', game.range.max === 200);
        } finally {
            console.error = originalError;
            Math.random = originalRandom;
        }

        reportResults();
    }

    function doesNotThrow(callback) {
        try {
            callback();
            return true;
        } catch (error) {
            return false;
        }
    }

    function reportResults() {
        const passed = results.filter((result) => result.passed).length;
        const failed = results.length - passed;

        results.forEach((result) => {
            const status = result.passed ? 'PASS' : 'FAIL';
            console.log(`${status}: ${result.name}`);
        });

        console.log(`Test Results: ${passed} passed, ${failed} failed, ${results.length} total`);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runTests);
    } else {
        runTests();
    }
}());
