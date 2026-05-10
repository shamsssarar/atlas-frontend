'use client';

import { Star } from 'lucide-react';

interface Statistic {
  label: string;
  value: string;
  description: string;
}

interface Review {
  name: string;
  role: string;
  content: string;
  avatar: string;
}

const statistics: Statistic[] = [
  {
    label: 'Workouts Logged',
    value: '10,000+',
    description: 'Training sessions completed by our community',
  },
  {
    label: 'Active Athletes',
    value: '500+',
    description: 'Growing community of dedicated fitness enthusiasts',
  },
  {
    label: 'Satisfaction Rate',
    value: '98%',
    description: 'Users would recommend ATLAS to a friend',
  },
];

const reviews: Review[] = [
  {
    name: 'Alex Rodriguez',
    role: 'Professional Athlete',
    content:
      'ATLAS transformed how I train. The AI-powered programming is spot-on, and tracking my biometrics in real-time has taken my performance to the next level. Absolutely game-changing.',
    avatar: '🏃',
  },
  {
    name: 'Sarah Chen',
    role: 'Strength Coach',
    content:
      'Managing multiple athletes used to be chaotic. Now with ATLAS, I can track everyone\'s progress, adjust programs on the fly, and communicate seamlessly. Best investment for my coaching business.',
    avatar: '💪',
  },
  {
    name: 'Marcus Williams',
    role: 'Fitness Enthusiast',
    content:
      'I love how ATLAS adapts to my fitness journey. The form feedback keeps me honest, and the progress visualization is incredibly motivating. This is the platform I\'ve been waiting for.',
    avatar: '⭐',
  },
];

export default function SocialProofSection(): JSX.Element {
  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-900 to-slate-950">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 left-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="mb-20 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Trusted by the{' '}
            <span className="bg-gradient-to-r from-blue-400 to-indigo-400 text-transparent bg-clip-text">
              Performance Community
            </span>
          </h2>
          <p className="text-lg text-slate-400">
            See what athletes and coaches are achieving with ATLAS
          </p>
        </div>

        {/* Statistics Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {statistics.map((stat) => (
            <div
              key={stat.label}
              className="group relative rounded-2xl border border-slate-800/50 bg-gradient-to-br from-slate-800/30 to-slate-900/50 p-8 text-center backdrop-blur-sm transition-all duration-300 hover:border-blue-500/50 hover:bg-slate-800/50 hover:-translate-y-1"
            >
              {/* Decorative top accent */}
              <div className="absolute top-0 left-1/2 w-1 h-1 bg-gradient-to-b from-blue-500 to-transparent rounded-full -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity"></div>

              <div className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 text-transparent bg-clip-text mb-3">
                {stat.value}
              </div>
              <div className="text-xl font-semibold text-white mb-2">{stat.label}</div>
              <div className="text-sm text-slate-400">{stat.description}</div>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-white mb-8 text-center">What Users Say</h3>

          <div className="grid md:grid-cols-3 gap-6">
            {reviews.map((review, index) => (
              <div
                key={index}
                className="group rounded-2xl border border-slate-800/50 bg-gradient-to-br from-slate-800/30 to-slate-900/50 p-8 backdrop-blur-sm transition-all duration-300 hover:border-blue-500/30 hover:bg-slate-800/50"
              >
                {/* Star Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>

                {/* Review Content */}
                <p className="text-slate-300 mb-6 leading-relaxed italic">
                  "{review.content}"
                </p>

                {/* User Info */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 flex items-center justify-center text-lg">
                    {review.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-white">{review.name}</div>
                    <div className="text-xs text-slate-400">{review.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Trust Badge */}
        <div className="text-center pt-12 border-t border-slate-800/50">
          <p className="text-slate-400 text-sm">
            Backed by thousands of verified user sessions and real performance results
          </p>
        </div>
      </div>
    </section>
  );
}
