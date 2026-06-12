'use client';

import { SignIn } from '@clerk/nextjs';
import { useTheme } from '../../theme-provider';
import { ThemeToggle } from '../../theme-provider';

function AirplaneIcon({ size = 80 }: { size?: number }) {
  return (
    <svg width={size} height={size * 0.5} viewBox="0 0 200 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 48 Q30 38 60 36 L170 36 Q185 36 192 42 Q198 48 192 54 Q185 60 170 60 L60 60 Q30 58 20 48Z" fill="#f0ebe0"/>
      <path d="M30 52 Q60 62 120 62 Q160 62 185 56 Q190 54 188 52 L170 60 L60 60 Q35 58 30 52Z" fill="#d4d0c8" opacity="0.5"/>
      <path d="M40 46 L180 46 L180 48 L40 48Z" fill="#4b2d8e"/>
      <path d="M40 48 L180 48 L180 49 L40 49Z" fill="#c4a44e"/>
      <path d="M28 48 L20 20 L40 22 L42 40Z" fill="#4b2d8e"/>
      <path d="M24 30 L36 32 L36 34 L25 33Z" fill="#c4a44e"/>
      <path d="M22 46 L10 38 L18 37 L30 44Z" fill="#d8d4cc"/>
      <path d="M22 50 L10 58 L18 59 L30 52Z" fill="#d8d4cc"/>
      <path d="M80 55 L65 88 L130 88 L115 55Z" fill="#c8c4bc"/>
      <path d="M80 52 L68 80 L125 80 L112 52Z" fill="#d8d4cc"/>
      <ellipse cx="88" cy="82" rx="7" ry="5" fill="#8a8680"/>
      <ellipse cx="112" cy="82" rx="7" ry="5" fill="#8a8680"/>
      <g fill="#5b9bd5" opacity="0.6">
        <rect x="55" y="42" width="3" height="5" rx="1.5"/>
        <rect x="62" y="42" width="3" height="5" rx="1.5"/>
        <rect x="69" y="42" width="3" height="5" rx="1.5"/>
        <rect x="76" y="42" width="3" height="5" rx="1.5"/>
        <rect x="83" y="42" width="3" height="5" rx="1.5"/>
        <rect x="90" y="42" width="3" height="5" rx="1.5"/>
        <rect x="97" y="42" width="3" height="5" rx="1.5"/>
      </g>
      <path d="M182 40 Q190 44 190 48 Q190 52 182 56" fill="#5a9ad5" opacity="0.7"/>
      <ellipse cx="112" cy="28" rx="4" ry="8" fill="#f0ebe0"/>
    </svg>
  );
}

export default function LoginPage() {
  const { theme } = useTheme();
  const isNight = theme === 'night';

  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden" style={{ background: isNight ? '#1a2040' : '#5b9bd5' }}>
      <ThemeToggle />

      {/* Background clouds */}
      <div className="absolute inset-0 pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" fill="none">
          <g opacity={isNight ? '0.15' : '0.4'}>
            <ellipse cx="200" cy="200" rx="100" ry="40" fill={isNight ? '#2a3a5a' : '#f5e8c8'}/>
            <ellipse cx="260" cy="195" rx="70" ry="32" fill={isNight ? '#2a3a5a' : '#fff8e8'}/>
            <ellipse cx="900" cy="150" rx="110" ry="45" fill={isNight ? '#2a3a5a' : '#f5e8c8'}/>
            <ellipse cx="970" cy="145" rx="75" ry="35" fill={isNight ? '#2a3a5a' : '#fff8e8'}/>
          </g>
          {/* Sun/Moon */}
          {isNight ? (
            <circle cx="900" cy="120" r="40" fill="#f0e8d0" opacity="0.6"/>
          ) : (
            <circle cx="200" cy="600" r="180" fill="#f0e8a0" opacity="0.5"/>
          )}
          {/* Bottom clouds */}
          <g opacity={isNight ? '0.2' : '0.6'}>
            <ellipse cx="300" cy="720" rx="200" ry="80" fill={isNight ? '#3a2040' : '#e87060'}/>
            <ellipse cx="600" cy="740" rx="250" ry="70" fill={isNight ? '#2a1a30' : '#e89050'}/>
            <ellipse cx="900" cy="730" rx="200" ry="80" fill={isNight ? '#3a2040' : '#e87060'}/>
          </g>
        </svg>
      </div>

      <div className="relative z-10 flex flex-col items-center">
        {/* Airplane decoration */}
        <div className="mb-6" style={{ color: isNight ? '#e8a050' : '#2a5a6a' }}>
          <AirplaneIcon size={100} />
        </div>

        <h1 className="text-2xl font-semibold mb-6 text-center" style={{ color: isNight ? '#f0ebe0' : '#ffffff', fontFamily: 'var(--font-serif), serif' }}>
          Crew Login
        </h1>

        {/* Clerk SignIn component */}
        <SignIn
          appearance={{
            elements: {
              rootBox: 'w-full max-w-sm',
              card: 'rounded-2xl shadow-xl border-0',
              headerTitle: 'text-lg font-semibold',
              headerSubtitle: 'text-sm opacity-70',
              socialButtonsBlockButton: 'rounded-xl',
              formButtonPrimary: 'rounded-xl bg-[#e87060] hover:bg-[#d06050]',
            },
          }}
          routing="hash"
          forceRedirectUrl="/dashboard"
        />

        <button
          onClick={() => window.location.href = '/'}
          className="mt-6 text-xs transition-opacity hover:opacity-80"
          style={{ color: isNight ? '#8aa0b8' : 'rgba(255,255,255,0.7)' }}
        >
          Back to terminal
        </button>
      </div>
    </div>
  );
}
