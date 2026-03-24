import React from "react";

export const AnimatedBackground: React.FC = () => (
  <div
    className="fixed inset-0 overflow-hidden pointer-events-none z-0"
    aria-hidden="true"
  >
    {/* Gradient base */}
    <div className="absolute inset-0 bg-gradient-to-br from-[#0d0d1a] via-surface to-[#0a0d10]" />

    {/* Noise texture */}
    <div
      className="absolute inset-0 opacity-[0.025]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
        backgroundSize: "256px 256px",
      }}
    />

    {/* Orb — top left violet */}
    <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-accent-violet/10 blur-[80px] animate-float" />

    {/* Orb — top right teal */}
    <div className="absolute -top-20 right-1/4 w-64 h-64 rounded-full bg-accent-teal/8 blur-[70px] animate-float-delayed" />

    {/* Orb — center left lime */}
    <div className="absolute top-1/3 -left-20 w-56 h-56 rounded-full bg-accent-lime/6 blur-[60px] animate-float-slow" />

    {/* Orb — bottom right violet */}
    <div className="absolute -bottom-24 -right-16 w-72 h-72 rounded-full bg-accent-violet/8 blur-[80px] animate-float-x" />

    {/* Subtle grid lines */}
    <div
      className="absolute inset-0 opacity-[0.018]"
      style={{
        backgroundImage:
          "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
      }}
    />
  </div>
);
