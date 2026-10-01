/**
 * Advanced Kanban Data Core and Analytics Engine (#6158)
 */
export class TrackerStore {
    #jobs = [];

    constructor() {
        this.loadFromStorage();
    }

    get allJobs() {
        return [...this.#jobs];
    }

    addJob(company, role, stage = 'Applied') {
        const newJob = {
            id: 'job_' + Date.now(),
            company,
            role,
            stage // Stages: 'Applied', 'Interviewing', 'Offered', 'Rejected'
        };
        this.#jobs.push(newJob);
        this.saveToStorage();
        return newJob;
    }

    updateJobStage(jobId, newStage) {
        const job = this.#jobs.find(j => j.id === jobId);
        if (job) {
            job.stage = newStage;
            this.saveToStorage();
            return true;
        }
        return false;
    }

    // ADVANCED DATA REDUCTION (Calculates real-time dashboard analytics metric counts)
    calculateAnalytics() {
        const total = this.#jobs.length;

        const metrics = this.#jobs.reduce((acc, job) => {
            acc[job.stage] = (acc[job.stage] || 0) + 1;
            return acc;
        }, { Applied: 0, Interviewing: 0, Offered: 0, Rejected: 0 });

        // Calculate interview transition success rate ratio
        const conversionRate = total > 0
            ? (((metrics.Interviewing + metrics.Offered) / total) * 100).toFixed(1)
            : 0;

        return {
            ...metrics,
            total,
            conversionRate: `${conversionRate}%`
        };
    }

    saveToStorage() {
        localStorage.setItem('gssoc_kanban_jobs', JSON.stringify(this.#jobs));
    }

    loadFromStorage() {
        const data = localStorage.getItem('gssoc_kanban_jobs');
        this.#jobs = data ? JSON.parse(data) : [];
    }
}