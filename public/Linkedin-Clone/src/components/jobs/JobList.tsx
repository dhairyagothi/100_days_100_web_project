import React from 'react';
import { Briefcase } from 'lucide-react';

const MOCK_JOBS = [
  {
    id: '1',
    title: 'Senior Software Engineer',
    company: 'Tech Corp',
    location: 'San Francisco, CA',
    salary: '$150k - $200k',
    posted: '2d ago',
  },
  {
    id: '2',
    title: 'Product Manager',
    company: 'Innovation Inc',
    location: 'New York, NY',
    salary: '$130k - $180k',
    posted: '3d ago',
  },
];

export default function JobList() {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">Recommended Jobs</h2>
        <div className="space-y-4">
          {MOCK_JOBS.map((job) => (
            <div key={job.id} className="border-b last:border-0 pb-4">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-gray-100 rounded">
                  <Briefcase className="w-8 h-8 text-gray-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{job.title}</h3>
                  <p className="text-gray-600">{job.company}</p>
                  <p className="text-gray-500 text-sm">{job.location}</p>
                  <p className="text-gray-500 text-sm">{job.salary}</p>
                  <p className="text-gray-400 text-sm mt-2">{job.posted}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}