import cv2
import numpy as np

def get_pitch_template(width=320, height=200):
    """Draws a professional looking football pitch minimap."""
    pitch = np.zeros((height, width, 3), dtype=np.uint8)
    pitch[:] = (40, 120, 40) # Dark green grass background
    
    white = (255, 255, 255)
    
    # Boundary lines
    cv2.rectangle(pitch, (10, 10), (width-10, height-10), white, 1)
    
    # Center line and circle
    cv2.line(pitch, (width // 2, 10), (width // 2, height - 10), white, 1)
    cv2.circle(pitch, (width // 2, height // 2), 35, white, 1)
    cv2.circle(pitch, (width // 2, height // 2), 2, white, -1) # Center spot
    
    # Penalty areas
    cv2.rectangle(pitch, (10, 45), (65, 155), white, 1) # Left
    cv2.rectangle(pitch, (width-65, 45), (width-10, 155), white, 1) # Right
    
    # Goal areas
    cv2.rectangle(pitch, (10, 75), (30, 125), white, 1)
    cv2.rectangle(pitch, (width-30, 75), (width-10, 125), white, 1)
    
    return pitch

def overlay_on_frame(frame, overlay, x_offset=20, y_offset=20):
    """Overlays the minimap onto the video frame with a border."""
    h, w = overlay.shape[:2]
    
    # Check if placement is within frame boundaries
    if y_offset + h <= frame.shape[0] and x_offset + w <= frame.shape[1]:
        cv2.rectangle(overlay, (0, 0), (w-1, h-1), (180, 180, 180), 2)
        frame[y_offset:y_offset+h, x_offset:x_offset+w] = overlay
        
    return frame