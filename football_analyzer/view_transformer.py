import cv2
import numpy as np

class ViewTransformer:
    def __init__(self):
        # Example source points for homography (broadcast camera view coordinates)
        # These would typically be corners or marking points on a pitch.
        src_points = np.array([
            [590, 440], 
            [1210, 440], 
            [1820, 1000], 
            [100, 1000]
        ], dtype=np.float32)
        
        # Corresponding destination points in the top-down 2D field view (320x200 minimap)
        dest_points = np.array([
            [0, 0], 
            [320, 0], 
            [320, 200], 
            [0, 200]
        ], dtype=np.float32)
        
        self.matrix = cv2.getPerspectiveTransform(src_points, dest_points)

    def transform_points(self, points):
        if len(points) == 0:
            return np.array([])
        
        # Reshape for cv2.perspectiveTransform: (N, 1, 2)
        points_array = np.array(points, dtype=np.float32).reshape(-1, 1, 2)
        transformed = cv2.perspectiveTransform(points_array, self.matrix)
        return transformed.reshape(-1, 2)

    @staticmethod
    def map_camera_to_pitch(points, frame_size, pitch_size, pad=10):
        """Linearly map camera pixel coordinates to pitch coordinates.

        Useful as a fallback when a homography matrix isn't provided.
        - points: array-like Nx2 (x,y) in camera pixel coords
        - frame_size: (height, width) of camera frame
        - pitch_size: (height, width) of minimap image
        - pad: inner padding on pitch (px)
        Returns: Nx2 float array of mapped points inside pitch image
        """
        points = np.array(points, dtype=np.float32)
        if points.size == 0:
            return points.reshape(-1, 2)
        fh, fw = frame_size
        ph, pw = pitch_size
        # usable drawing area
        aw = max(pw - 2 * pad, 1)
        ah = max(ph - 2 * pad, 1)
        xs = points[:, 0]
        ys = points[:, 1]
        # normalize
        nx = np.clip(xs.astype(np.float32) / max(1.0, fw), 0.0, 1.0)
        ny = np.clip(ys.astype(np.float32) / max(1.0, fh), 0.0, 1.0)
        # map into pitch area (flip y so origin is top-left same as image)
        mx = (nx * aw) + pad
        my = (ny * ah) + pad
        mapped = np.vstack([mx, my]).T
        return mapped