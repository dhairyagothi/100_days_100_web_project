import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

const ROWS = 6;
const COLS = 7;

export default function App() {
  const createBoard = () =>
    Array(ROWS)
      .fill(null)
      .map(() => Array(COLS).fill(null));

  const [board, setBoard] = useState(createBoard());
  const [player, setPlayer] = useState("red");
  const [winner, setWinner] = useState(null);
  const [gameMode, setGameMode] = useState("pvp");
  const [aiThinking, setAiThinking] = useState(false);

  const aiTimeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (aiTimeoutRef.current) {
        clearTimeout(aiTimeoutRef.current);
      }
    };
  }, []);

  const checkWinner = (grid, row, col, color) => {
    const directions = [
      [0, 1],
      [1, 0],
      [1, 1],
      [1, -1],
    ];

    for (let [dx, dy] of directions) {
      let count = 1;

      for (let dir = -1; dir <= 1; dir += 2) {
        let r = row + dx * dir;
        let c = col + dy * dir;

        while (
          r >= 0 &&
          r < ROWS &&
          c >= 0 &&
          c < COLS &&
          grid[r][c] === color
        ) {
          count++;
          r += dx * dir;
          c += dy * dir;
        }
      }

      if (count >= 4) return true;
    }

    return false;
  };

  const makeMove = (
    col,
    currentPlayer = player,
    currentBoard = board
  ) => {
    if (winner) return;

    const newBoard = currentBoard.map((row) => [...row]);

    let placedRow = -1;

    for (let row = ROWS - 1; row >= 0; row--) {
      if (!newBoard[row][col]) {
        newBoard[row][col] = {
          color: currentPlayer,
          id: crypto.randomUUID(),
        };

        placedRow = row;
        break;
      }
    }

    if (placedRow === -1) return;

    const simpleBoard = newBoard.map((r) =>
      r.map((c) => (c ? c.color : null))
    );

    setBoard(newBoard);

    if (
      checkWinner(
        simpleBoard,
        placedRow,
        col,
        currentPlayer
      )
    ) {
      setWinner(currentPlayer);
      return;
    }

    const nextPlayer =
      currentPlayer === "red"
        ? "yellow"
        : "red";

    setPlayer(nextPlayer);

    // ONLY HUMAN MOVE TRIGGERS AI
    if (
      gameMode === "ai" &&
      currentPlayer === "red"
    ) {
      setAiThinking(true);

      if (aiTimeoutRef.current) {
        clearTimeout(aiTimeoutRef.current);
      }

      aiTimeoutRef.current = setTimeout(() => {
        aiMove(newBoard);
        setAiThinking(false);
      }, 500);
    }
  };

  const aiMove = (currentBoard) => {
    const simpleBoard = currentBoard.map((r) =>
      r.map((c) => (c ? c.color : null))
    );

    // AI WINNING MOVE
    for (let col = 0; col < COLS; col++) {
      const tempBoard = simpleBoard.map((row) => [...row]);

      for (let row = ROWS - 1; row >= 0; row--) {
        if (!tempBoard[row][col]) {
          tempBoard[row][col] = "yellow";

          if (
            checkWinner(
              tempBoard,
              row,
              col,
              "yellow"
            )
          ) {
            makeMove(
              col,
              "yellow",
              currentBoard
            );
            return;
          }

          break;
        }
      }
    }

    // BLOCK PLAYER WIN
    for (let col = 0; col < COLS; col++) {
      const tempBoard = simpleBoard.map((row) => [...row]);

      for (let row = ROWS - 1; row >= 0; row--) {
        if (!tempBoard[row][col]) {
          tempBoard[row][col] = "red";

          if (
            checkWinner(
              tempBoard,
              row,
              col,
              "red"
            )
          ) {
            makeMove(
              col,
              "yellow",
              currentBoard
            );
            return;
          }

          break;
        }
      }
    }

    // SMART CENTER PRIORITY
    const preferredCols = [3, 2, 4, 1, 5, 0, 6];

    for (let col of preferredCols) {
      if (!simpleBoard[0][col]) {
        makeMove(
          col,
          "yellow",
          currentBoard
        );
        return;
      }
    }
  };

  const resetGame = () => {
    if (aiTimeoutRef.current) {
      clearTimeout(aiTimeoutRef.current);
      aiTimeoutRef.current = null;
    }
    setBoard(createBoard());
    setWinner(null);
    setPlayer("red");
    setAiThinking(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center px-4 py-8 text-white">
      <h1 className="text-5xl md:text-6xl font-black mb-6">
        CONNECT 4
      </h1>

      {/* GAME MODES */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => {
            setGameMode("pvp");
            resetGame();
          }}
          className={`px-5 py-2 rounded-xl font-bold transition ${
            gameMode === "pvp"
              ? "bg-white text-black"
              : "bg-gray-700"
          }`}
        >
          2 Player
        </button>

        <button
          onClick={() => {
            setGameMode("ai");
            resetGame();
          }}
          className={`px-5 py-2 rounded-xl font-bold transition ${
            gameMode === "ai"
              ? "bg-white text-black"
              : "bg-gray-700"
          }`}
        >
          VS AI
        </button>
      </div>

      {/* STATUS */}
      <div className="mb-6">
        {winner ? (
          <div className="text-3xl font-bold">
            🎉 {winner.toUpperCase()} WINS!
          </div>
        ) : (
          <div className="flex items-center gap-3 text-2xl font-semibold">
            <div
              className={`w-6 h-6 rounded-full ${
                player === "red"
                  ? "bg-red-500"
                  : "bg-yellow-400"
              }`}
            />
            {player.toUpperCase()}'s TURN
          </div>
        )}
      </div>

      {/* BOARD */}
      <div className="bg-blue-700 p-4 rounded-[2rem]">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="flex">
            {row.map((cell, colIndex) => (
              <div
                key={colIndex}
                onClick={() => {
                  if (
                    gameMode === "ai" &&
                    (player === "yellow" ||
                      aiThinking)
                  ) {
                    return;
                  }

                  makeMove(colIndex);
                }}
                className="relative w-14 h-14 md:w-20 md:h-20 bg-blue-950 rounded-full m-1 overflow-visible cursor-pointer"
              >
                {cell && (
                  <motion.div
                    key={cell.id}
                    initial={{ y: -600 }}
                    animate={{ y: 0 }}
                    transition={{
                      type: "tween",
                      duration: 0.55,
                      ease: "linear",
                    }}
                    className={`absolute left-1/2 top-1/2 w-10 h-10 md:w-16 md:h-16 rounded-full -translate-x-1/2 -translate-y-1/2 ${
                      cell.color === "red"
                        ? "bg-red-500"
                        : "bg-yellow-400"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* RESTART */}
      <button
        onClick={resetGame}
        className="mt-8 px-8 py-4 bg-white text-black rounded-2xl font-bold text-lg"
      >
        Restart Game
      </button>
    </div>
  );
}