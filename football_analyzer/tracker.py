import numpy as np

class Tracker:
    """
    Simulates tracking results. 
    In production, this would interface with YOLO detections and an object tracker.
    """
    def get_player_positions(self, frame):
        h, w, _ = frame.shape
        # Simulating 5 players for Team A and 5 for Team B
        # Coordinates are selected to roughly fit within the expected pitch area in broadcast view
        team1 = [[np.random.randint(400, w-400), np.random.randint(500, h-150)] for _ in range(5)]
        team2 = [[np.random.randint(400, w-400), np.random.randint(500, h-150)] for _ in range(5)]
        
        return team1, team2