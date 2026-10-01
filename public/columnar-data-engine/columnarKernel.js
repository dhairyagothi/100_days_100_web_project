/**
 * Critical Architecture Optimization Layer - GSSoC Tier Critical
 * High-Performance Columnar Storage & Aggregation Pipeline
 */
export class ColumnarDataMatrix {
    #columns = {};
    #rowCount = 0;

    constructor(schemaFields) {
        // Initialize an empty vector array for each field defined in the schema
        schemaFields.forEach(field => {
            this.#columns[field] = [];
        });
    }

    // Ingests standard row objects and splits them into flat column arrays
    loadRows(rowArray) {
        rowArray.forEach(row => {
            for (const field in this.#columns) {
                this.#columns[field].push(row[field] !== undefined ? row[field] : null);
            }
            this.#rowCount++;
        });
    }

    // Highly Optimized: Computes the sum of a specific column by reading only that single vector array
    aggregateSum(columnName) {
        const vector = this.#columns[columnName];
        if (!vector) return 0;

        let total = 0;
        for (let i = 0; i < vector.length; i++) {
            total += vector[i];
        }
        return total;
    }

    // Computes the mathematical average of a column vector
    aggregateAverage(columnName) {
        if (this.#rowCount === 0) return 0;
        return this.aggregateSum(columnName) / this.#rowCount;
    }

    // Reconstructs individual rows on demand for visual rendering pipelines
    getRowProjection(index) {
        if (index < 0 || index >= this.#rowCount) return null;

        const row = {};
        for (const field in this.#columns) {
            row[field] = this.#columns[field][index];
        }
        return row;
    }

    get totalRecords() {
        return this.#rowCount;
    }
}