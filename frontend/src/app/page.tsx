'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Shield, 
  Zap, 
  Globe,
  ArrowRight,
  Play
} from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  // Stats data for the stats section
  const stats = [
    { number: '10K+', label: 'Active Creators' },
    { number: '$2.5M+', label: 'Total Rewards' },
    { number: '500+', label: 'Campaigns' },
    { number: '99.9%', label: 'Uptime' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="relative z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg"></div>
            <span className="text-2xl font-bold text-white">Clipper DApp</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-300 hover:text-white transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-gray-300 hover:text-white transition-colors">
              How It Works
            </a>
            <a href="#stats" className="text-gray-300 hover:text-white transition-colors">
              Stats
            </a>
            <a href="/dashboard" className="text-gray-300 hover:text-white transition-colors">
              Dashboard
            </a>
          </div>

          <div className="flex items-center space-x-4">
            <a 
              href="/connect"
              className="px-4 py-2 text-white border border-purple-500 rounded-lg hover:bg-purple-500/20 transition-colors"
            >
              Connect Wallet
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Get Paid for
            <span className="block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Viral Content
            </span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join the future of content creation. Create viral content, earn engagement rewards, 
            and get paid instantly through blockchain technology on Avalanche.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <a 
              href="/dashboard"
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105"
            >
              Start Creating
              <span className="inline ml-2">→</span>
            </a>
            
            <button 
              className="px-8 py-4 border border-purple-500 text-purple-400 font-semibold rounded-lg hover:bg-purple-500/20 transition-colors flex items-center"
            >
              ▶ Watch Demo
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Why Choose Clipper DApp?
            </h2>
            <p className="text-xl text-gray-300">
              Built on blockchain technology for transparency, fairness, and instant rewards
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <TrendingUp className="w-8 h-8" />,
                title: 'Viral Rewards',
                description: 'Earn based on actual engagement metrics, not just views'
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: 'Community Driven',
                description: 'Connect with other creators and build your network'
              },
              {
                icon: <DollarSign className="w-8 h-8" />,
                title: 'Instant Payments',
                description: 'Get paid immediately through smart contracts'
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: 'Secure & Transparent',
                description: 'All transactions are verifiable on the blockchain'
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: 'Lightning Fast',
                description: 'Built on Avalanche for sub-second finality'
              },
              {
                icon: <Globe className="w-8 h-8" />,
                title: 'Multi-Platform',
                description: 'Support for Twitter, Instagram, YouTube & TikTok'
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 hover:border-purple-500/50 transition-all"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-6">
                  <div className="text-white">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="px-6 py-20 bg-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-300">
              Get started in just three simple steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Connect Wallet',
                description: 'Connect your wallet and browse available campaigns from top brands'
              },
              {
                step: '02',
                title: 'Create & Share',
                description: 'Create engaging content and share it on your social platforms'
              },
              {
                step: '03',
                title: 'Earn Rewards',
                description: 'Get paid based on verified engagement metrics'
              }
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-white">{item.step}</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-300">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-300">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Start Earning?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of creators who are already earning from their viral content
            </p>
            <Link 
              href="/dashboard"
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 inline-flex items-center"
            >
              Get Started Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded"></div>
            <span className="text-xl font-bold text-white">Clipper DApp</span>
          </div>
          <p className="text-gray-400">
            © 2024 Clipper DApp. Built on Avalanche blockchain.
          </p>
        </div>
      </footer>
    </div>
  );
}
