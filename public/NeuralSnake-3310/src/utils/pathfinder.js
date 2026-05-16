/**
 * NeuralSnake 3310 - Multi-Tier AI Decision Engine
 * 
 * ARCHITECTURE OVERVIEW:
 * =====================
 * This pathfinder implements a three-tier decision system that mimics
 * advanced AI reasoning patterns used in production game engines.
 * 
 * TIER 1: Greedy Search (BFS to food)
 * TIER 2: Survival Reasoning (Flood fill area analysis)
 * TIER 3: Tail Chasing (Strategic stalling when trapped)
 * 
 * The AI maintains telemetry data for real-time visualization
 * of its decision-making process, making it perfect for technical
 * demonstrations and educational content.
 */

class PathNode {
  constructor(x, y, parent = null, gCost = 0, hCost = 0) {
    this.x = x;
    this.y = y;
    this.parent = parent;
    this.gCost = gCost; // Distance from start
    this.hCost = hCost; // Heuristic distance to target
    this.fCost = gCost + hCost; // Total cost for A*
  }

  equals(other) {
    return this.x === other.x && this.y === other.y;
  }

  toString() {
    return `${this.x},${this.y}`;
  }
}

/**
 * NEURAL PATHFINDER CLASS
 * =======================
 * Production-grade AI pathfinding engine with comprehensive telemetry
 * and multi-algorithm decision making for optimal snake survival.
 */
export class NeuralPathfinder {
  constructor(gridSize) {
    this.gridSize = gridSize;
    this.directions = [
      { x: 0, y: -1, name: 'UP' },
      { x: 1, y: 0, name: 'RIGHT' },
      { x: 0, y: 1, name: 'DOWN' },
      { x: -1, y: 0, name: 'LEFT' }
    ];
    
    // TELEMETRY SYSTEM - Real-time AI analytics
    this.telemetry = {
      nodesEvaluated: 0,
      currentAlgorithm: 'IDLE',
      pathFound: false,
      availableArea: 0,
      predictionPath: [],
      decisionReason: '',
      lastExecutionTime: 0
    };
  }

  /**
   * MAIN AI DECISION ENGINE
   * ======================
   * Multi-tier decision system that evaluates moves using:
   * 1. Greedy pathfinding to food (BFS)
   * 2. Survival area analysis (Flood Fill)
   * 3. Tail chasing strategy when trapped
   * 
   * @param {Array} snakeBody - Current snake segments [{x, y}, ...]
   * @param {Object} foodPosition - Food location {x, y}
   * @param {string} currentDirection - Current movement direction
   * @returns {string} Optimal direction ('UP', 'DOWN', 'LEFT', 'RIGHT')
   */
  findOptimalMove(snakeBody, foodPosition, currentDirection) {
    const startTime = performance.now();
    this.resetTelemetry();
    
    const head = snakeBody[0];
    
    // TIER 1: GREEDY SEARCH - Direct path to food
    this.telemetry.currentAlgorithm = 'SEEKING';
    const pathToFood = this.findPathBFS(head, foodPosition, snakeBody);
    
    if (pathToFood && pathToFood.length > 1) {
      const nextMove = pathToFood[1];
      this.telemetry.predictionPath = pathToFood;
      
      // TIER 2: SURVIVAL REASONING - Validate move safety
      if (this.validateMoveSafety(nextMove, snakeBody, foodPosition)) {
        this.telemetry.pathFound = true;
        this.telemetry.decisionReason = 'Safe path to food found';
        this.telemetry.lastExecutionTime = performance.now() - startTime;
        return this.getDirectionFromMove(head, nextMove);
      }
    }

    // TIER 3: TAIL CHASING - Strategic survival mode
    this.telemetry.currentAlgorithm = 'SURVIVING';
    this.telemetry.decisionReason = 'No safe path to food - entering survival mode';
    
    const survivalMove = this.findSurvivalMove(head, snakeBody, currentDirection);
    this.telemetry.lastExecutionTime = performance.now() - startTime;
    
    return survivalMove;
  }

  /**
   * BREADTH-FIRST SEARCH PATHFINDING
   * ================================
   * Implements BFS algorithm to find shortest path to food.
   * Optimized for grid-based movement with obstacle avoidance.
   * 
   * Time Complexity: O(V + E) where V = grid cells, E = connections
   * Space Complexity: O(V) for visited set and queue
   */
  findPathBFS(start, target, obstacles) {
    const queue = [new PathNode(start.x, start.y)];
    const visited = new Set();
    visited.add(`${start.x},${start.y}`);
    this.telemetry.nodesEvaluated = 0;

    while (queue.length > 0) {
      const current = queue.shift();
      this.telemetry.nodesEvaluated++;

      // Target found - reconstruct path
      if (current.x === target.x && current.y === target.y) {
        return this.reconstructPath(current);
      }

      // Explore all valid neighbors
      for (const dir of this.directions) {
        const newX = current.x + dir.x;
        const newY = current.y + dir.y;
        const key = `${newX},${newY}`;

        if (this.isValidPosition(newX, newY) && 
            !visited.has(key) && 
            !this.isObstacle(newX, newY, obstacles)) {
          
          visited.add(key);
          queue.push(new PathNode(newX, newY, current, current.gCost + 1));
        }
      }
    }

    return null; // No path exists
  }

  /**
   * SURVIVAL AREA VALIDATION
   * =======================
   * Uses flood fill algorithm to calculate available movement area
   * after a potential move. Prevents the snake from trapping itself
   * in spaces smaller than its current length.
   * 
   * CRITICAL SAFETY CHECK: Ensures long-term survival over short-term gains
   */
  validateMoveSafety(nextPos, snakeBody, foodPosition) {
    // Simulate the move by creating new snake state
    const newSnakeBody = [nextPos, ...snakeBody];
    
    // If eating food, snake grows (don't remove tail)
    const isEatingFood = (nextPos.x === foodPosition.x && nextPos.y === foodPosition.y);
    if (!isEatingFood) {
      newSnakeBody.pop();
    }

    // Calculate available area using flood fill
    const availableArea = this.calculateAvailableArea(nextPos, newSnakeBody);
    this.telemetry.availableArea = availableArea;
    
    // SURVIVAL THRESHOLD: Available area must exceed snake length
    // This ensures the snake has room to maneuver and won't get trapped
    const minRequiredArea = newSnakeBody.length + 2; // +2 for safety buffer
    
    return availableArea >= minRequiredArea;
  }

  /**
   * FLOOD FILL AREA CALCULATION
   * ===========================
   * Implements flood fill algorithm to count reachable empty spaces
   * from a given position. Used for survival area analysis.
   * 
   * This is the core of our "Survival Reasoning" - the AI must always
   * ensure it has enough space to continue moving.
   */
  calculateAvailableArea(start, obstacles) {
    const visited = new Set();
    const queue = [start];
    let areaCount = 0;

    while (queue.length > 0) {
      const current = queue.shift();
      const key = `${current.x},${current.y}`;

      if (visited.has(key)) continue;
      visited.add(key);
      areaCount++;
      this.telemetry.nodesEvaluated++;

      // Explore all adjacent cells
      for (const dir of this.directions) {
        const newX = current.x + dir.x;
        const newY = current.y + dir.y;
        const newKey = `${newX},${newY}`;

        if (this.isValidPosition(newX, newY) && 
            !visited.has(newKey) && 
            !this.isObstacle(newX, newY, obstacles)) {
          queue.push({ x: newX, y: newY });
        }
      }
    }

    return areaCount;
  }

  /**
   * TAIL CHASING SURVIVAL STRATEGY
   * =============================
   * When no safe path to food exists, the AI employs "tail chasing" -
   * moving toward its own tail (the only guaranteed moving obstacle).
   * This creates a strategic stalling pattern until new paths open.
   * 
   * STRATEGY: The tail is the only part of the snake that's guaranteed
   * to move, making it the safest "target" when trapped.
   */
  findSurvivalMove(head, snakeBody, currentDirection) {
    const tail = snakeBody[snakeBody.length - 1];
    let bestMove = null;
    let bestScore = -1;

    for (const dir of this.directions) {
      const newPos = {
        x: head.x + dir.x,
        y: head.y + dir.y
      };

      // Skip invalid moves
      if (!this.isValidPosition(newPos.x, newPos.y) || 
          this.isObstacle(newPos.x, newPos.y, snakeBody)) {
        continue;
      }

      // Calculate move score based on multiple factors
      let moveScore = 0;
      
      // Factor 1: Distance to tail (closer is better for tail chasing)
      const distanceToTail = Math.abs(newPos.x - tail.x) + Math.abs(newPos.y - tail.y);
      moveScore += (this.gridSize * 2 - distanceToTail) * 10;
      
      // Factor 2: Available area from this position
      const availableArea = this.calculateAvailableArea(newPos, snakeBody);
      moveScore += availableArea * 5;
      
      // Factor 3: Momentum bonus (prefer continuing current direction)
      if (dir.name === currentDirection) {
        moveScore += 20;
      }
      
      // Factor 4: Center preference (avoid edges when possible)
      const centerDistance = Math.abs(newPos.x - this.gridSize/2) + Math.abs(newPos.y - this.gridSize/2);
      moveScore += (this.gridSize - centerDistance) * 2;

      if (moveScore > bestScore) {
        bestScore = moveScore;
        bestMove = dir.name;
        this.telemetry.availableArea = availableArea;
      }
    }

    this.telemetry.decisionReason = bestMove ? 
      `Tail chasing: Moving toward tail at (${tail.x},${tail.y})` : 
      'Emergency move - no optimal path found';
      
    return bestMove || this.getEmergencyMove(head, snakeBody);
  }

  /**
   * EMERGENCY FALLBACK SYSTEM
   * =========================
   * Last resort move selection when all other strategies fail.
   * Simply finds any valid direction to prevent immediate collision.
   */
  getEmergencyMove(head, snakeBody) {
    this.telemetry.decisionReason = 'EMERGENCY: Taking any available move';
    
    for (const dir of this.directions) {
      const newPos = {
        x: head.x + dir.x,
        y: head.y + dir.y
      };

      if (this.isValidPosition(newPos.x, newPos.y) && 
          !this.isObstacle(newPos.x, newPos.y, snakeBody)) {
        return dir.name;
      }
    }
    return 'UP'; // Ultimate fallback
  }

  /**
   * TELEMETRY MANAGEMENT
   * ===================
   * Resets telemetry data for each AI decision cycle
   */
  resetTelemetry() {
    this.telemetry.nodesEvaluated = 0;
    this.telemetry.pathFound = false;
    this.telemetry.predictionPath = [];
    this.telemetry.availableArea = 0;
    this.telemetry.decisionReason = '';
  }

  /**
   * PUBLIC TELEMETRY ACCESS
   * ======================
   * Provides read-only access to AI decision telemetry
   */
  getTelemetry() {
    return { ...this.telemetry };
  }

  /**
   * UTILITY FUNCTIONS
   * ================
   * Core helper functions for pathfinding operations
   */
  reconstructPath(node) {
    const path = [];
    let current = node;
    
    while (current) {
      path.unshift({ x: current.x, y: current.y });
      current = current.parent;
    }
    
    return path;
  }

  isValidPosition(x, y) {
    return x >= 0 && x < this.gridSize && y >= 0 && y < this.gridSize;
  }

  isObstacle(x, y, snakeBody) {
    return snakeBody.some(segment => segment.x === x && segment.y === y);
  }

  getDirectionFromMove(from, to) {
    const dx = to.x - from.x;
    const dy = to.y - from.y;

    if (dx === 1) return 'RIGHT';
    if (dx === -1) return 'LEFT';
    if (dy === 1) return 'DOWN';
    if (dy === -1) return 'UP';
    
    return 'UP'; // Fallback
  }
}