'use client';

import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { JSX } from 'react';

export default function FinalCTASection(): JSX.Element {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950/20 to-slate-950">
        <div className="absolute top-1/4 left-1/2 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl -translate-x-1/2"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl"></div>
      </div>

      {/* Animated Grid Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="h-full w-full" style={{
          backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(148, 163, 184, .05) 25%, rgba(148, 163, 184, .05) 26%, transparent 27%, transparent 74%, rgba(148, 163, 184, .05) 75%, rgba(148, 163, 184, .05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(148, 163, 184, .05) 25%, rgba(148, 163, 184, .05) 26%, transparent 27%, transparent 74%, rgba(148, 163, 184, .05) 75%, rgba(148, 163, 184, .05) 76%, transparent 77%, transparent)',
          backgroundSize: '50px 50px',
        }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-3xl mx-auto text-center">
        {/* Main Headline */}
        <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight">
          Ready to{' '}
          <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-600 text-transparent bg-clip-text">
            Command Your Performance?
          </span>
        </h2>

        {/* Subheading */}
        <p className="text-lg sm:text-xl text-slate-300 mb-12 leading-relaxed max-w-2xl mx-auto">
          Join hundreds of athletes and coaches already transforming their training with ATLAS. 
          Access intelligent programming, real-time tracking, and data-driven insights today.
        </p>

        {/* Benefits List */}
        <div className="grid sm:grid-cols-3 gap-6 mb-16 max-w-2xl mx-auto">
          {[
            { icon: '⚡', label: 'Instant Setup' },
            { icon: '📊', label: 'Real-time Analytics' },
            { icon: '🔒', label: 'Secure & Private' },
          ].map((benefit) => (
            <div
              key={benefit.label}
              className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/30 hover:border-blue-500/30 transition-all duration-300 hover:bg-slate-800/50"
            >
              <div className="text-3xl mb-2">{benefit.icon}</div>
              <div className="text-sm font-medium text-slate-300">{benefit.label}</div>
            </div>
          ))}
        </div>

        {/* Primary CTA Button */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Link
            href="/register"
            className="group inline-flex items-center justify-center px-10 py-5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 text-lg"
          >
            Join the Beta
            <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="mailto:hello@atlas.com"
            className="inline-flex items-center justify-center px-10 py-5 bg-slate-800/50 hover:bg-slate-700/50 text-white font-bold rounded-xl border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 backdrop-blur-sm text-lg"
          >
            Contact Us
          </Link>
        </div>

        {/* Closing Statement */}
        <div className="pt-12 border-t border-slate-800/50">
          <p className="text-sm text-slate-400 mb-4">
            ✨ Limited beta slots available – Early access benefits included
          </p>
          <p className="text-xs text-slate-500">
            No credit card required. Start your free trial today.
          </p>
        </div>
      </div>

      {/* Floating Elements for Visual Interest */}
      <div className="absolute top-20 left-10 w-3 h-3 bg-blue-400/30 rounded-full blur-sm"></div>
      <div className="absolute top-40 right-20 w-2 h-2 bg-indigo-400/20 rounded-full blur-sm"></div>
      <div className="absolute bottom-32 left-1/3 w-2 h-2 bg-blue-400/20 rounded-full blur-sm"></div>
      <div className="absolute bottom-20 right-1/4 w-3 h-3 bg-indigo-400/30 rounded-full blur-sm"></div>
    </section>
  );
}
