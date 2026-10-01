const MAX_DIMENSION = 4000;
const MIN_QUALITY = 0.1;
const MIN_SCALE = 0.5;
const MAX_ITERATIONS = 6;

self.onmessage = async function(e) {
    const { id, imageBitmap, originalSize, targetSizeBytes, mimeType } = e.data;
    
    try {
        let baseWidth = imageBitmap.width;
        let baseHeight = imageBitmap.height;
        let scaled = false;
        
        // Prevent memory crashes for extremely large images
        if (baseWidth > MAX_DIMENSION || baseHeight > MAX_DIMENSION) {
            const ratio = Math.min(MAX_DIMENSION / baseWidth, MAX_DIMENSION / baseHeight);
            baseWidth = Math.round(baseWidth * ratio);
            baseHeight = Math.round(baseHeight * ratio);
            scaled = true;
        }

        // If original file is already smaller than target size
        if (originalSize <= targetSizeBytes) {
            const blob = await generateCanvasBlob(imageBitmap, baseWidth, baseHeight, 0.95, mimeType);
            if (blob) {
                self.postMessage({ id, blob, width: baseWidth, height: baseHeight, scaled, hitUnsafeLimit: false });
                return;
            }
        }

        // --- Step 1: Binary search on Quality ---
        let lowQ = MIN_QUALITY;
        let highQ = 1.0;
        let bestBlob = null;
        let hitTarget = false;
        let bestScale = 1.0;

        for (let i = 0; i < MAX_ITERATIONS; i++) {
            const midQ = (lowQ + highQ) / 2;
            const blob = await generateCanvasBlob(imageBitmap, baseWidth, baseHeight, midQ, mimeType);
            
            if (!blob) break;
            
            if (blob.size <= targetSizeBytes) {
                bestBlob = blob;
                lowQ = midQ; 
                hitTarget = true;
                
                if (blob.size >= targetSizeBytes * 0.90) {
                    break; 
                }
            } else {
                highQ = midQ;
            }
        }

        if (hitTarget && bestBlob) {
            self.postMessage({ id, blob: bestBlob, width: baseWidth, height: baseHeight, scaled, hitUnsafeLimit: false });
            return;
        }

        // --- Step 2: Scale down dimensions ---
        const fallbackBlob = await generateCanvasBlob(imageBitmap, baseWidth, baseHeight, MIN_QUALITY, mimeType);
        if (fallbackBlob && fallbackBlob.size <= targetSizeBytes) {
            self.postMessage({ id, blob: fallbackBlob, width: baseWidth, height: baseHeight, scaled, hitUnsafeLimit: false });
            return;
        }
        
        let currentScale = 0.9;
        bestBlob = fallbackBlob;

        while (currentScale >= MIN_SCALE) {
            const w = Math.round(baseWidth * currentScale);
            const h = Math.round(baseHeight * currentScale);
            
            const blob = await generateCanvasBlob(imageBitmap, w, h, MIN_QUALITY, mimeType);
            if (blob) {
                bestBlob = blob;
                bestScale = currentScale;
                
                if (blob.size <= targetSizeBytes) {
                    hitTarget = true;
                    break;
                }
            }
            currentScale -= 0.1;
        }

        const hitUnsafeLimit = !hitTarget;
        const finalWidth = Math.round(baseWidth * bestScale);
        const finalHeight = Math.round(baseHeight * bestScale);
        
        self.postMessage({ id, blob: bestBlob, width: finalWidth, height: finalHeight, scaled: scaled || (bestScale < 1.0), hitUnsafeLimit });

    } catch (err) {
        self.postMessage({ id, error: err.message });
    }
};

async function generateCanvasBlob(imageBitmap, width, height, quality, mimeType) {
    const canvas = new OffscreenCanvas(width, height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(imageBitmap, 0, 0, width, height);
    
    return await canvas.convertToBlob({ type: mimeType, quality: quality });
}