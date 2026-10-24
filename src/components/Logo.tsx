/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Official CODELIX Logo Component
 * Faithful vector rendering of the official 3D curved "C" with inner `< >` code brackets
 */

import React from 'react';

interface LogoProps {
  variant?: 'horizontal' | 'vertical' | 'icon-only';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  light?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'horizontal',
  size = 'md',
  className = '',
  light = false,
}) => {
  // Dimensions
  const iconSizes = {
    sm: 32,
    md: 42,
    lg: 56,
    xl: 72,
  };

  const currentIconSize = iconSizes[size];

  // SVG of the official CODELIX 3D "C" symbol with inner code brackets < >
  const Emblem = (
    <svg
      width={currentIconSize}
      height={currentIconSize}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 transition-transform duration-300 hover:scale-105"
      aria-label="CODELIX Emblem"
    >
      <defs>
        {/* Gradients matching the official 3D icon */}
        <linearGradient id="cdx-gradient-top" x1="15" y1="10" x2="85" y2="85" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0066FF" />
          <stop offset="50%" stopColor="#00A2FF" />
          <stop offset="100%" stopColor="#00C8F0" />
        </linearGradient>

        <linearGradient id="cdx-gradient-fold" x1="10" y1="40" x2="60" y2="90" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0047BA" />
          <stop offset="60%" stopColor="#0066FF" />
          <stop offset="100%" stopColor="#00C8F0" />
        </linearGradient>

        <linearGradient id="cdx-gradient-brackets" x1="38" y1="40" x2="62" y2="60" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0052D4" />
          <stop offset="100%" stopColor="#00C8F0" />
        </linearGradient>

        <filter id="cdx-shadow" x="-10%" y="-10%" width="125%" height="125%" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#0047BA" floodOpacity="0.25" />
        </filter>
      </defs>

      {/* Main outer 3D stylized C shape */}
      <g filter="url(#cdx-shadow)">
        {/* Back and bottom curve */}
        <path
          d="M 68 18 C 50 12, 28 16, 20 32 C 12 48, 14 68, 26 80 C 38 90, 62 92, 76 80 C 78 78, 77 74, 73 72 L 56 65 C 50 71, 40 72, 34 67 C 27 61, 26 50, 30 42 C 34 34, 44 30, 52 33 L 70 23 C 72 21, 71 18, 68 18 Z"
          fill="url(#cdx-gradient-fold)"
        />

        {/* Top glossy sweep */}
        <path
          d="M 28 26 C 36 16, 52 14, 68 18 C 73 20, 75 24, 71 27 L 54 36 C 48 32, 40 33, 35 38 C 30 43, 29 52, 33 60 L 22 55 C 16 45, 18 34, 28 26 Z"
          fill="url(#cdx-gradient-top)"
        />

        {/* Central code bracket `< >` in the open core */}
        {/* Left bracket `<` */}
        <path
          d="M 44 42 L 36 49 L 36 51 L 44 58 L 47 55 L 40 50 L 47 45 Z"
          fill="url(#cdx-gradient-brackets)"
        />
        {/* Right bracket `>` */}
        <path
          d="M 56 42 L 64 49 L 64 51 L 56 58 L 53 55 L 60 50 L 53 45 Z"
          fill="url(#cdx-gradient-brackets)"
        />
      </g>
    </svg>
  );

  if (variant === 'icon-only') {
    return <div className={`inline-flex items-center ${className}`}>{Emblem}</div>;
  }

  return (
    <div
      className={`inline-flex ${
        variant === 'vertical' ? 'flex-col items-center text-center' : 'items-center gap-3'
      } ${className}`}
    >
      {Emblem}

      <div className={variant === 'vertical' ? 'mt-2' : ''}>
        <div className="flex items-center tracking-tight font-extrabold leading-none">
          <span
            className={`font-black ${
              light ? 'text-white' : 'text-[#0B192C]'
            } ${
              size === 'sm'
                ? 'text-lg'
                : size === 'md'
                ? 'text-2xl'
                : size === 'lg'
                ? 'text-3xl'
                : 'text-4xl'
            }`}
            style={{ letterSpacing: '0.04em' }}
          >
            CODEL
          </span>
          <span
            className={`font-black text-[#00C8F0] ${
              size === 'sm'
                ? 'text-lg'
                : size === 'md'
                ? 'text-2xl'
                : size === 'lg'
                ? 'text-3xl'
                : 'text-4xl'
            }`}
            style={{ letterSpacing: '0.04em' }}
          >
            IX
          </span>
        </div>

        <div
          className={`font-semibold tracking-[0.22em] uppercase leading-tight ${
            light ? 'text-cyan-200/80' : 'text-slate-600'
          } ${size === 'sm' ? 'text-[8px]' : size === 'md' ? 'text-[9.5px]' : 'text-[11px]'}`}
        >
          Building Digital Solutions.
        </div>
      </div>
    </div>
  );
};
