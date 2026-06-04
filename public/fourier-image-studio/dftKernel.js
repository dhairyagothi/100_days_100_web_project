/**
 * Advanced Computational DSP Layer - GSSoC Tier Critical
 * 2D Discrete Fourier & Inverse Fourier Transformation Matrices
 */
export class FourierMathKernel {
    // Computes Forward 2D DFT: Spatial Pixels -> Frequency Coefficients
    static forward2D(pixelGrid, N) {
        const real = Array.from({ length: N }, () => new Float64Array(N));
        const imag = Array.from({ length: N }, () => new Float64Array(N));

        // 2D Fourier Transformation Equation Matrix Loop: O(N^4) downscaled sample size
        for (let u = 0; u < N; u++) {
            for (let v = 0; v < N; v++) {
                let sumReal = 0;
                let sumImag = 0;

                for (let x = 0; x < N; x++) {
                    for (let y = 0; y < N; y++) {
                        // Angular Vector Frequency Formula Angle calculation: 2 * PI * ((u*x)/N + (v*y)/N)
                        const angle = 2 * Math.PI * ((u * x) / N + (v * y) / N);
                        const pixelVal = pixelGrid[x][y];

                        sumReal += pixelVal * Math.cos(angle);
                        sumImag -= pixelVal * Math.sin(angle);
                    }
                }
                real[u][v] = sumReal;
                imag[u][v] = sumImag;
            }
        }
        return { real, imag };
    }

    // Computes Inverse 2D DFT: Frequency Coefficients -> Spatial Pixels
    static inverse2D(real, imag, N) {
        const outputGrid = Array.from({ length: N }, () => new Float64Array(N));

        for (let x = 0; x < N; x++) {
            for (let y = 0; y < N; y++) {
                let sum = 0;

                for (let u = 0; u < N; u++) {
                    for (let v = 0; v < N; v++) {
                        const angle = 2 * Math.PI * ((u * x) / N + (v * y) / N);
                        // Inverse transformation applies opposite sign imaginary additions
                        sum += real[u][v] * Math.cos(angle) - imag[u][v] * Math.sin(angle);
                    }
                }
                // Normalize the reconstruction signal division
                outputGrid[x][y] = Math.min(255, Math.max(0, sum / (N * N)));
            }
        }
        return outputGrid;
    }
}