"use client";

import React, { useEffect, useState } from "react";

export default function RiskGauge({ score }) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(score);
    }, 100);
    return () => clearTimeout(timer);
  }, [score]);

  // Colors
  let color = "#10B981"; // Low (Green)
  if (score > 30) color = "#F59E0B"; // Moderate (Yellow)
  if (score > 70) color = "#EF4444"; // High (Red)

  const size = 220;
  const strokeWidth = 18;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  // 180 degree gauge
  const arcLength = circumference / 2;
  
  const progressOffset = arcLength - (animatedScore / 100) * arcLength;

  return (
    <div className="relative flex flex-col items-center justify-center w-full" style={{ height: '140px' }}>
      <svg width={size} height={size / 2 + strokeWidth} viewBox={`0 0 ${size} ${size / 2 + strokeWidth}`} className="drop-shadow-sm">
        <defs>
          <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="50%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#EF4444" />
          </linearGradient>
        </defs>
        
        {/* Background Track */}
        <path
          d={`M ${strokeWidth/2} ${size/2} A ${radius} ${radius} 0 0 1 ${size - strokeWidth/2} ${size/2}`}
          fill="none"
          stroke="#F3F4F6"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        
        {/* Progress Track */}
        <path
          d={`M ${strokeWidth/2} ${size/2} A ${radius} ${radius} 0 0 1 ${size - strokeWidth/2} ${size/2}`}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={arcLength}
          strokeDashoffset={progressOffset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)' }}
        />
      </svg>
      
      {/* Absolute text in the middle */}
      <div className="absolute bottom-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-black tracking-tighter" style={{ color }}>
          {animatedScore}%
        </span>
        <span className="text-sm font-semibold text-gray-500 uppercase tracking-widest mt-1">
          Risk Score
        </span>
      </div>
    </div>
  );
}
