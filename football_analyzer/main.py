import cv2
import numpy as np
from tracker import Tracker
from view_transformer import ViewTransformer
from utils import get_pitch_template, overlay_on_frame

def main():
    # Initialize components
    cap = cv2.VideoCapture(0)  # Use webcam or provide path to video file
    tracker = Tracker()
    transformer = ViewTransformer()
    
    print("Football Tactical Minimap Overlay Active. Press 'q' to quit.")

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
            
        # 1. Get player positions from tracker (simulated)
        team1, team2 = tracker.get_player_positions(frame)
        
        # 2. Transform player coordinates to top-down 2D coordinates
        team1_transformed = transformer.transform_points(team1)
        team2_transformed = transformer.transform_points(team2)
        
        # 3. Create the 2D pitch minimap
        minimap = get_pitch_template()
        
        # 4. Draw players on the minimap
        # Team 1: Red dots with white outline
        for pt in team1_transformed:
            cv2.circle(minimap, (int(pt[0]), int(pt[1])), 6, (0, 0, 255), -1)
            cv2.circle(minimap, (int(pt[0]), int(pt[1])), 7, (255, 255, 255), 1)
            
        # Team 2: Blue dots with white outline
        for pt in team2_transformed:
            cv2.circle(minimap, (int(pt[0]), int(pt[1])), 6, (255, 0, 0), -1)
            cv2.circle(minimap, (int(pt[0]), int(pt[1])), 7, (255, 255, 255), 1)
            
        # 5. Overlay the minimap on the broadcast frame
        frame = overlay_on_frame(frame, minimap)
        
        cv2.imshow('Football Tactical Radar', frame)
        
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
            
    cap.release()
    cv2.destroyAllWindows()

if __name__ == '__main__':
    main()
