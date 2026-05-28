/**
 * Core Iterative Target-Size Compression Logic using HTML5 Canvas
 */
const MAX_DIMENSION = 4000;
const MIN_QUALITY = 0.1;
const MIN_SCALE = 0.5;
const MAX_ITERATIONS = 6; // Reduced iterations for much faster performance

export async function compressImage(file, targetSizeBytes) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = () => reject(new Error('Failed to read file'));
        
        reader.onload = (e) => {
            const img = new Image();
            img.onerror = () => reject(new Error('Failed to load image'));
            
            img.onload = async () => {
                let baseWidth = img.width;
                let baseHeight = img.height;
                let scaled = false;
                
                // Prevent memory crashes for extremely large images
                if (baseWidth > MAX_DIMENSION || baseHeight > MAX_DIMENSION) {
                    const ratio = Math.min(MAX_DIMENSION / baseWidth, MAX_DIMENSION / baseHeight);
                    baseWidth = Math.round(baseWidth * ratio);
                    baseHeight = Math.round(baseHeight * ratio);
                    scaled = true;
                }

                // If the original file size is already smaller than or equal to the target size, 
                // just return the original image at max quality (or near max)
                if (file.size <= targetSizeBytes) {
                    const blob = await generateCanvasBlob(img, baseWidth, baseHeight, 0.95, file.type);
                    if (blob) {
                        return resolve(finalize(file, e.target.result, blob, baseWidth, baseHeight, scaled, false));
                    }
                }

                // --- Step 1: Binary search on Quality (keeping dimensions fixed) ---
                let lowQ = MIN_QUALITY;
                let highQ = 1.0;
                let bestBlob = null;
                let bestQuality = 1.0;
                let bestScale = 1.0;
                let hitTarget = false;

                for (let i = 0; i < MAX_ITERATIONS; i++) {
                    const midQ = (lowQ + highQ) / 2;
                    const blob = await generateCanvasBlob(img, baseWidth, baseHeight, midQ, file.type);
                    
                    if (!blob) break;
                    
                    if (blob.size <= targetSizeBytes) {
                        // Success! This blob satisfies the constraint.
                        bestBlob = blob;
                        bestQuality = midQ;
                        lowQ = midQ; // Try higher quality to get closer to target
                        hitTarget = true;
                        
                        // Early Exit Optimization: Stop if we are within 10% of the target size
                        if (blob.size >= targetSizeBytes * 0.90) {
                            break; 
                        }
                    } else {
                        // Blob too large, need lower quality
                        highQ = midQ;
                    }
                }

                // If we found a valid blob from quality tuning alone, we're done.
                if (hitTarget && bestBlob) {
                    return resolve(finalize(file, e.target.result, bestBlob, baseWidth, baseHeight, scaled, false));
                }

                // --- Step 2: Quality tuning failed to hit target. We must reduce dimensions. ---
                // We lock quality at MIN_QUALITY and scale down dimensions progressively.
                const fallbackBlob = await generateCanvasBlob(img, baseWidth, baseHeight, MIN_QUALITY, file.type);
                if (fallbackBlob && fallbackBlob.size <= targetSizeBytes) {
                    return resolve(finalize(file, e.target.result, fallbackBlob, baseWidth, baseHeight, scaled, false));
                }
                
                let currentScale = 0.9;
                bestBlob = fallbackBlob; // At worst, return the min quality unscaled version

                while (currentScale >= MIN_SCALE) {
                    const w = Math.round(baseWidth * currentScale);
                    const h = Math.round(baseHeight * currentScale);
                    
                    const blob = await generateCanvasBlob(img, w, h, MIN_QUALITY, file.type);
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

                // If even the most compressed/shrunk blob is too big, flag it as unable to hit safely
                const hitUnsafeLimit = !hitTarget;
                
                const finalWidth = Math.round(baseWidth * bestScale);
                const finalHeight = Math.round(baseHeight * bestScale);
                
                return resolve(finalize(file, e.target.result, bestBlob, finalWidth, finalHeight, scaled || (bestScale < 1.0), hitUnsafeLimit));
            };
            
            img.src = e.target.result;
        };
        
        reader.readAsDataURL(file);
    });
}

function generateCanvasBlob(img, width, height, quality, mimeType) {
    return new Promise((resolve) => {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob((blob) => {
            resolve(blob);
        }, mimeType, quality);
    });
}

function finalize(file, originalUrl, compressedBlob, width, height, scaled, hitUnsafeLimit) {
    const origSize = file.size;
    const newSize = compressedBlob.size;
    let savingsPercent = Math.round((1 - (newSize / origSize)) * 100);
    
    return {
        originalFile: file,
        originalUrl: originalUrl,
        originalSize: origSize,
        compressedBlob: compressedBlob,
        compressedUrl: URL.createObjectURL(compressedBlob),
        compressedSize: newSize,
        savingsPercent: savingsPercent,
        width: width,
        height: height,
        scaled: scaled,
        hitUnsafeLimit: hitUnsafeLimit
    };
}
