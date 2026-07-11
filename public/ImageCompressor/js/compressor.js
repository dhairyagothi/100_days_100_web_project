/**
 * Core Logic utilizing Web Workers and createImageBitmap
 */

// Initialize persistent worker
const worker = new Worker('/public/ImageCompressor/js/worker.js');
let jobIdCounter = 0;
const pendingJobs = new Map();

worker.onmessage = function(e) {
    const { id, blob, width, height, scaled, hitUnsafeLimit, error } = e.data;
    const job = pendingJobs.get(id);
    if (!job) return;
    
    pendingJobs.delete(id);
    
    if (error) {
        job.reject(new Error(error));
    } else {
        const result = {
            originalFile: job.file,
            originalUrl: job.originalUrl,
            originalSize: job.file.size,
            compressedBlob: blob,
            compressedUrl: URL.createObjectURL(blob),
            compressedSize: blob.size,
            savingsPercent: Math.round((1 - (blob.size / job.file.size)) * 100),
            width: width,
            height: height,
            scaled: scaled,
            hitUnsafeLimit: hitUnsafeLimit
        };
        job.resolve(result);
    }
};

export async function compressImage(file, targetSizeBytes) {
    return new Promise(async (resolve, reject) => {
        try {
            // Fast asynchronous decoding
            const imageBitmap = await createImageBitmap(file);
            const originalUrl = URL.createObjectURL(file);
            
            const jobId = jobIdCounter++;
            pendingJobs.set(jobId, { resolve, reject, file, originalUrl });
            
            // Send to Web Worker
            worker.postMessage({
                id: jobId,
                imageBitmap: imageBitmap,
                originalSize: file.size,
                targetSizeBytes: targetSizeBytes,
                mimeType: file.type
            }, [imageBitmap]); 
            
        } catch (err) {
            reject(err);
        }
    });
}