'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ThemeToggle, useTheme } from '../theme-provider';

function AirplaneIcon({ size = 64 }: { size?: number }) {
  return (
    <svg width={size} height={size * 0.5} viewBox="0 0 200 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="65" cy="28" rx="48" ry="9" fill="#f0ebe0"/>
      <path d="M17 28 C17 34 40 37 65 37 C90 37 113 34 113 28" fill="#2a5a6a" opacity="0.9"/>
      <path d="M50 32 L38 52 L82 52 L72 32Z" fill="#2a5a6a"/>
      <path d="M18 28 L10 12 L24 14 L22 28Z" fill="#4b2d8e"/>
      <path d="M18 22 L14 16 L22 17Z" fill="#f0ebe0"/>
      <ellipse cx="52" cy="44" rx="5" ry="3.5" fill="#3a6a7a"/>
      <ellipse cx="72" cy="44" rx="5" ry="3.5" fill="#3a6a7a"/>
      <g fill="#5b9bd5" opacity="0.6">
        <rect x="35" y="25" width="3" height="4" rx="1.5"/>
        <rect x="42" y="25" width="3" height="4" rx="1.5"/>
        <rect x="49" y="25" width="3" height="4" rx="1.5"/>
        <rect x="56" y="25" width="3" height="4" rx="1.5"/>
        <rect x="63" y="25" width="3" height="4" rx="1.5"/>
        <rect x="70" y="25" width="3" height="4" rx="1.5"/>
        <rect x="77" y="25" width="3" height="4" rx="1.5"/>
        <rect x="84" y="25" width="3" height="4" rx="1.5"/>
        <rect x="91" y="25" width="3" height="4" rx="1.5"/>
      </g>
      <path d="M108 24 Q113 28 108 32" fill="#4a9aba" opacity="0.8"/>
      <ellipse cx="112" cy="28" rx="4" ry="8" fill="#f0ebe0"/>
      <path d="M40 46 L180 46 L180 48 L40 48Z" fill="#4b2d8e"/>
      <path d="M40 48 L180 48 L180 49 L40 49Z" fill="#c4a44e"/>
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2"/>
      <path d="M22 7l-10 7L2 7"/>
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <circle cx="12" cy="8" r="4"/>
      <path d="M4 20c0-4 4-6 8-6s8 2 8 6"/>
    </svg>
  );
}

export default function ContactPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const isNight = theme === 'night';

  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden" style={{ background: isNight ? '#1a2040' : '#5b9bd5' }}>
      <ThemeToggle />

      {/* Home button */}
      <button
        onClick={() => router.push('/')}
        className="fixed top-5 left-5 z-50 w-10 h-10 rounded-full flex items-center justify-center transition-all"
        style={{ background: 'var(--bg-card, rgba(255,255,255,0.95))', border: '1px solid var(--border, #e8e0d4)', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
        title="Home"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      </button>

      {/* Background clouds */}
      <div className="absolute inset-0 pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" fill="none">
          <g opacity={isNight ? '0.15' : '0.4'}>
            <ellipse cx="200" cy="150" rx="80" ry="35" fill={isNight ? '#2a3a5a' : '#f5e8c8'}/>
            <ellipse cx="250" cy="145" rx="60" ry="28" fill={isNight ? '#2a3a5a' : '#fff8e8'}/>
            <ellipse cx="900" cy="200" rx="90" ry="40" fill={isNight ? '#2a3a5a' : '#f5e8c8'}/>
            <ellipse cx="950" cy="195" rx="65" ry="30" fill={isNight ? '#2a3a5a' : '#fff8e8'}/>
            <ellipse cx="500" cy="100" rx="70" ry="30" fill={isNight ? '#2a3a5a' : '#f5e8c8'}/>
          </g>
          {isNight && (
            <g fill="#ffffff">
              <circle cx="100" cy="80" r="1.5" opacity="0.6"/>
              <circle cx="300" cy="50" r="1" opacity="0.4"/>
              <circle cx="500" cy="70" r="1.5" opacity="0.5"/>
              <circle cx="700" cy="40" r="1" opacity="0.3"/>
              <circle cx="900" cy="90" r="1.5" opacity="0.6"/>
              <circle cx="1100" cy="60" r="1" opacity="0.4"/>
              <circle cx="150" cy="300" r="1" opacity="0.3"/>
              <circle cx="400" cy="250" r="1.5" opacity="0.5"/>
              <circle cx="800" cy="350" r="1" opacity="0.4"/>
              <circle cx="1050" cy="280" r="1.5" opacity="0.5"/>
            </g>
          )}
        </svg>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-sm"
      >
        {/* Airplane decoration */}
        <div className="flex justify-center mb-6" style={{ color: isNight ? '#e8a050' : '#2a5a6a' }}>
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <AirplaneIcon size={100} />
          </motion.div>
        </div>

        {/* Card */}
        <div className="rounded-2xl p-7 shadow-xl" style={{ background: isNight ? 'rgba(26,32,50,0.95)' : 'rgba(255,255,255,0.97)' }}>
          <h1 className="text-xl font-semibold mb-1 text-center" style={{ color: isNight ? '#f0ebe0' : '#1a2a3a', fontFamily: 'var(--font-serif), serif' }}>
            Contact Developer
          </h1>
          <p className="text-xs text-center mb-6" style={{ color: isNight ? '#8aa0b8' : '#5a6070' }}>
            TAYAN is built with care for the aviation community
          </p>

          <div className="space-y-4">
            {/* Name */}
            <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: isNight ? 'rgba(255,255,255,0.05)' : '#f5f3ef' }}>
              <div style={{ color: isNight ? '#e8a050' : '#2a5a6a' }}><UserIcon /></div>
              <div>
                <p className="text-[10px] uppercase tracking-wider" style={{ color: isNight ? '#6a8090' : '#8a9098' }}>Developer</p>
                <p className="text-sm font-medium" style={{ color: isNight ? '#f0ebe0' : '#1a2a3a' }}>P-S</p>
              </div>
            </div>

            {/* Email */}
            <a href="mailto:Pilan.s112@gmail.com" className="flex items-center gap-3 p-3 rounded-xl transition-all hover:scale-[1.02]" style={{ background: isNight ? 'rgba(255,255,255,0.05)' : '#f5f3ef' }}>
              <div style={{ color: isNight ? '#e8a050' : '#e87060' }}><MailIcon /></div>
              <div>
                <p className="text-[10px] uppercase tracking-wider" style={{ color: isNight ? '#6a8090' : '#8a9098' }}>Email</p>
                <p className="text-sm font-medium" style={{ color: isNight ? '#f0ebe0' : '#1a2a3a' }}>Pilan.s112@gmail.com</p>
              </div>
            </a>
          </div>
        </div>

        {/* Back link */}
        <div className="text-center mt-6">
          <button
            onClick={() => router.push('/')}
            className="text-xs transition-opacity hover:opacity-80"
            style={{ color: isNight ? '#8aa0b8' : 'rgba(255,255,255,0.8)' }}
          >
            Back to terminal
          </button>
        </div>
      </motion.div>
    </div>
  );
}
