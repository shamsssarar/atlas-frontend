'use client';

import { JSX, useState } from 'react';
import { Users, BarChart3, Zap } from 'lucide-react';

type Role = 'athlete' | 'coach';

interface RoleContent {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
}

const roleContent: Record<Role, RoleContent> = {
  athlete: {
    icon: <Users className="w-12 h-12 text-blue-400" />,
    title: 'For Athletes',
    description: 'Take control of your training with intelligent workout execution, detailed performance logging, and real-time metrics to maximize every session.',
    features: [
      'Smart workout execution with form feedback',
      'Detailed performance logging and tracking',
      'Real-time metrics and progress visualization',
      'Recovery and readiness recommendations',
      'Social features and leaderboards',
    ],
  },
  coach: {
    icon: <BarChart3 className="w-12 h-12 text-indigo-400" />,
    title: 'For Coaches',
    description: 'Manage athlete programs, monitor progress in real-time, analyze performance data, and make data-driven coaching decisions from one intuitive dashboard.',
    features: [
      'Program design and periodization tools',
      'Multi-athlete client management',
      'Real-time performance analytics',
      'Athlete progress tracking and insights',
      'Customizable feedback and communication',
    ],
  },
};

export default function RoleShowcaseSection(): JSX.Element {
  const [activeRole, setActiveRole] = useState<Role>('athlete');
  const content = roleContent[activeRole];

  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-950 to-slate-900">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -translate-x-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Designed for{' '}
            <span className="bg-gradient-to-r from-blue-400 to-indigo-400 text-transparent bg-clip-text">
              Your Role
            </span>
          </h2>
          <p className="text-lg text-slate-400">
            Whether you're pushing your limits or coaching the next generation, ATLAS adapts to you.
          </p>
        </div>

        {/* Role Toggle */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-slate-800/50 border border-slate-700/50 rounded-full p-1 backdrop-blur-sm">
            {(['athlete', 'coach'] as const).map((role) => (
              <button
                key={role}
                onClick={() => setActiveRole(role)}
                className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 capitalize ${
                  activeRole === role
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        {/* Split View Content */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left: Icon and Title */}
          <div className="text-center md:text-left">
            <div className="inline-flex p-4 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl border border-slate-700/50 mb-8 md:mb-12">
              {content.icon}
            </div>
            <h3 className="text-3xl sm:text-4xl font-bold text-white mb-6">{content.title}</h3>
            <p className="text-lg text-slate-400 leading-relaxed mb-8">
              {content.description}
            </p>
          </div>

          {/* Right: Features List */}
          <div className="space-y-4">
            {content.features.map((feature, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-4 rounded-xl bg-slate-800/30 border border-slate-700/30 hover:border-blue-500/30 transition-all duration-300 group"
              >
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 flex items-center justify-center mt-1">
                  <Zap className="w-3 h-3 text-white" />
                </div>
                <span className="text-slate-300 group-hover:text-white transition-colors">
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="mt-16 grid md:grid-cols-3 gap-6">
          {['10K+', '500+', '98%'].map((stat, i) => (
            <div key={i} className="text-center p-6 rounded-xl bg-gradient-to-br from-slate-800/30 to-slate-900/30 border border-slate-700/30">
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 text-transparent bg-clip-text">
                {stat}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
