import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Sparkles,
  Award,
  Users2,
  Compass,
  Zap,
  Globe2,
  ShieldCheck,
  ChevronDown,
  ArrowRight,
  Target,
  Rocket,
  Cpu,
  Trophy,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const PrismPage: React.FC = () => {
  const { publishedContents } = useApp();
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const publishedAchievements = publishedContents.filter(
    (c) => c.category === 'Achievements'
  );

  const stats = [
    { label: 'Active Student Scholars', value: '12,500+', desc: 'Across 6 Engineering & Arts faculties' },
    { label: 'Research Guilds & Clubs', value: '48', desc: 'Space, Cyber, Robotics, Arts, Athletics' },
    { label: 'Student Grants Awarded', value: '$1.4M+', desc: 'Non-dilutive prototype & research capital' },
    { label: 'National CTF & Tech Wins', value: '34', desc: 'Podium placements in 2025-2026' },
  ];

  const pillars = [
    {
      icon: Rocket,
      title: 'Cosmic & Frontier Exploration',
      desc: 'Through partner clubs like OrbitX, students design CubeSats, launch high-altitude CanSats, and utilize computerized astronomical telescopes.',
    },
    {
      icon: Cpu,
      title: 'Applied Systems & AI Labs',
      desc: 'Direct access to high-performance GPU clusters, quantum simulators, and clean room fabrication facilities.',
    },
    {
      icon: ShieldCheck,
      title: 'Digital Trust & Instant Passports',
      desc: 'Seamless cryptographically signed digital passes, event check-ins, and automated receipt generation without paper friction.',
    },
    {
      icon: Globe2,
      title: 'Global Founder Incubation',
      desc: 'Venture accelerators, alumni angel networks, and direct tracks to Silicon Valley and European research institutions.',
    },
  ];

  const milestones = [
    {
      year: '2021',
      title: 'PRISM Architecture Conceived',
      desc: 'Pioneered to integrate fragmented campus clubs, research groups, and payment systems into one modern hub.',
    },
    {
      year: '2023',
      title: 'OrbitX & Space Guild Launch',
      desc: 'Launched first collegiate satellite telemetry receiver station on the observatory summit.',
    },
    {
      year: '2025',
      title: 'Quantum Cloud Cluster Integration',
      desc: 'Connected PRISM to national quantum simulator networks for undergraduate quantum research.',
    },
    {
      year: '2026',
      title: 'Apex Hackathon & Global Exchange',
      desc: 'Over 1,500 global attendees and exchange partnerships with Tokyo Tech and ETH Zurich.',
    },
  ];

  const faqs = [
    {
      q: 'How do I join a specialized team or student club on PRISM?',
      a: 'Navigate to the Teams page, browse active technical, cultural, or innovation guilds, and click "Join Team". For audition-based clubs, your status will update to "Pending" until the student leads review your application.',
    },
    {
      q: 'How do digital QR passes work at campus event entrances?',
      a: 'When you register for an event, PRISM automatically issues a digital pass with a cryptographic QR code directly into your "Payments & Passes" wallet. Simply present your pass on your smartphone or print it out for instant check-in.',
    },
    {
      q: 'Are programs and workshops certified for academic credit?',
      a: 'Yes. Most PRISM intensive bootcamps and workshops include verified digital completion certificates and confer between 1.0 to 2.5 elective academic credits upon completion.',
    },
    {
      q: 'Is payment on PRISM secure?',
      a: 'PRISM uses PCI-compliant transaction channels. We do not store card numbers or sensitive credentials. All transactions generate instantaneous institutional tax receipts.',
    },
  ];

  return (
    <div className="space-y-12 animate-fade-in max-w-6xl mx-auto">
      {/* 1. Hero Vision Banner */}
      <div className="relative rounded-3xl glass-panel bg-gradient-to-r from-[#0c0d24] via-[#12133a] to-[#0d1c33] border border-purple-500/30 p-8 sm:p-14 shadow-2xl overflow-hidden text-center sm:text-left">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] bg-cyan-600/15 rounded-full blur-[140px] pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-xs text-purple-300 font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>The PRISM Institution</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Where Curiosity Meets{' '}
            <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-300 bg-clip-text text-transparent">
              Limitless Potential.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            PRISM is more than a digital portal. It is the operating system for next-generation collegiate life—uniting breakthrough scientific clubs, hands-on masterclasses, vibrant cultural festivals, and instant digital ticketing into one unified cosmos.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <NavLink
              to="/events"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 hover:scale-[1.02] transition-transform flex items-center gap-2"
            >
              <span>Explore Campus Activities</span>
              <ArrowRight className="w-4 h-4" />
            </NavLink>
            <NavLink
              to="/teams"
              className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold transition-all"
            >
              Meet the Research Guilds
            </NavLink>
          </div>
        </div>
      </div>

      {/* 2. Key Metrics & Stat Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((st, i) => (
          <div
            key={i}
            className="p-6 rounded-3xl glass-card border border-white/10 hover:border-purple-500/40 transition-all shadow-xl space-y-2"
          >
            <span className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-white via-purple-100 to-cyan-300 bg-clip-text text-transparent font-mono">
              {st.value}
            </span>
            <h4 className="text-sm font-bold text-white">{st.label}</h4>
            <p className="text-xs text-slate-400 leading-relaxed">{st.desc}</p>
          </div>
        ))}
      </div>

      {/* 3. Published Achievements Section (Live Database Driven) */}
      {publishedAchievements.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-xs text-cyan-300 font-bold mb-1">
                <Trophy className="w-3.5 h-3.5 text-cyan-400" />
                <span>Collegiate Accolades & Trophies</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Official PRISM Achievements
              </h2>
            </div>
            <span className="text-xs text-cyan-300 font-mono bg-cyan-950/40 px-3 py-1 rounded-full border border-cyan-500/20">
              Live Verified
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {publishedAchievements.map((item) => (
              <div
                key={item.id}
                className="p-6 rounded-3xl glass-card border border-cyan-500/20 bg-gradient-to-br from-[#0e122b] to-[#090b1a] shadow-xl space-y-4"
              >
                {item.coverImage && (
                  <div className="rounded-2xl overflow-hidden aspect-video border border-white/10">
                    <img src={item.coverImage} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <div>
                  <div className="flex items-center justify-between text-xs text-cyan-400 font-mono mb-1">
                    <span>{item.relatedTeam || 'PRISM College'}</span>
                    <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white">{item.title}</h3>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">{item.shortDescription}</p>
                  {item.fullDescription && item.fullDescription !== item.shortDescription && (
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">{item.fullDescription}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Core Pillars */}
      <div className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Architected for Student Excellence
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Four foundational pillars that drive our campus forward.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pillars.map((pil, idx) => {
            const Icon = pil.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-3xl glass-card border border-white/10 hover:border-cyan-500/30 transition-all space-y-3 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600/30 to-cyan-500/30 border border-white/10 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {pil.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">{pil.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Campus Journey Timeline */}
      <div className="rounded-3xl glass-panel border border-white/10 p-6 sm:p-10 space-y-6 shadow-xl">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
            Evolution & History
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-white">
            The PRISM Journey
          </h3>
        </div>

        <div className="relative pl-6 sm:pl-8 border-l-2 border-purple-500/30 space-y-8 my-4">
          {milestones.map((ms, index) => (
            <div key={index} className="relative group">
              <div className="absolute -left-[31px] sm:-left-[39px] top-1 w-4 h-4 rounded-full bg-[#0a0c1a] border-2 border-purple-400 group-hover:bg-cyan-400 transition-colors" />

              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                <span className="font-mono text-xs font-extrabold text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 w-fit">
                  {ms.year}
                </span>
                <h4 className="text-base font-bold text-white">{ms.title}</h4>
              </div>
              <p className="text-xs text-slate-400 mt-1 max-w-xl leading-relaxed">
                {ms.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Frequently Asked Questions */}
      <div className="rounded-3xl glass-panel border border-white/10 p-6 sm:p-10 space-y-6 shadow-xl">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
            Got Questions?
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-white">
            Frequently Asked Questions
          </h3>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full p-4 text-left flex items-center justify-between text-sm font-bold text-white hover:text-purple-300 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                    activeFaq === idx ? 'rotate-180 text-purple-400' : ''
                  }`}
                />
              </button>
              {activeFaq === idx && (
                <div className="px-4 pb-4 text-xs text-slate-300 leading-relaxed border-t border-white/5 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
