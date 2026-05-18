import { Shield, Zap, Globe } from 'lucide-react'

export default function FeaturesBar() {
  const features = [
    {
      id: 'e2e',
      icon: Shield,
      label: 'End-to-end',
    },
    {
      id: 'realtime',
      icon: Zap,
      label: 'Real-time',
    },
    {
      id: 'p2p',
      icon: Globe,
      label: 'P2P',
    },
  ]

  return (
    <div className="features-bar" role="region" aria-label="Key features">
      {features.map((feature) => {
        const IconComponent = feature.icon
        return (
          <div key={feature.id} className="feature">
            <span className="feature-icon" aria-hidden="true">
              <IconComponent size={20} />
            </span>
            <span>{feature.label}</span>
          </div>
        )
      })}
    </div>
  )
}
