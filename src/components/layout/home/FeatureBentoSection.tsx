'use client';

import { Zap, Activity, Share2 } from 'lucide-react';

interface FeatureCard {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const features: FeatureCard[] = [
  {
    icon: <Zap className="w-8 h-8 text-blue-400" />,
    title: 'AI Workout Generation',
    description: 'Let our intelligent system design personalized workout programs based on your goals, fitness level, and equipment availability. Adapt in real-time with smart recommendations.',
  },
  {
    icon: <Activity className="w-8 h-8 text-indigo-400" />,
    title: 'Real-time Biometric Tracking',
    description: 'Monitor heart rate, calories, form accuracy, and performance metrics in real-time. Get instant feedback to optimize every rep and set during your workout.',
  },
  {
    icon: <Share2 className="w-8 h-8 text-blue-400" />,
    title: 'Coach-to-Athlete Syncing',
    description: 'Seamless real-time synchronization between coaches and athletes. Share programs, track progress, and communicate all in one unified platform.',
  },
];

export default function FeatureBentoSection(): JSX.Element {
  return (
    <section id="features" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-900 to-slate-950">
      {/* Background Accents */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-10 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-10 w-72 h-72 bg-indigo-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="mb-20 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Powerful Features Built for{' '}
            <span className="bg-gradient-to-r from-blue-400 to-indigo-400 text-transparent bg-clip-text">
              Peak Performance
            </span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Everything you need to train smarter, track accurately, and achieve more.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={`group relative rounded-2xl border border-slate-800/50 bg-gradient-to-br from-slate-800/30 to-slate-900/50 p-8 backdrop-blur-sm transition-all duration-300 hover:border-blue-500/50 hover:bg-slate-800/50 hover:-translate-y-2 ${
                index === 1 ? 'md:col-span-1 lg:row-span-2' : ''
              }`}
            >
              {/* Icon */}
              <div className="mb-6 inline-flex p-3 bg-slate-800/50 rounded-xl group-hover:bg-slate-700/50 transition-colors">
                {feature.icon}
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>

              {/* Description */}
              <p className="text-slate-400 leading-relaxed mb-6">{feature.description}</p>

              {/* Decorative Corner */}
              <div className="absolute top-0 right-0 w-1 h-12 bg-gradient-to-b from-blue-500/50 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
