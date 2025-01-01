import React from 'react';

export default function JobFilters() {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="font-semibold mb-4">Job Filters</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Date Posted</label>
          <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
            <option>Past 24 hours</option>
            <option>Past week</option>
            <option>Past month</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Experience Level</label>
          <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
            <option>Entry Level</option>
            <option>Mid-Senior Level</option>
            <option>Director</option>
            <option>Executive</option>
          </select>
        </div>
      </div>
    </div>
  );
}