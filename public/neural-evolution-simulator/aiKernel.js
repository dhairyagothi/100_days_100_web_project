/**
 * Advanced AI Engine Layer - GSSoC Tier Critical
 * Neural Network Node Arrays & Genetic Mutation Chromosomes
 */
export class NeuralNetwork {
    constructor(inputNodes = 2, hiddenNodes = 4, outputNodes = 2) {
        // Simple matrix weight arrays initialization (-1 to 1 range parameters)
        this.weights_ih = Array.from({ length: hiddenNodes }, () =>
            Array.from({ length: inputNodes }, () => Math.random() * 2 - 1)
        );
        this.weights_ho = Array.from({ length: outputNodes }, () =>
            Array.from({ length: hiddenNodes }, () => Math.random() * 2 - 1)
        );
    }

    // Mathematical Feedforward activation loop
    predict(inputsArray) {
        // Calculate outputs from Hidden Layer
        const hidden = this.weights_ih.map(row => {
            let sum = 0;
            for (let i = 0; i < row.length; i++) sum += row[i] * inputsArray[i];
            return Math.tanh(sum); // Activation tracking limits
        });

        // Calculate outputs from Final Output Layer
        const outputs = this.weights_ho.map(row => {
            let sum = 0;
            for (let i = 0; i < row.length; i++) sum += row[i] * hidden[i];
            return Math.tanh(sum);
        });

        return outputs; // Returns movement vectors [deltaX, deltaY]
    }

    // Mutates internal weight values using a configurable variance slider limit
    mutate(ratePercentage) {
        const rate = ratePercentage / 100;
        const mutateVal = (val) => (Math.random() < rate) ? val + (Math.random() * 0.4 - 0.2) : val;

        this.weights_ih = this.weights_ih.map(row => row.map(mutateVal));
        this.weights_ho = this.weights_ho.map(row => row.map(mutateVal));
    }

    // Clone chromosome structures for genetic reproduction loops
    clone() {
        const copy = new NeuralNetwork();
        copy.weights_ih = this.weights_ih.map(row => [...row]);
        copy.weights_ho = this.weights_ho.map(row => [...row]);
        return copy;
    }
}