'use client'

import React from 'react'

export function BackgroundIllustration() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      {/* confetti bits */}
      <g opacity="0.95">
        <circle cx="210" cy="90" r="30" fill="#A967E7" />
        <polygon points="1070,100 1058,130 1090,130" fill="#4FAEFF" />
        <polygon points="615,105 605,130 630,130" fill="#62D090" />
        <circle cx="910" cy="80" r="10" fill="#FF856F" />
        <circle cx="985" cy="160" r="5" fill="#38C1A5" />
        <rect x="230" y="345" width="14" height="14" rx="2" fill="#4C9DFF" />
        <rect x="760" y="270" width="8" height="8" rx="2" fill="#F2BF38" />
        <polygon points="470,230 460,255 485,255" fill="#EF6FA1" />
        <circle cx="1210" cy="95" r="44" fill="#FF8D63" />
        <rect x="742" y="152" width="6" height="6" rx="1" fill="#2FC3FF" />
      </g>

      {/* faint sprinkles */}
      <g opacity="0.45">
        <circle cx="170" cy="210" r="2" fill="#87D3FF" />
        <circle cx="310" cy="180" r="2" fill="#87D3FF" />
        <circle cx="680" cy="120" r="2" fill="#87D3FF" />
        <circle cx="1020" cy="200" r="2" fill="#87D3FF" />
        <circle cx="1240" cy="260" r="2" fill="#87D3FF" />
      </g>

      {/* bottom swoosh */}
      <path
        d="M0 690 C 320 760, 1080 760, 1440 690"
        fill="none"
        stroke="#C4A0F5"
        strokeWidth="2"
        opacity="0.6"
      />

      {/* ===== LEFT CLUSTER (smaller, fully inside page) ===== */}
      {/* nudge in from the edge and sit just above swoosh */}
      <g transform="translate(250,650)">
        {/* back blob slightly below platform */}
        <ellipse
          cx="0"
          cy="22"
          rx="165" // width radius
          ry="115" // height radius (taller to match sketch)
          fill="#CFE5FF"
          opacity="0.62"
          transform="rotate(-24 0 22)" // <— tilt around its own center
        />
        {/* platform */}
        <ellipse cx="0" cy="0" rx="175" ry="32" fill="#2196F3" opacity="0.98" />

        {/* bars */}
        <g transform="translate(-8,-20)">
          <rect x="-18" y="-16" width="10" height="52" rx="3" fill="#0C6DE0" />
          <rect x="2" y="-8" width="10" height="40" rx="3" fill="#3EA0FF" />
          <rect x="22" y="-22" width="10" height="64" rx="3" fill="#1E80FF" />
        </g>

        {/* kids */}
        <g transform="translate(-72,-22)">
          <circle cx="0" cy="-18" r="9" fill="#FFB252" />
          <rect x="-6" y="-8" width="12" height="26" rx="4" fill="#F2CF4A" />
          <rect x="-13" y="-2" width="8" height="6" rx="3" fill="#F2CF4A" />
          <rect x="5" y="-2" width="8" height="6" rx="3" fill="#F2CF4A" />
          <rect x="-9" y="16" width="6" height="14" rx="3" fill="#1976D2" />
          <rect x="3" y="16" width="6" height="14" rx="3" fill="#1976D2" />
        </g>

        <g transform="translate(72,-16)">
          <circle cx="0" cy="-18" r="9" fill="#FFB252" />
          <rect x="-6" y="-8" width="12" height="26" rx="4" fill="#45C46A" />
          <rect x="-13" y="-2" width="8" height="6" rx="3" fill="#45C46A" />
          <rect x="5" y="-2" width="8" height="6" rx="3" fill="#45C46A" />
          <rect x="-9" y="16" width="6" height="14" rx="3" fill="#2A8C4D" />
          <rect x="3" y="16" width="6" height="14" rx="3" fill="#2A8C4D" />
        </g>
      </g>

      {/* ===== RIGHT CLUSTER (mirrored size/height) ===== */}
      <g transform="translate(1200,650)">
        <ellipse
          cx="0"
          cy="22"
          rx="165"
          ry="115"
          fill="#FFDDB7"
          opacity="0.65"
          transform="rotate(24 0 22)"
        />
        <ellipse cx="0" cy="0" rx="175" ry="32" fill="#FF962A" opacity="0.98" />

        <g transform="translate(-30,-12)">
          <circle cx="0" cy="-18" r="9" fill="#FFB252" />
          <rect x="-6" y="-8" width="12" height="26" rx="4" fill="#2E86FF" />
          <rect x="-13" y="-2" width="8" height="6" rx="3" fill="#2E86FF" />
          <rect x="5" y="-2" width="8" height="6" rx="3" fill="#2E86FF" />
          <rect x="-9" y="16" width="6" height="14" rx="3" fill="#1952B9" />
          <rect x="3" y="16" width="6" height="14" rx="3" fill="#1952B9" />
        </g>

        <g transform="translate(30,-12)">
          <circle cx="0" cy="-18" r="9" fill="#FFB252" />
          <rect x="-6" y="-8" width="12" height="26" rx="4" fill="#A64BFF" />
          <rect x="-13" y="-2" width="8" height="6" rx="3" fill="#A64BFF" />
          <rect x="5" y="-2" width="8" height="6" rx="3" fill="#A64BFF" />
          <rect x="-9" y="16" width="6" height="14" rx="3" fill="#6B2CCB" />
          <rect x="3" y="16" width="6" height="14" rx="3" fill="#6B2CCB" />
        </g>
      </g>
    </svg>
  )
}

export default BackgroundIllustration
