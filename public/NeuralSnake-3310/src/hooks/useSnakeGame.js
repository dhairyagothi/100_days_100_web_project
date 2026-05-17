import { useReducer, useEffect, useCallback, useRef } from 'react';
import { NeuralPathfinder } from '../utils/pathfinder.js';

// Game constants
const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_FOOD = { x: 15, y: 15 };
const GAME_SPEED = 150; // milliseconds
const AI_SPEED = 100; // Faster for AI mode

// Game states - Production-grade state machine
const GAME_STATES = {
  IDLE: 'IDLE',
  PLAYING: 'PLAYING',
  PAUSED: 'PAUSED',
  AI_MODE: 'AI_MODE',
  GAME_OVER: 'GAME_OVER'
};

// Action types
const ACTIONS = {
  MOVE_SNAKE: 'MOVE_SNAKE',
  CHANGE_DIRECTION: 'CHANGE_DIRECTION',
  EAT_FOOD: 'EAT_FOOD',
  GAME_OVER: 'GAME_OVER',
  PAUSE_GAME: 'PAUSE_GAME',
  RESUME_GAME: 'RESUME_GAME',
  TOGGLE_AI: 'TOGGLE_AI',
  RESET_GAME: 'RESET_GAME',
  GENERATE_FOOD: 'GENERATE_FOOD',
  UPDATE_AI_TELEMETRY: 'UPDATE_AI_TELEMETRY'
};

// Initial state
const initialState = {
  snake: INITIAL_SNAKE,
  food: INITIAL_FOOD,
  direction: 'RIGHT',
  gameState: GAME_STATES.IDLE,
  score: 0,
  highScore: parseInt(localStorage.getItem('neuralSnakeHighScore') || '0'),
  isAIMode: false,
  aiTelemetry: null
};

// Game reducer
function gameReducer(state, action) {
  switch (action.type) {
    case ACTIONS.MOVE_SNAKE:
      return {
        ...state,
        snake: action.payload.newSnake,
        direction: action.payload.direction
      };

    case ACTIONS.CHANGE_DIRECTION:
      // Prevent reverse direction
      const opposites = {
        UP: 'DOWN',
        DOWN: 'UP',
        LEFT: 'RIGHT',
        RIGHT: 'LEFT'
      };
      
      if (opposites[action.payload] === state.direction) {
        return state;
      }
      
      return {
        ...state,
        direction: action.payload
      };

    case ACTIONS.EAT_FOOD:
      const newScore = state.score + 10;
      const newHighScore = Math.max(newScore, state.highScore);
      
      // Save high score
      localStorage.setItem('neuralSnakeHighScore', newHighScore.toString());
      
      return {
        ...state,
        score: newScore,
        highScore: newHighScore,
        food: action.payload.newFood
      };

    case ACTIONS.GAME_OVER:
      return {
        ...state,
        gameState: GAME_STATES.GAME_OVER
      };

    case ACTIONS.PAUSE_GAME:
      return {
        ...state,
        gameState: state.gameState === GAME_STATES.AI_MODE ? GAME_STATES.AI_MODE : GAME_STATES.PAUSED
      };

    case ACTIONS.RESUME_GAME:
      return {
        ...state,
        gameState: state.isAIMode ? GAME_STATES.AI_MODE : GAME_STATES.PLAYING
      };

    case ACTIONS.TOGGLE_AI:
      return {
        ...state,
        isAIMode: !state.isAIMode,
        gameState: !state.isAIMode ? GAME_STATES.AI_MODE : GAME_STATES.PLAYING
      };

    case ACTIONS.RESET_GAME:
      return {
        ...initialState,
        highScore: state.highScore
      };

    case ACTIONS.GENERATE_FOOD:
      return {
        ...state,
        food: action.payload
      };

    case ACTIONS.UPDATE_AI_TELEMETRY:
      return {
        ...state,
        aiTelemetry: action.payload
      };

    default:
      return state;
  }
}

export function useSnakeGame() {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const gameLoopRef = useRef(null);
  const pathfinderRef = useRef(new NeuralPathfinder(GRID_SIZE));

  // Generate random food position
  const generateFood = useCallback((snakeBody) => {
    let newFood;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
    } while (snakeBody.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    
    return newFood;
  }, []);

  // Check collisions
  const checkCollisions = useCallback((head, snakeBody) => {
    // Wall collision
    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
      return true;
    }
    
    // Self collision
    return snakeBody.some(segment => segment.x === head.x && segment.y === head.y);
  }, []);

  // Move snake
  const moveSnake = useCallback(() => {
    if (state.gameState !== GAME_STATES.PLAYING && state.gameState !== GAME_STATES.AI_MODE) {
      return;
    }

    let currentDirection = state.direction;

    // AI decision making with telemetry
    if (state.gameState === GAME_STATES.AI_MODE) {
      const aiDirection = pathfinderRef.current.findOptimalMove(
        state.snake,
        state.food,
        state.direction
      );
      
      // Update telemetry
      const telemetry = pathfinderRef.current.getTelemetry();
      dispatch({ type: ACTIONS.UPDATE_AI_TELEMETRY, payload: telemetry });
      
      if (aiDirection) {
        currentDirection = aiDirection;
        dispatch({ type: ACTIONS.CHANGE_DIRECTION, payload: aiDirection });
      }
    }

    // Calculate new head position
    const head = state.snake[0];
    const directionMap = {
      UP: { x: 0, y: -1 },
      DOWN: { x: 0, y: 1 },
      LEFT: { x: -1, y: 0 },
      RIGHT: { x: 1, y: 0 }
    };

    const movement = directionMap[currentDirection];
    const newHead = {
      x: head.x + movement.x,
      y: head.y + movement.y
    };

    // Check collisions
    if (checkCollisions(newHead, state.snake)) {
      dispatch({ type: ACTIONS.GAME_OVER });
      return;
    }

    // Create new snake
    const newSnake = [newHead, ...state.snake];

    // Check food collision
    if (newHead.x === state.food.x && newHead.y === state.food.y) {
      const newFood = generateFood(newSnake);
      dispatch({ type: ACTIONS.EAT_FOOD, payload: { newFood } });
    } else {
      // Remove tail if no food eaten
      newSnake.pop();
    }

    dispatch({ 
      type: ACTIONS.MOVE_SNAKE, 
      payload: { newSnake, direction: currentDirection } 
    });
  }, [state.snake, state.food, state.direction, state.gameState, checkCollisions, generateFood]);

  // Game loop
  useEffect(() => {
    if (state.gameState === GAME_STATES.PLAYING || state.gameState === GAME_STATES.AI_MODE) {
      const speed = state.gameState === GAME_STATES.AI_MODE ? AI_SPEED : GAME_SPEED;
      gameLoopRef.current = setInterval(moveSnake, speed);
    } else {
      clearInterval(gameLoopRef.current);
    }

    return () => clearInterval(gameLoopRef.current);
  }, [moveSnake, state.gameState]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (state.gameState === GAME_STATES.AI_MODE) return; // No manual control in AI mode

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault();
          dispatch({ type: ACTIONS.CHANGE_DIRECTION, payload: 'UP' });
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          dispatch({ type: ACTIONS.CHANGE_DIRECTION, payload: 'DOWN' });
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          dispatch({ type: ACTIONS.CHANGE_DIRECTION, payload: 'LEFT' });
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          dispatch({ type: ACTIONS.CHANGE_DIRECTION, payload: 'RIGHT' });
          break;
        case ' ':
          e.preventDefault();
          if (state.gameState === GAME_STATES.PLAYING) {
            dispatch({ type: ACTIONS.PAUSE_GAME });
          } else if (state.gameState === GAME_STATES.PAUSED || state.gameState === GAME_STATES.IDLE) {
            dispatch({ type: ACTIONS.RESUME_GAME });
          }
          break;
        case 'r':
        case 'R':
          e.preventDefault();
          dispatch({ type: ACTIONS.RESET_GAME });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [state.gameState]);

  // Game control functions
  const startGame = useCallback(() => {
    dispatch({ type: ACTIONS.RESUME_GAME });
  }, []);

  const pauseGame = useCallback(() => {
    dispatch({ type: ACTIONS.PAUSE_GAME });
  }, []);

  const resetGame = useCallback(() => {
    dispatch({ type: ACTIONS.RESET_GAME });
  }, []);

  const toggleAI = useCallback(() => {
    dispatch({ type: ACTIONS.TOGGLE_AI });
  }, []);

  return {
    // Game state
    snake: state.snake,
    food: state.food,
    score: state.score,
    highScore: state.highScore,
    gameState: state.gameState,
    isAIMode: state.isAIMode,
    aiTelemetry: state.aiTelemetry,
    
    // Game controls
    startGame,
    pauseGame,
    resetGame,
    toggleAI,
    
    // Constants
    GRID_SIZE,
    GAME_STATES
  };
}