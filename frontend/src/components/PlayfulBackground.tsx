'use client'

/**
 * @file Provides the animated landing-page background composed of gradients, SVG flourishes, and CSS keyframes.
 * Runs entirely on the client to keep the marketing hero lively without extra markup at the page level.
 */

import React from 'react'

export default function PlayfulBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-white">
      {/* Visible gradient orbs */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-20 -left-20 w-96 h-96 bg-gradient-to-br from-blue-100/60 to-indigo-100/60 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-br from-purple-100/60 to-blue-100/60 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-20 left-1/2 w-96 h-96 bg-gradient-to-br from-slate-100/60 to-blue-100/60 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Abstract floating document/paper elements */}
      <div className="absolute top-1/4 right-1/4 opacity-[0.08] animate-float-slow">
        <svg width="120" height="140" viewBox="0 0 120 140" fill="none">
          <rect
            x="10"
            y="0"
            width="100"
            height="130"
            rx="8"
            fill="currentColor"
            className="text-blue-400"
          />
          <line
            x1="25"
            y1="25"
            x2="95"
            y2="25"
            stroke="white"
            strokeWidth="3"
          />
          <line
            x1="25"
            y1="45"
            x2="95"
            y2="45"
            stroke="white"
            strokeWidth="3"
          />
          <line
            x1="25"
            y1="65"
            x2="75"
            y2="65"
            stroke="white"
            strokeWidth="3"
          />
          <circle cx="85" cy="100" r="15" fill="white" opacity="0.3" />
        </svg>
      </div>

      <div className="absolute bottom-1/3 left-1/4 opacity-[0.08] animate-float animation-delay-2000">
        <svg width="100" height="120" viewBox="0 0 100 120" fill="none">
          <rect
            x="5"
            y="0"
            width="90"
            height="110"
            rx="6"
            fill="currentColor"
            className="text-indigo-400"
          />
          <line
            x1="20"
            y1="20"
            x2="80"
            y2="20"
            stroke="white"
            strokeWidth="2.5"
          />
          <line
            x1="20"
            y1="35"
            x2="80"
            y2="35"
            stroke="white"
            strokeWidth="2.5"
          />
          <line
            x1="20"
            y1="50"
            x2="80"
            y2="50"
            stroke="white"
            strokeWidth="2.5"
          />
          <line
            x1="20"
            y1="65"
            x2="60"
            y2="65"
            stroke="white"
            strokeWidth="2.5"
          />
        </svg>
      </div>

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-[0.04]">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgb(148, 163, 184) 1px, transparent 1px),
              linear-gradient(to bottom, rgb(148, 163, 184) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Dots pattern */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 opacity-[0.05]">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `radial-gradient(circle, rgb(99, 102, 241) 2px, transparent 2px)`,
            backgroundSize: '30px 30px',
          }}
        />
      </div>

      {/* Floating checkmark icons */}
      <div className="absolute top-1/3 left-1/5 opacity-[0.12] animate-float animation-delay-1000">
        <svg
          width="60"
          height="60"
          viewBox="0 0 24 24"
          fill="none"
          className="text-green-500"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            fill="currentColor"
            fillOpacity="0.2"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M8 12l3 3 5-6"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div className="absolute top-2/3 right-1/5 opacity-[0.12] animate-float-slow animation-delay-3000">
        <svg
          width="50"
          height="50"
          viewBox="0 0 24 24"
          fill="none"
          className="text-blue-500"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            fill="currentColor"
            fillOpacity="0.2"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M8 12l3 3 5-6"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Decorative lines */}
      <svg
        className="absolute top-1/2 left-0 w-full h-full opacity-[0.04]"
        preserveAspectRatio="none"
      >
        <line
          x1="0%"
          y1="30%"
          x2="100%"
          y2="35%"
          stroke="currentColor"
          strokeWidth="1"
          className="text-blue-300"
        />
        <line
          x1="0%"
          y1="60%"
          x2="100%"
          y2="58%"
          stroke="currentColor"
          strokeWidth="1"
          className="text-indigo-300"
        />
      </svg>

      <style jsx>{`
        @keyframes blob {
          0%,
          100% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(2deg);
          }
        }

        @keyframes float-slow {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-30px) rotate(-2deg);
          }
        }

        .animate-blob {
          animation: blob 12s ease-in-out infinite;
        }

        .animate-float {
          animation: float 8s ease-in-out infinite;
        }

        .animate-float-slow {
          animation: float-slow 10s ease-in-out infinite;
        }

        .animation-delay-1000 {
          animation-delay: 1s;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-3000 {
          animation-delay: 3s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}
