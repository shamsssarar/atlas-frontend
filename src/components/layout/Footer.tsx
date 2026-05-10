"use client";

import Link from "next/link";
import { Mail, MapPin, Phone, Zap, ArrowRight } from "lucide-react";
import { useState } from "react";
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  const footerLinks = {
    Product: [
      { label: "Features", href: "#features" },
      { label: "Training Plans", href: "/training-plans" },
      { label: "Pricing", href: "#pricing" },
      { label: "Security", href: "#" },
    ],
    Company: [
      { label: "About Us", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Contact", href: "#" },
    ],
    Resources: [
      { label: "Documentation", href: "#" },
      { label: "API Reference", href: "#" },
      { label: "Support", href: "#" },
      { label: "Community", href: "#" },
    ],
    Legal: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "Cookie Policy", href: "#" },
      { label: "GDPR", href: "#" },
    ],
  };

  const socials = [
    { icon: FaFacebook, href: "#", label: "Facebook" },
    { icon: FaTwitter, href: "#", label: "Twitter" },
    { icon: FaLinkedin, href: "#", label: "LinkedIn" },
    { icon: FaInstagram, href: "#", label: "Instagram" },
  ];

  return (
    <footer className="relative bg-gradient-to-b from-slate-950 to-slate-950 border-t border-slate-800 pt-20 pb-8">
      {/* Gradient Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        {/* Newsletter Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/30 rounded-xl p-8 sm:p-12 backdrop-blur-sm">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                  Stay Updated
                </h3>
                <p className="text-slate-400">
                  Get the latest fitness tips, AI workout insights, and platform
                  updates delivered to your inbox.
                </p>
              </div>
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                  required
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-lg flex items-center gap-2 whitespace-nowrap"
                >
                  <span className="hidden sm:inline">Subscribe</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
              {subscribed && (
                <div className="col-span-full text-center text-green-400 text-sm">
                  ✓ Thanks for subscribing!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
            {/* Brand */}
            <div className="lg:col-span-1">
              <Link href="/" className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-lg">
                  <Zap className="w-5 h-5 text-blue-400" />
                </div>
                <span className="font-bold text-lg text-white">ATLAS</span>
              </Link>
              <p className="text-slate-400 text-sm mb-6">
                Empowering athletes and coaches with intelligent fitness
                tracking and AI-powered workout generation.
              </p>
              <div className="flex gap-4">
                {socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    className="w-10 h-10 rounded-lg bg-slate-900/50 border border-slate-800 hover:border-blue-500/50 hover:bg-blue-500/10 flex items-center justify-center text-slate-400 hover:text-blue-400 transition-all duration-300"
                    aria-label={social.label}
                  >
                    <social.icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Links */}
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h4 className="text-sm font-semibold text-white mb-4">
                  {category}
                </h4>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-slate-400 hover:text-white transition-colors text-sm"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Contact & Bottom */}
          <div className="border-t border-slate-800 pt-8">
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {/* Contact Info */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-white">Contact Us</h4>
                <div className="space-y-2 text-slate-400 text-sm">
                  <a
                    href="mailto:support@atlas.com"
                    className="flex items-center gap-3 hover:text-blue-400 transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    support@atlas.com
                  </a>
                  <a
                    href="tel:+1-800-123-4567"
                    className="flex items-center gap-3 hover:text-blue-400 transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    +1 (800) 123-4567
                  </a>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>123 Fitness Ave, Sports City, SC 12345</span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-800">
                  <p className="text-2xl font-bold text-blue-400">10K+</p>
                  <p className="text-xs text-slate-400 mt-1">Workouts</p>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-800">
                  <p className="text-2xl font-bold text-indigo-400">500+</p>
                  <p className="text-xs text-slate-400 mt-1">Athletes</p>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-800">
                  <p className="text-2xl font-bold text-purple-400">98%</p>
                  <p className="text-xs text-slate-400 mt-1">Satisfied</p>
                </div>
              </div>
            </div>

            {/* Copyright */}
            <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-slate-400 text-sm">
              <p>&copy; 2024 ATLAS. All rights reserved.</p>
              <p>Made with ❤️ for fitness enthusiasts worldwide</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
