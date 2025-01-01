import React from 'react';
import JobList from '../components/jobs/JobList';
import JobFilters from '../components/jobs/JobFilters';

export default function JobsPage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="md:col-span-1">
        <JobFilters />
      </div>
      <div className="md:col-span-3">
        <JobList />
      </div>
    </div>
  );
}