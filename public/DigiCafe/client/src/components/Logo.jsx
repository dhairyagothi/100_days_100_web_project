import { Globe } from 'lucide-react';

export default function Logo({ variant = 'large' }) {
  return (
    <div className={`logo-wrapper logo-${variant}`}>
      <div className="logo-icon" aria-hidden="true">
        <Globe size={24} />
      </div>
      <div className="logo-text">
        Digi<span>Cafe</span>
      </div>
    </div>
  )
}
