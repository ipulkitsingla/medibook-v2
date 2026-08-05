"use client";

import React, { useEffect, useState } from "react";

export default function ShapBarChart({ shapValues }) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  // Find max absolute value to scale bars properly
  const maxAbsValue = Math.max(...shapValues.map(v => Math.abs(v.value)), 0.1);

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {shapValues.map((item, idx) => {
        const isPositive = item.value > 0;
        const barWidth = `${(Math.abs(item.value) / maxAbsValue) * 100}%`;
        
        return (
          <div key={idx} style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#374151', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '75%' }} title={item.feature}>
                {item.feature.replace(/_/g, ' ')}
              </span>
              <span style={{ fontSize: '12px', fontWeight: 700, color: isPositive ? '#f43f5e' : '#10b981' }}>
                {isPositive ? '+' : ''}{item.value.toFixed(3)}
              </span>
            </div>
            
            {/* Dual Bar Container (Center aligned origin) */}
            <div style={{ width: '100%', height: '12px', backgroundColor: '#f3f4f6', borderRadius: '9999px', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden', boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)' }}>
              {/* Midpoint line */}
              <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '1px', backgroundColor: '#d1d5db', zIndex: 10 }}></div>
              
              {/* Negative Bar (Left) */}
              <div style={{ width: '50%', height: '100%', display: 'flex', justifyContent: 'flex-end', paddingRight: '1px' }}>
                {!isPositive && (
                  <div 
                    style={{ height: '100%', backgroundImage: 'linear-gradient(to left, #34d399, #10b981)', borderTopLeftRadius: '9999px', borderBottomLeftRadius: '9999px', width: mounted ? barWidth : '0%', transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)' }}
                  />
                )}
              </div>
              
              {/* Positive Bar (Right) */}
              <div style={{ width: '50%', height: '100%', display: 'flex', justifyContent: 'flex-start', paddingLeft: '1px' }}>
                {isPositive && (
                  <div 
                    style={{ height: '100%', backgroundImage: 'linear-gradient(to right, #fb7185, #f43f5e)', borderTopRightRadius: '9999px', borderBottomRightRadius: '9999px', width: mounted ? barWidth : '0%', transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)' }}
                  />
                )}
              </div>
            </div>
          </div>
        );
      })}
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', marginTop: '4px', borderTop: '1px solid #f3f4f6', fontSize: '12px', color: '#6b7280', fontWeight: 500 }}>
        <div style={{ display: 'flex', alignItems: 'center' }}><span style={{ width: '8px', height: '8px', backgroundColor: '#10b981', borderRadius: '50%', marginRight: '6px', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}></span> Decreases Risk</div>
        <div style={{ display: 'flex', alignItems: 'center' }}><span style={{ width: '8px', height: '8px', backgroundColor: '#f43f5e', borderRadius: '50%', marginRight: '6px', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}></span> Increases Risk</div>
      </div>
    </div>
  );
}
