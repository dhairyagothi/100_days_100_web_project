import React from 'react';
import { Play, Pause, RotateCcw, Brain, Gamepad2, Zap, Target, Activity } from 'lucide-react';
import { useSnakeGame } from '../hooks/useSnakeGame';

const NeuralSnake = () => {
  const {
    snake,
    food,
    score,
    highScore,
    gameState,
    isAIMode,
    aiTelemetry,
    startGame,
    pauseGame,
    resetGame,
    toggleAI,
    GRID_SIZE,
    GAME_STATES
  } = useSnakeGame();

  const renderGrid = () => {
    const cells = [];
    
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const isSnakeHead = snake[0]?.x === x && snake[0]?.y === y;
        const isSnakeBody = snake.slice(1).some(segment => segment.x === x && segment.y === y);
        const isFood = food.x === x && food.y === y;
        const isPredictionPath = aiTelemetry?.predictionPath?.some(
          (pos, index) => pos.x === x && pos.y === y && index > 0
        );
        
        let cellClass = 'w-3 h-3 border border-green-900 border-opacity-20';
        
        if (isSnakeHead) {
          cellClass += ' bg-green-900 shadow-sm'; // Snake head - darker
        } else if (isSnakeBody) {
          cellClass += ' bg-green-800'; // Snake body
        } else if (isFood) {
          cellClass += ' bg-green-900 animate-pulse'; // Food with pulse
        } else if (isPredictionPath && isAIMode) {
          cellClass += ' bg-green-600 opacity-40'; // AI prediction path
        } else {
          cellClass += ' bg-green-300'; // Empty LCD cell
        }
        
        cells.push(
          <div
            key={`${x}-${y}`}
            className={cellClass}
          />
        );
      }
    }
    
    return cells;
  };

  const getGameStateText = () => {
    switch (gameState) {
      case GAME_STATES.IDLE:
        return 'READY';
      case GAME_STATES.PAUSED:
        return 'PAUSED';
      case GAME_STATES.AI_MODE:
        return 'AI PILOT';
      case GAME_STATES.PLAYING:
        return 'PLAYING';
      case GAME_STATES.GAME_OVER:
        return 'GAME OVER';
      default:
        return 'READY';
    }
  };

  const renderTelemetryDashboard = () => {
    if (!isAIMode || !aiTelemetry) return null;

    return (
      <div className="mt-4 bg-gray-800 text-green-400 p-3 rounded border font-mono text-xs">
        <div className="text-center text-green-300 font-bold mb-2 flex items-center justify-center gap-1">
          <Brain size={12} />
          NEURAL TELEMETRY
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1">
            <Zap size={10} />
            <span>Nodes: {aiTelemetry.nodesEvaluated}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <Activity size={10} />
            <span>Area: {aiTelemetry.availableArea}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <Target size={10} />
            <span>Path: {aiTelemetry.pathFound ? 'FOUND' : 'NONE'}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <Brain size={10} />
            <span>Mode: {aiTelemetry.currentAlgorithm}</span>
          </div>
        </div>
        
        <div className="mt-2 text-center text-green-500 text-xs">
          {aiTelemetry.decisionReason}
        </div>
        
        <div className="mt-1 text-center text-green-600 text-xs">
          Exec: {aiTelemetry.lastExecutionTime?.toFixed(2)}ms
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-300 to-gray-400 flex flex-col items-center justify-center p-4">
      {/* Nokia 3310 Shell */}
      <div className="bg-gray-500 p-8 rounded-3xl shadow-2xl border-4 border-gray-600 relative" 
           style={{ 
             fontFamily: 'monospace',
             background: 'linear-gradient(145deg, #9ca3af, #6b7280)',
             boxShadow: '20px 20px 40px #4b5563, -20px -20px 40px #d1d5db'
           }}>
        
        {/* Nokia Brand */}
        <div className="text-center mb-4">
          <div className="text-gray-800 font-bold text-lg tracking-wider">NOKIA</div>
          <div className="text-gray-700 text-xs">3310 Neural Edition</div>
        </div>

        {/* LCD Screen Container */}
        <div className="bg-green-200 p-4 rounded-lg border-4 border-gray-700 relative overflow-hidden"
             style={{
               background: 'linear-gradient(145deg, #bbf7d0, #86efac)',
               boxShadow: 'inset 8px 8px 16px #4ade80, inset -8px -8px 16px #dcfce7'
             }}>
          
          {/* Scanline Effect */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="h-full w-full opacity-10 bg-gradient-to-b from-transparent via-green-900 to-transparent animate-pulse"></div>
          </div>

          {/* LCD Header */}
          <div className="bg-green-100 p-3 rounded border-2 border-green-800 mb-3 relative">
            <div className="text-center mb-2">
              <h1 className="text-lg font-bold text-green-900 tracking-wider">NEURAL SNAKE</h1>
              <div className="text-xs text-green-800">Retro Revival Challenge</div>
            </div>
            
            {/* Status bar */}
            <div className="flex justify-between items-center text-sm font-mono text-green-900">
              <div>SCORE: {score.toString().padStart(4, '0')}</div>
              <div className="flex items-center gap-1">
                {isAIMode && <Brain size={12} className="text-green-800" />}
                <span className="font-bold">{getGameStateText()}</span>
              </div>
              <div>HIGH: {highScore.toString().padStart(4, '0')}</div>
            </div>
          </div>

          {/* Game Grid */}
          <div className="bg-green-200 p-3 rounded border-2 border-green-800 mb-3 relative">
            <div 
              className="grid gap-0 mx-auto bg-green-300 border-2 border-green-900 relative"
              style={{ 
                gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
                width: 'fit-content'
              }}
            >
              {renderGrid()}
            </div>
            
            {/* AI Prediction Overlay */}
            {isAIMode && aiTelemetry?.predictionPath?.length > 0 && (
              <div className="absolute top-2 right-2 text-xs text-green-800 bg-green-100 px-2 py-1 rounded">
                AI PATH: {aiTelemetry.predictionPath.length - 1} steps
              </div>
            )}
          </div>
        </div>

        {/* Nokia Keypad */}
        <div className="mt-6 space-y-3">
          {/* Navigation Keys */}
          <div className="flex justify-center gap-2">
            {(gameState === GAME_STATES.PAUSED || gameState === GAME_STATES.GAME_OVER || gameState === GAME_STATES.IDLE) && (
              <button
                onClick={startGame}
                className="flex items-center gap-1 px-4 py-2 bg-gray-700 text-white rounded-lg border-2 border-gray-900 hover:bg-gray-600 font-mono text-sm shadow-lg"
                style={{
                  background: 'linear-gradient(145deg, #374151, #1f2937)',
                  boxShadow: '4px 4px 8px #111827, -4px -4px 8px #4b5563'
                }}
              >
                <Play size={16} />
                START
              </button>
            )}
            
            {(gameState === GAME_STATES.PLAYING || gameState === GAME_STATES.AI_MODE) && (
              <button
                onClick={pauseGame}
                className="flex items-center gap-1 px-4 py-2 bg-gray-700 text-white rounded-lg border-2 border-gray-900 hover:bg-gray-600 font-mono text-sm shadow-lg"
                style={{
                  background: 'linear-gradient(145deg, #374151, #1f2937)',
                  boxShadow: '4px 4px 8px #111827, -4px -4px 8px #4b5563'
                }}
              >
                <Pause size={16} />
                PAUSE
              </button>
            )}
            
            <button
              onClick={resetGame}
              className="flex items-center gap-1 px-4 py-2 bg-gray-700 text-white rounded-lg border-2 border-gray-900 hover:bg-gray-600 font-mono text-sm shadow-lg"
              style={{
                background: 'linear-gradient(145deg, #374151, #1f2937)',
                boxShadow: '4px 4px 8px #111827, -4px -4px 8px #4b5563'
              }}
            >
              <RotateCcw size={16} />
              RESET
            </button>
          </div>

          {/* AI Toggle - Special Button */}
          <div className="flex justify-center">
            <button
              onClick={toggleAI}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg border-2 font-mono text-sm shadow-lg transition-all ${
                isAIMode 
                  ? 'bg-green-700 text-white border-green-900 shadow-green-900/50' 
                  : 'bg-gray-600 text-white border-gray-800'
              }`}
              style={{
                background: isAIMode 
                  ? 'linear-gradient(145deg, #15803d, #166534)' 
                  : 'linear-gradient(145deg, #4b5563, #374151)',
                boxShadow: isAIMode 
                  ? '4px 4px 12px #14532d, -4px -4px 12px #22c55e' 
                  : '4px 4px 8px #1f2937, -4px -4px 8px #6b7280'
              }}
            >
              {isAIMode ? <Brain size={16} /> : <Gamepad2 size={16} />}
              {isAIMode ? 'NEURAL MODE' : 'MANUAL MODE'}
            </button>
          </div>

          {/* Instructions */}
          <div className="text-xs text-gray-700 text-center space-y-1 font-mono">
            {!isAIMode && (
              <>
                <div>ARROWS or WASD: Move Snake</div>
                <div>SPACE: Pause/Resume Game</div>
              </>
            )}
            <div>R: Reset • AI: Toggle Neural Mode</div>
            {isAIMode && (
              <div className="text-gray-800 font-bold flex items-center justify-center gap-1">
                <Brain size={12} />
                Multi-tier AI pathfinding active
              </div>
            )}
          </div>
        </div>

        {/* Game Over Overlay */}
        {gameState === GAME_STATES.GAME_OVER && (
          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center rounded-3xl">
            <div className="bg-green-100 p-6 rounded-lg border-4 border-green-800 text-center font-mono shadow-2xl">
              <div className="text-2xl font-bold mb-2 text-green-900">GAME OVER</div>
              <div className="text-lg mb-4 text-green-800">Final Score: {score}</div>
              {score === highScore && score > 0 && (
                <div className="text-sm text-green-700 mb-4 animate-pulse">🏆 NEW HIGH SCORE!</div>
              )}
              <button
                onClick={resetGame}
                className="px-6 py-2 bg-green-700 text-white rounded-lg border-2 border-green-900 hover:bg-green-600 font-bold"
              >
                PLAY AGAIN
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Telemetry Dashboard */}
      {renderTelemetryDashboard()}
      
      {/* Technical Info */}
      <div className="mt-4 text-center text-gray-600 text-xs font-mono">
        <div>NeuralSnake 3310 • Multi-Tier AI Engine</div>
        <div>BFS Pathfinding • Flood Fill Analysis • Tail Chasing Strategy</div>
      </div>
    </div>
  );
};

export default NeuralSnake;