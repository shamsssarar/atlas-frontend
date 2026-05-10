'use client';

import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { JSX } from 'react';

interface TrustBadge {
  label: string;
  value: string;
}

const trustBadges: TrustBadge[] = [
  { label: 'Workouts', value: '10K+' },
  { label: 'Users', value: '500+' },
  { label: 'Satisfaction', value: '98%' },
];

export default function HeroSection(): JSX.Element {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
          Command Your{' '}
          <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-600 text-transparent bg-clip-text">
            Physical Potential
          </span>
        </h1>

        {/* Subheadline */}
        <p className="text-lg sm:text-xl text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed">
          ATLAS is the intelligent platform for athletes and coaches to build, track, and optimize every workout. 
          From AI-powered programming to real-time biometrics, take control of your performance.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link
            href="/register"
            className="group inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
          >
            Get Started
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="#features"
            className="inline-flex items-center justify-center px-8 py-4 bg-slate-800/50 hover:bg-slate-700/50 text-white font-semibold rounded-lg border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 backdrop-blur-sm"
          >
            Explore Features
          </Link>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-col sm:flex-row gap-8 justify-center items-center pt-8 border-t border-slate-800/50">
          {trustBadges.map((badge) => (
            <div key={badge.label} className="flex flex-col items-center">
              <div className="text-2xl sm:text-3xl font-bold text-blue-400 mb-1">
                {badge.value}
              </div>
              <div className="text-sm text-slate-400">
                {badge.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
